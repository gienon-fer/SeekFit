import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useUser } from './UserContext'; // Import useUser

const OutfitContext = createContext();

export function useOutfit() {
  return useContext(OutfitContext);
}

export function OutfitProvider({ children }) {
  const [outfits, setOutfits] = useState([]);
  const [requestQueue, setRequestQueue] = useState([]);
  const { idToken, checkTokenValidity, refreshGoogleToken, googleId } = useUser();

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const storedOutfits = await AsyncStorage.getItem('outfits');
        if (storedOutfits) {
          setOutfits(JSON.parse(storedOutfits));
        }
      } catch (err) {
        console.error('Error loading outfits from AsyncStorage:', err);
      }
    };

    loadOutfits();
  }, []);

  useEffect(() => {
    const sendQueuedRequests = async () => {
      if (requestQueue.length > 0) {
        for (const { request, id } of requestQueue) {
          try {
            const response = await fetch(request.url, request.options);
            const data = await response.json();
            console.log('Queued request response:', data);
            if (response.ok) {
              const updatedOutfitsWithServerId = outfits.map(item =>
                item.id === id ? { ...item, serverId: data.id } : item
              );
              await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfitsWithServerId));
              setOutfits(updatedOutfitsWithServerId);
            }
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

  useEffect(() => {
    if (googleId) {
      synchronizeOutfits();
    }
  }, [googleId]);

  const addOutfit = async (newOutfit) => {
    await checkTokenValidity(); // Check token validity before making the request

    const id_ = Date.now().toString();
    const updatedOutfits = [...outfits, { ...newOutfit, id: id_, owner: googleId }];
    await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
    setOutfits(updatedOutfits);

    const outfitToSend = {
      ...newOutfit,
      owner: googleId, 
      tags: {
        ...newOutfit.tags,
      }
    };

    const request = {
      url: 'http://188.166.135.109/outfits',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(outfitToSend)
      }
    };
    console.log('outfit to add:', outfitToSend);

    const sendRequest = async (retry = false) => {
      try {
        const response = await fetch(request.url, request.options);
        if (response.status === 403 && !retry) {
          console.log('Token expired, refreshing token...');
          await refreshGoogleToken();
          request.options.headers['Authorization'] = `Bearer ${idToken}`;
          return sendRequest(true);
        }
        if (!response.ok) {
          throw new Error('Failed to add outfit to database');
        }
        const data = await response.json();
        console.log('Outfit added:', data);
        const updatedOutfitsWithServerId = updatedOutfits.map(item =>
          item.id === id_ ? { ...item, serverId: data.id } : item
        );
        await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfitsWithServerId));
        setOutfits(updatedOutfitsWithServerId);
        console.log('Outfit:', updatedOutfitsWithServerId);
      } catch (error) {
        console.error('Error adding outfit to database:', error);
        setRequestQueue([...requestQueue, { request, id: id_ }]);
      }
    };

    await sendRequest();
  };

  const removeOutfit = async (id) => {
    await checkTokenValidity(); 

    const updatedOutfits = outfits.filter((item) => item.id !== id);
    await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
    setOutfits(updatedOutfits);

    const serverId_ = outfits.find((item) => item.id === id)?.serverId;

    if (!serverId_) {
      console.error('Server ID not found for the outfit item');
      return;
    }

    const request = {
      url: `http://188.166.135.109/outfits/${serverId_}`,
      options: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      }
    };

    const sendRequest = async (retry = false) => {
      try {
        const response = await fetch(request.url, request.options);
        if (response.status === 403 && !retry) {
          console.log('Token expired, refreshing token...');
          await refreshGoogleToken();
          request.options.headers['Authorization'] = `Bearer ${idToken}`;
          return sendRequest(true);
        }
        if (response.status === 404 && !retry) {
          console.log('Resource not found, refreshing token...');
          await refreshGoogleToken();
          request.options.headers['Authorization'] = `Bearer ${idToken}`;
          return sendRequest(true);
        }
        if (!response.ok) {
          throw new Error('Failed to remove outfit from database');
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error removing outfit from database:', error);
        setRequestQueue([...requestQueue, { request, id }]);
      }
    };

    await sendRequest();
  };

  const editOutfit = async (id, updatedOutfit) => {
    await checkTokenValidity(); // Check token validity before making the request

    try {
      const updatedOutfits = outfits.map((item) =>
        item.id === id ? { ...item, ...updatedOutfit } : item
      );
      await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
      setOutfits(updatedOutfits);

      const outfitToSend = { ...updatedOutfit };
      const serverId_ = outfits.find((item) => item.id === id).serverId;
      delete outfitToSend.serverId;
      console.log('outfit to edit:', outfitToSend);
      const request = {
        url: `http://188.166.135.109/outfits/${serverId_}`,
        options: {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(outfitToSend)
        }
      };
      const response = await fetch(request.url, request.options);
      if (!response.ok) {
        throw new Error('Failed to edit outfit in database');
      }
      const updatedOutfitFromDB = await response.json();
      console.log('outfit just edited: ', updatedOutfitFromDB);
      const updatedOutfitWithServerId = {
        ...updatedOutfitFromDB,
        serverId: updatedOutfitFromDB.id,
        owner: updatedOutfitFromDB.owner_id,
        id: id, // Assuming updatedOutfit is the original item with the previous id
      };
      const currentOutfits = outfits.map((item) =>
        item.id === id ? updatedOutfitWithServerId : item
      );
      await AsyncStorage.setItem('outfits', JSON.stringify(currentOutfits));
      setOutfits(currentOutfits);
    } catch (error) {
      console.error('Error editing outfit in database:', error);
      setRequestQueue([...requestQueue, { request, id }]);
    }
  };

  const synchronizeOutfits = async () => {
    await checkTokenValidity(); // Check token validity before making the request

    try {
      const response = await fetch('http://188.166.135.109/outfits/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch outfits from database');
      }

      const data = await response.json();
      console.log('Outfits from database:', data);

      const updatedOutfits = data.map(item => ({
        ...item,
        id: item.id, // Ensure id is a string
        serverId: item.id,
        owner: item.owner_id
      }));

      await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
      setOutfits(updatedOutfits);
    } catch (error) {
      console.error('Error fetching outfits from database:', error);
    }
  };

  const resetOutfits = async () => {
    try {
      await AsyncStorage.removeItem('outfits');
      setOutfits([]);
    } catch (err) {
      console.error('Error resetting outfits in AsyncStorage:', err);
    }
  };

  return (
    <OutfitContext.Provider value={{ outfits, addOutfit, removeOutfit, editOutfit, resetOutfits, synchronizeOutfits }}>
      {children}
    </OutfitContext.Provider>
  );
}

