import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import base64 from 'base-64';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [idToken, setIdToken] = useState(null);
  const [measurements, setMeasurements] = useState({
    height: '',
    shoe_size: '',
    chest: '',
    waist: '',
    hips: ''
  });
  const [requestQueue, setRequestQueue] = useState([]);
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [googleId, setGoogleId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setMeasurements(parsedUser.measurements || measurements);
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadIdToken = async () => {
      try {
        const storedIdToken = await AsyncStorage.getItem('idToken');
        if (storedIdToken) {
          setIdToken(storedIdToken);
        }
      } catch (error) {
        console.error('Failed to load idToken from storage:', error);
      }
    };
    loadIdToken();
  }, []);

  useEffect(() => {
    const sendQueuedRequests = async () => {
      if (requestQueue.length > 0) {
        for (const request of requestQueue) {
          try {
            const response = await fetch(request.url, request.options);
            const data = await response;
            console.log('Queued request response:', data);
          } catch (error) {
            console.error('Failed to send queued request:', error);
            return;
          }
        }
        setRequestQueue([]);
      }
    };

    const handleConnectivityChange = (isConnected) => {
      if (isConnected) {
        sendQueuedRequests();
      }
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      handleConnectivityChange(state.isConnected);
    });

    return () => unsubscribe();
  }, [requestQueue]);

  const signInUser = async (userInfo) => {
   //console.log('signInUser, token:' , idToken != null);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      setMeasurements(userInfo.measurements || measurements);
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  };

  const signOutUser = async () => {
    //console.log('signOutUser, token:' , idToken != null);
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('idToken');
      await AsyncStorage.removeItem('googleId');
      setUser(null);
      setMeasurements({
        height: '',
        shoe_size: '',
        chest: '',
        waist: '',
        hips: ''
      });
      setIdToken(null); 
      setGoogleId(null); 
      console.log('Google ID logginig out:', googleId);
    } catch (error) {
        console.error('Failed to remove user from storage:', error);
    }
};

const updateMeasurements = async (newMeasurements) => {
    //console.log('updateMeasurements, token:' , idToken != null);
  setMeasurements(newMeasurements);
  if (user) {
    const updatedUser = { ...user, measurements: newMeasurements };
    setUser(updatedUser);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user measurements in storage:', error);
    }
    updateMeasurementsOnServer(newMeasurements);
  }
};

const refreshGoogleToken = async () => {
    if (idToken == null) {
        return;
    }
    if (isRefreshingToken) {
      console.log('Token refresh already in progress');
      return;
    }
    setIsRefreshingToken(true);
    try {
        GoogleSignin.configure({
            scopes: ['email', 'profile'], 
            webClientId: GOOGLE_WEB_CLIENT_ID, 
          });
          
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signInSilently();
        const {type, data} = userInfo;
        const {scopes, serverAuthCode, idToken, user} = data;
        const {email, familyName, givenName, id, name, photo} = user;
        await signInUser({ id, name, email, photo });
        //synchronizeUserData(idToken, email);
        setIdToken(idToken);
        await AsyncStorage.setItem('idToken', idToken);
        //console.log('Token refreshed successfully:', idToken);
    } catch (error) {
        console.error('Failed to refresh Google token:', error);
    } finally {
      setIsRefreshingToken(false);
    }
};

const checkTokenValidity = async () => {
    console.log('checkTokenValidity, token:' , idToken != null);
    if (!idToken){
        console.log("No token found");
        refreshGoogleToken();
        return;
    }
  const data = idToken;

  const parts = data.split(".");
  const payload = JSON.parse(base64.decode(parts[1]));

  //console.log(data);
  //console.log(payload);

  //console.log(Math.floor(Date.now() / 1000), "JWT payload", payload?.exp);
  if (Math.floor(Date.now() / 1000) >= payload?.exp) {
    console.log("your token expiered");
    refreshGoogleToken();
  } else {
    //console.log("your token is up to date");
  }
};

const updateMeasurementsOnServer = async (newMeasurements) => {
   checkTokenValidity(); // Check token validity before making the request

  if (!user || !idToken) return;
  const request = {
    url: 'http://188.166.135.109/profile',
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(newMeasurements) 
    }
  };
  try {
    const response = await fetch(request.url, request.options);
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
      } else {
        console.log('Update measurements response:', await response.text());
      }
    } else {
      console.error('Failed to update measurements on server:', response);
    }
  } catch (error) {
    console.error('Failed to update measurements on server:', error);
    setRequestQueue([...requestQueue, request]);
  }
};

const synchronizeUserData = async (idToken, email) => {
  checkTokenValidity(); // Check token validity before making the request

  const requestGet = {
    url: 'http://188.166.135.109/profile',
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    }
  };

  const requestPost = {
    url: 'http://188.166.135.109/profile',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ email })
    }
  };

  try {
    let response = await fetch(requestGet.url, requestGet.options);
    if (response.status === 404) {
      response = await fetch(requestPost.url, requestPost.options);
    }
    if (response.status === 403) {
      console.warn('Generate a new token');
      checkTokenValidity();
      synchronizeUserData(idToken, email);
    }
    const data = await response.json();
    setIdToken(idToken);
    await AsyncStorage.setItem('idToken', idToken);
    await AsyncStorage.setItem('googleId', data.google_id);
    const newMeasurements = {
      height: data.height || '',
      shoe_size: data.shoe_size || '',
      chest: data.chest || '',
      waist: data.waist || '',
      hips: data.hips || ''
    };
    setMeasurements(newMeasurements); // Update measurements state
    console.log(data.google_id);
    setGoogleId(data.google_id); // Set googleId state // Store googleId in AsyncStorage
    console.log('Google ID logginig in:', googleId);
    try {
      await AsyncStorage.setItem('measurements', JSON.stringify(newMeasurements));
    } catch (error) {
      console.error('Failed to save measurements to storage:', error);
    }
    console.log('Synchronization response:', data);
  } catch (error) {
    console.error('Failed to synchronize user data, adding to queue:', error);
    setRequestQueue([...requestQueue, requestGet, requestPost]);
  }
};

  return (
    <UserContext.Provider value={{ user, signInUser, signOutUser, measurements, updateMeasurements, synchronizeUserData, idToken, setIdToken, checkTokenValidity, refreshGoogleToken, googleId }}>
      {children}
    </UserContext.Provider>
  );
};
