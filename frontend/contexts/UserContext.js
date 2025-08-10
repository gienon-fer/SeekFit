import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import base64 from 'base-64';

// Remove the circular import
// import { useCalendar } from './CalendarContext';

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
  // const [requestQueue, setRequestQueue] = useState([]);
  // const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [googleId, setGoogleId] = useState('guest'); // Initialize with 'guest' to avoid null rendering
  const [onSignOut, setOnSignOut] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Load user-specific measurements if available
          const userMeasurements = await loadUserMeasurements(parsedUser.id);
          if (userMeasurements) {
            setMeasurements(userMeasurements);
          } else {
            setMeasurements(parsedUser.measurements || measurements);
          }
          
          // Set the googleId state from stored user
          setGoogleId(parsedUser.id);
        } else {
          // If no user is found, explicitly set googleId to 'guest'
          setGoogleId('guest');
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        // Fallback to guest user in case of error
        setGoogleId('guest');
      }
    };
    loadUser();
  }, []);

  // Load user-specific measurements from AsyncStorage
  const loadUserMeasurements = async (userId) => {
    try {
      const storedMeasurements = await AsyncStorage.getItem(`measurements_${userId}`);
      if (storedMeasurements) {
        return JSON.parse(storedMeasurements);
      }
      return null;
    } catch (error) {
      console.error('Failed to load user measurements:', error);
      return null;
    }
  };

  // Save user-specific measurements to AsyncStorage
  const saveUserMeasurements = async (userId, newMeasurements) => {
    try {
      await AsyncStorage.setItem(`measurements_${userId}`, JSON.stringify(newMeasurements));
    } catch (error) {
      console.error('Failed to save user measurements:', error);
    }
  };

  const clearGuestData = async () => {
    try {
      // Get all stored clothes
      const storedClothes = await AsyncStorage.getItem('clothes');
      if (storedClothes) {
        const allClothes = JSON.parse(storedClothes);
        // Filter out guest clothes
        const nonGuestClothes = allClothes.filter(item => item.owner !== 'guest');
        await AsyncStorage.setItem('clothes', JSON.stringify(nonGuestClothes));
      }
      
      // Get all stored outfits
      const storedOutfits = await AsyncStorage.getItem('outfits');
      if (storedOutfits) {
        const allOutfits = JSON.parse(storedOutfits);
        // Filter out guest outfits
        const nonGuestOutfits = allOutfits.filter(item => item.owner !== 'guest');
        await AsyncStorage.setItem('outfits', JSON.stringify(nonGuestOutfits));
      }
      
      // Clear guest calendar data
      const storedCalendarData = await AsyncStorage.getItem('calendarOutfits');
      if (storedCalendarData) {
        const allCalendarData = JSON.parse(storedCalendarData);
        if (allCalendarData['guest']) {
          delete allCalendarData['guest'];
          await AsyncStorage.setItem('calendarOutfits', JSON.stringify(allCalendarData));
        }
      }
    } catch (error) {
      console.error('Failed to clear guest data:', error);
    }
  };

  const signInUser = async (userInfo) => {
    try {
      // Before signing in, clear any guest data
      await clearGuestData();
      
      // Save the user info to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      // Set googleId
      setGoogleId(userInfo.id);
      
      // Load user-specific measurements if they exist
      const userMeasurements = await loadUserMeasurements(userInfo.id);
      if (userMeasurements) {
        setMeasurements(userMeasurements);
      } else if (userInfo.measurements) {
        setMeasurements(userInfo.measurements);
        // Save measurements specifically for this user
        await saveUserMeasurements(userInfo.id, userInfo.measurements);
      }
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  };

  const signOutUser = async () => {
    try {
      // Save current measurements before signing out if there's a user
      if (user && user.id) {
        await saveUserMeasurements(user.id, measurements);
      }
      
      await AsyncStorage.removeItem('user');
      // Keep the stored idToken and googleId in AsyncStorage for potential future use
      
      setUser(null);
      setMeasurements({
        height: '',
        shoe_size: '',
        chest: '',
        waist: '',
        hips: ''
      });
      setIdToken(null); 
      
      // Set to guest ID when signing out
      setGoogleId('guest');
      
      // Call the onSignOut handler if it exists
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
        console.error('Failed to remove user from storage:', error);
    }
  };

  const updateMeasurements = async (newMeasurements) => {
    setMeasurements(newMeasurements);
    if (user) {
      const updatedUser = { ...user, measurements: newMeasurements };
      setUser(updatedUser);
      try {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        // Also save to user-specific measurements storage
        await saveUserMeasurements(user.id, newMeasurements);
      } catch (error) {
        console.error('Failed to update user measurements in storage:', error);
      }
      // Comment out server update
      // updateMeasurementsOnServer(newMeasurements);
    }
  };

  // Comment out token handling methods
  /*
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
            webClientId: '292694167327-ho7su5mm59m6flj45i4hge1m9h0n73b4.apps.googleusercontent.com', 
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
  */
  
  // Simplified token methods that do nothing but satisfy interfaces
  const refreshGoogleToken = async () => {
    console.log("Token refresh disabled - using local storage only");
  };
  
  const checkTokenValidity = async () => {
    console.log("Token validation disabled - using local storage only");
  };

  /*
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
  */

  const synchronizeUserData = async (idToken, email) => {
    // Instead of server sync, just store the token and update Google ID
    try {
      // Store the token for potential future use
      setIdToken(idToken);
      await AsyncStorage.setItem('idToken', idToken);
      
      // If we have a user, set the googleId
      if (user && user.id) {
        setGoogleId(user.id);
        await AsyncStorage.setItem('googleId', user.id);
      }
      
      // Load user-specific measurements
      if (user && user.id) {
        const userMeasurements = await loadUserMeasurements(user.id);
        if (userMeasurements) {
          setMeasurements(userMeasurements);
        }
      }
    } catch (error) {
      console.error('Failed to synchronize user data:', error);
    }
  };

  /*
  const synchronizeUserData = async (idToken, email) => {
    // Check if we have internet connection
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      console.log('No internet connection. Using locally stored measurements.');
      // If user exists, load their measurements from local storage
      if (user && user.id) {
        const userMeasurements = await loadUserMeasurements(user.id);
        if (userMeasurements) {
          setMeasurements(userMeasurements);
        }
      }
      return;
    }
    
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
  */

  return (
    <UserContext.Provider value={{ 
      user, 
      signInUser, 
      signOutUser, 
      measurements, 
      updateMeasurements, 
      synchronizeUserData, 
      idToken, 
      setIdToken, 
      checkTokenValidity, 
      refreshGoogleToken, 
      googleId,
      loadUserMeasurements,
      saveUserMeasurements,
      setOnSignOut,
      clearGuestData
    }}>
      {children}
    </UserContext.Provider>
  );
};
