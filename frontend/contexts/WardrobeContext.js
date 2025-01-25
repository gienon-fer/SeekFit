import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useUser } from './UserContext'; 

const WardrobeContext = createContext();

export function useWardrobe() {
  return useContext(WardrobeContext);
}

export function WardrobeProvider({ children }) {
    const [outfits, setOutfits] = useState([]);
    const [requestQueue, setRequestQueue] = useState([]);
    const { idToken, checkTokenValidity, refreshGoogleToken, googleId } = useUser();
    const [clothes, setClothes] = useState([]);

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

    useEffect(() => {
        const loadClothes = async () => {
            try {
                const storedClothes = await AsyncStorage.getItem('clothes');
                if (storedClothes) {
                    setClothes(JSON.parse(storedClothes));
                }
            } catch (err) {
                console.error('Error loading clothes from AsyncStorage:', err);
            }
        };

        loadClothes();
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
                            const updatedClothesWithServerId = clothes.map(item =>
                                item.id === id ? { ...item, serverId: data.id } : item
                            );
                            await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothesWithServerId));
                            setClothes(updatedClothesWithServerId);
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
            synchronizeClothing();
        }
    }, [googleId]);
  
    const extractServerId = (clothingList) => {
      return clothingList.map(item => item.serverId);
    };
  
    const addOutfit = async (newOutfit) => {
      await checkTokenValidity(); // Check token validity before making the request
  
      const id_ = Date.now().toString();
      const updatedOutfits = [...outfits, { ...newOutfit, id: id_, owner: googleId }];
      await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
      setOutfits(updatedOutfits);
  
      const originalClothing = newOutfit.clothing; // Remember the original clothing list
  
      const outfitToSend = {
        ...newOutfit,
        owner: googleId, 
        tags: {
          ...newOutfit.tags,
        },
        clothing: extractServerId(newOutfit.clothing) // Only include server IDs
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
            item.id === id_ ? { 
              ...item, 
              serverId: data.id,
              clothing: data.clothing.map(clothingId => {
                const clothingItem = originalClothing.find(c => c.serverId === clothingId && c.owner === googleId);
                return clothingItem ? clothingItem : { serverId: clothingId, owner: googleId };
              }) // Map back to clothing items
            } : item
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
  
        const originalClothing = updatedOutfit.clothing; // Remember the original clothing list
        console.log('clothing of the outfit before edit:', originalClothing);
        const outfitToSend = {
          ...updatedOutfit,
          clothing: extractServerId(updatedOutfit.clothing) // Only include server IDs
        };
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
        //console.log('outfit just edited: ', updatedOutfitFromDB);
        //console.log('server id:', updatedOutfitFromDB.id, updatedOutfitFromDB.owner_id);
        const c = updatedOutfitFromDB.clothing.map(clothingId => {
          const clothingItem = originalClothing.find(c => c.serverId === clothingId);
          return clothingItem ? clothingItem : { serverId: clothingId};
        }) // Map back to clothing items
        console.log("c:lothing after returning: ", c );
        const updatedOutfitWithServerId = {
          ...updatedOutfitFromDB,
          serverId: updatedOutfitFromDB.id,
          owner: updatedOutfitFromDB.owner_id,
          id: id, // Assuming updatedOutfit is the original item with the previous id
          clothing: originalClothing,
          image: updatedOutfit.image // Preserve the outfit image
          } // Map back to clothing items
  
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
          owner: item.owner_id,
          clothing: getClothingByServerIds(item.clothing, clothes) // Set clothing field using getClothingByServerIds
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

    const addClothing = async (newClothing) => {
        await checkTokenValidity(); // Check token validity before making the request

        const id_ = Date.now().toString();
        const updatedClothes = [...clothes, { ...newClothing, id: id_, owner: googleId }];
        await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes));
        setClothes(updatedClothes);

        const clothingToSend = {
            ...newClothing,
            owner: googleId, // Assign owner Google ID
            tags: {
                ...newClothing.tags,
                sizeTags: newClothing.tags.sizeTags ? [newClothing.tags.sizeTags] : []
            }
        };

        const request = {
            url: 'http://188.166.135.109/clothing',
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify(clothingToSend)
            }
        };
        console.log('clothing to add:', clothingToSend);

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
                    throw new Error('Failed to add clothing to database');
                }
                const data = await response.json();
                const updatedClothesWithServerId = updatedClothes.map(item =>
                    item.id === id_ ? { ...item, serverId: data.id } : item
                );
                await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothesWithServerId));
                setClothes(updatedClothesWithServerId);
                console.log('Clothing:', updatedClothesWithServerId);
            } catch (error) {
                console.error('Error adding clothing to database:', error);
                setRequestQueue([...requestQueue, { request, id: id_ }]);
            }
        };

        await sendRequest();
    };

    const removeClothing = async (id) => {
        await checkTokenValidity(); 

        const updatedClothing = clothes.filter((item) => item.id !== id);
        await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothing));
        setClothes(updatedClothing);

        const serverId_ = clothes.find((item) => item.id === id)?.serverId;

        if (!serverId_) {
            console.error('Server ID not found for the clothing item');
            return;
        }

        const request = {
            url: `http://188.166.135.109/clothing/${serverId_}`,
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
                    throw new Error('Failed to remove clothing from database');
                }
                // Iterate over outfits and delete the clothing tags that point to the removed item
                if (outfits) {
                    outfits.forEach(async (outfit) => {
                        const updatedClothing = outfit.clothing.filter((clothing) => clothing.id !== id);
                        if (updatedClothing.length !== outfit.clothing.length) {
                            await editOutfit(outfit.id, { clothing: updatedClothing, image: outfit.image }); // Preserve the outfit image
                        }
                    });
                }
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error removing clothing from database:', error);
                setRequestQueue([...requestQueue, { request, id }]);
            }
        };

        await sendRequest();
    };

    const editClothing = async (id, updatedClothing) => {
        await checkTokenValidity(); // Check token validity before making the request

        try {
            const updatedClothes = clothes.map((item) =>
                item.id === id ? { ...item, ...updatedClothing } : item
            );
            await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes));
            setClothes(updatedClothes);

            const clothingToSend = {
                ...updatedClothing,
                tags: {
                    ...updatedClothing.tags,
                    sizeTags: updatedClothing.tags.sizeTags ? [updatedClothing.tags.sizeTags] : []
                }
            };
            const serverId_ = clothes.find((item) => item.id === id).serverId;
            delete clothingToSend.serverId;
            console.log('clothing to edit:', clothingToSend);
            const request = {
                url: `http://188.166.135.109/clothing/${serverId_}`,
                options: {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify(clothingToSend)
                }
            };
            const response = await fetch(request.url, request.options);
            if (!response.ok) {
                throw new Error('Failed to edit clothing in database');
            }
            const updatedClothingFromDBOG = await response.json();
            console.log('clothing just edited: ', updatedClothingFromDBOG);
            const updatedClothingFromDB = {
                ...updatedClothingFromDBOG,
                serverId: updatedClothingFromDBOG.id,
                owner: updatedClothingFromDBOG.owner_id,
                id: id, // Assuming newClothing is the original item with the previous id
            };
            //updatedClothingFromDB.tags.sizeTags = updatedClothingFromDB.tags.sizeTags.length > 0 ? updatedClothingFromDB.tags.sizeTags[0] : undefined;
            //console.log('clothingToSend', clothingToSend);
            //console.log('updatedClothingFromDBOG', updatedClothingFromDBOG);
            //console.log('updatedClothingFromDB', updatedClothingFromDB);
            const currentClothes = clothes.map((item) =>
                item.id === id ? updatedClothingFromDB : item
            );
            await AsyncStorage.setItem('clothes', JSON.stringify(currentClothes));
            setClothes(currentClothes);
        } catch (error) {
            console.error('Error editing clothing in database:', error);
            setRequestQueue([...requestQueue, { request, id }]);
        }
    };

    const synchronizeClothing = async () => {
        await checkTokenValidity(); // Check token validity before making the request

        try {
            const response = await fetch('http://188.166.135.109/clothing/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch clothing from database');
            }

            const data = await response.json();
            console.log('Clothing from database:', data);

            const updatedClothes = data.map(item => ({
                ...item,
                id: item.id, // Ensure id is a string
                serverId: item.id,
                owner: item.owner_id,
                tags: {
                    ...item.tags,
                    sizeTags: item.tags.sizeTags ? item.tags.sizeTags : undefined
                }
            }));

            await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes));
            setClothes(updatedClothes);
        } catch (error) {
            console.error('Error fetching clothing from database:', error);
        }
    };

    const resetClothing = async () => {
        try {
            await AsyncStorage.removeItem('clothes');
            setClothes([]);
        } catch (err) {
            console.error('Error resetting clothes in AsyncStorage:', err);
        }
    };

    const getClothingByServerIds = (serverIds, clothes) => {
        return clothes.filter(clothing => serverIds.includes(clothing.serverId));
    };
  
    return (
      <WardrobeContext.Provider value={{ outfits, addOutfit, removeOutfit, editOutfit, resetOutfits, synchronizeOutfits,
                                         clothes, addClothing, removeClothing, editClothing, resetClothing, synchronizeClothing }}>
        {children}
      </WardrobeContext.Provider>
    );
}