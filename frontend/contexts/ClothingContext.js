// contexts/ClothingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useOutfit } from './OutfitContext'; // Import useOutfit
import { useUser } from './UserContext'; // Import useUser

const ClothingContext = createContext();

export function useClothing() {
    return useContext(ClothingContext);
}

export function ClothingProvider({ children }) {
    const [clothes, setClothes] = useState([]);
    const [requestQueue, setRequestQueue] = useState([]);
    const { idToken, checkTokenValidity, refreshGoogleToken, googleId } = useUser(); // Get idToken, checkTokenValidity, refreshGoogleToken, and googleId from UserContext
    const outfitContext = useOutfit(); // Get the outfit context
    const { outfits, editOutfit } = outfitContext || {}; // Destructure outfits and editOutfit from outfitContext

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
                            await editOutfit(outfit.id, { clothing: updatedClothing });
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

    return (
        <ClothingContext.Provider value={{ clothes, addClothing, removeClothing, editClothing, resetClothing, synchronizeClothing }}>
            {children}
        </ClothingContext.Provider>
    );
}
