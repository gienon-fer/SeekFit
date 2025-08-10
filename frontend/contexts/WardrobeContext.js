import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
import { useUser } from './UserContext';

const WardrobeContext = createContext();

export function useWardrobe() {
    return useContext(WardrobeContext);
}

export function WardrobeProvider({ children }) {
    const [outfits, setOutfits] = useState([]);
    // const [requestQueue, setRequestQueue] = useState([]);
    const { idToken, checkTokenValidity, refreshGoogleToken, googleId, user, setOnSignOut } = useUser();
    const [clothes, setClothes] = useState([]);

    // Register a callback for when a user signs out to clear the state, using useRef to avoid render issue
    const isMountedRef = useRef(false);
    
    useEffect(() => {
        // Only set the onSignOut callback after the initial render
        if (!isMountedRef.current) {
            isMountedRef.current = true;
        } else if (setOnSignOut) {
            // This will run after initial render to avoid the "Cannot update during render" error
            setOnSignOut(() => {
                // This will clear the current state when the user signs out
                setClothes([]);
                setOutfits([]);
            });
        }
    }, [setOnSignOut]);

    // Load outfits from AsyncStorage based on current user
    useEffect(() => {
        const loadOutfits = async () => {
            try {
                const storedOutfits = await AsyncStorage.getItem('outfits');
                if (storedOutfits) {
                    const parsedOutfits = JSON.parse(storedOutfits);
                    // Filter outfits that belong to current user
                    const userOutfits = parsedOutfits.filter(item => item.owner === googleId);
                    setOutfits(userOutfits);
                } else {
                    // If no outfits in storage, set empty array
                    setOutfits([]);
                }
            } catch (err) {
                console.error('Error loading outfits from AsyncStorage:', err);
                setOutfits([]); // Ensure state is reset on error
            }
        };

        if (googleId) {
            loadOutfits();
        } else {
            // If no googleId (shouldn't happen), empty the outfits
            setOutfits([]);
        }
    }, [googleId]);

    // Load clothes from AsyncStorage based on current user
    useEffect(() => {
        const loadClothes = async () => {
            try {
                const storedClothes = await AsyncStorage.getItem('clothes');
                if (storedClothes) {
                    const parsedClothes = JSON.parse(storedClothes);
                    // Filter clothes that belong to current user
                    const userClothes = parsedClothes.filter(item => item.owner === googleId);
                    setClothes(userClothes);
                } else {
                    // If no clothes in storage, set empty array
                    setClothes([]);
                }
            } catch (err) {
                console.error('Error loading clothes from AsyncStorage:', err);
                setClothes([]); // Ensure state is reset on error
            }
        };

        if (googleId) {
            loadClothes();
        } else {
            // If no googleId (shouldn't happen), empty the clothes
            setClothes([]);
        }
    }, [googleId]);

    // Comment out all NetInfo and requestQueue related code
    /*
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
            synchronizeOutfitsOnServer();
        }
    }, [googleId]);

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
            synchronizeClothingOnServer();
        }
    }, [googleId]);
    */

    const extractServerId = (clothingList) => {
        return clothingList.map(item => item.serverId);
    };

    const addOutfit = async (newOutfit) => {
        try {
            const id_ = Date.now().toString();
            // Get all existing outfits first
            const storedOutfits = await AsyncStorage.getItem('outfits');
            const allOutfits = storedOutfits ? JSON.parse(storedOutfits) : [];
            
            // Add new outfit with owner ID
            const outfitWithOwner = { 
                ...newOutfit, 
                id: id_,
                owner: googleId // Use current googleId (either user ID or 'guest')
            };
            
            // Update state with only the user's outfits
            const updatedUserOutfits = [...outfits, outfitWithOwner];
            setOutfits(updatedUserOutfits);
            
            // Store all outfits (existing + new) in AsyncStorage
            const updatedAllOutfits = [...allOutfits, outfitWithOwner];
            await AsyncStorage.setItem('outfits', JSON.stringify(updatedAllOutfits));
        } catch (error) {
            console.error('Error saving outfit to AsyncStorage:', error);
        }
        
        // Comment out server synchronization code
        /*
        if (googleId) {
            await addOutfitOnServer(newOutfit, id_, updatedOutfits);
        }
        */
    };

    /*
    const addOutfitOnServer = async (newOutfit, id_, updatedOutfits) => {
        await checkTokenValidity(); // Check token validity before making the request
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
    */

    const removeOutfit = async (id) => {
        try {
            // Get all stored outfits
            const storedOutfits = await AsyncStorage.getItem('outfits');
            const allOutfits = storedOutfits ? JSON.parse(storedOutfits) : [];
            
            // Filter out the outfit to remove from all outfits
            const updatedAllOutfits = allOutfits.filter(item => item.id !== id);
            await AsyncStorage.setItem('outfits', JSON.stringify(updatedAllOutfits));
            
            // Update state with filtered user outfits
            const updatedUserOutfits = outfits.filter(item => item.id !== id);
            setOutfits(updatedUserOutfits);
        } catch (error) {
            console.error('Error removing outfit from AsyncStorage:', error);
        }
        
        // Comment out server synchronization
        /*
        const serverId_ = outfits.find((item) => item.id === id)?.serverId;

        if (googleId && serverId_) {
            await removeOutfitOnServer(id, serverId_);
        }
        */
    };

    /*
    const removeOutfitOnServer = async (id, serverId_) => {
        await checkTokenValidity();

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
    */

    const editOutfit = async (id, updatedOutfit) => {
        try {
            // Get all stored outfits
            const storedOutfits = await AsyncStorage.getItem('outfits');
            const allOutfits = storedOutfits ? JSON.parse(storedOutfits) : [];
            
            // Update the outfit in all outfits
            const updatedAllOutfits = allOutfits.map(item => 
                item.id === id ? { ...item, ...updatedOutfit } : item
            );
            await AsyncStorage.setItem('outfits', JSON.stringify(updatedAllOutfits));
            
            // Update state with user's outfits
            const updatedUserOutfits = outfits.map(item => 
                item.id === id ? { ...item, ...updatedOutfit } : item
            );
            setOutfits(updatedUserOutfits);
        } catch (error) {
            console.error('Error editing outfit in AsyncStorage:', error);
        }
        
        // Comment out server synchronization
        /*
        if (googleId) {
            await editOutfitOnServer(id, updatedOutfit, updatedOutfits);
        }
        */
    };

    /*
    const editOutfitOnServer = async (id, updatedOutfit, updatedOutfits) => {
        await checkTokenValidity(); // Check token validity before making the request

        try {
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
            const c = updatedOutfitFromDB.clothing.map(clothingId => {
                const clothingItem = originalClothing.find(c => c.serverId === clothingId);
                return clothingItem ? clothingItem : { serverId: clothingId };
            }) // Map back to clothing items
            console.log("clothing after returning: ", c);
            const updatedOutfitWithServerId = {
                ...updatedOutfitFromDB,
                serverId: updatedOutfitFromDB.id,
                owner: updatedOutfitFromDB.owner_id,
                id: id, // Assuming updatedOutfit is the original item with the previous id
                clothing: originalClothing,
                image: updatedOutfit.image // Preserve the outfit image
            } // Map back to clothing items

            const currentOutfits = updatedOutfits.map((item) =>
                item.id === id ? updatedOutfitWithServerId : item
            );
            await AsyncStorage.setItem('outfits', JSON.stringify(currentOutfits));
            setOutfits(currentOutfits);
        } catch (error) {
            console.error('Error editing outfit in database:', error);
            setRequestQueue([...requestQueue, { request, id }]);
        }
    };
    */

    const synchronizeOutfits = async () => {
        // Simply reload outfits from AsyncStorage
        try {
            const storedOutfits = await AsyncStorage.getItem('outfits');
            if (storedOutfits) {
                const parsedOutfits = JSON.parse(storedOutfits);
                // Filter outfits that belong to current user
                const userOutfits = googleId
                    ? parsedOutfits.filter(item => item.owner === googleId)
                    : parsedOutfits;
                setOutfits(userOutfits);
            }
        } catch (err) {
            console.error('Error loading outfits from AsyncStorage:', err);
        }
    };

    /*
    const synchronizeOutfitsOnServer = async () => {
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
    */

    const resetOutfits = async () => {
        // Keep outfits for other users, only remove current user's outfits
        try {
            const storedOutfits = await AsyncStorage.getItem('outfits');
            if (storedOutfits) {
                const allOutfits = JSON.parse(storedOutfits);
                
                if (googleId) {
                    // Filter out outfits of current user
                    const otherUsersOutfits = allOutfits.filter(item => item.owner !== googleId);
                    await AsyncStorage.setItem('outfits', JSON.stringify(otherUsersOutfits));
                } else {
                    // If no user logged in, remove all guest outfits
                    const loggedInUserOutfits = allOutfits.filter(item => item.owner !== 'guest');
                    await AsyncStorage.setItem('outfits', JSON.stringify(loggedInUserOutfits));
                }
            }
            
            // Clear state
            setOutfits([]);
        } catch (err) {
            console.error('Error resetting outfits in AsyncStorage:', err);
        }
    };

    const addClothing = async (newClothing) => {
        try {
            const id_ = Date.now().toString();
            
            // Get all existing clothes
            const storedClothes = await AsyncStorage.getItem('clothes');
            const allClothes = storedClothes ? JSON.parse(storedClothes) : [];
            
            // Add new clothing with owner ID
            const clothingWithOwner = { 
                ...newClothing, 
                id: id_,
                owner: googleId // Use current googleId (either user ID or 'guest')
            };
            
            // Update state with only the user's clothes
            const updatedUserClothes = [...clothes, clothingWithOwner];
            setClothes(updatedUserClothes);
            
            // Store all clothes (existing + new) in AsyncStorage
            const updatedAllClothes = [...allClothes, clothingWithOwner];
            await AsyncStorage.setItem('clothes', JSON.stringify(updatedAllClothes));
        } catch (error) {
            console.error('Error saving clothing to AsyncStorage:', error);
        }
        
        // Comment out server synchronization code
        /*
        if (googleId) {
            await addClothingOnServer(newClothing, id_, updatedClothes);
        }
        */
    };

    /*
    const addClothingOnServer = async (newClothing, id_, updatedClothes) => {
        await checkTokenValidity(); // Check token validity before making the request

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
    */

    const removeClothing = async (id) => {
        try {
            // Get all stored clothes
            const storedClothes = await AsyncStorage.getItem('clothes');
            const allClothes = storedClothes ? JSON.parse(storedClothes) : [];
            
            // Filter out the clothing to remove from all clothes
            const updatedAllClothes = allClothes.filter(item => item.id !== id);
            await AsyncStorage.setItem('clothes', JSON.stringify(updatedAllClothes));
            
            // Update state with filtered user clothes
            const updatedUserClothes = clothes.filter(item => item.id !== id);
            setClothes(updatedUserClothes);
            
            // Also update outfits to remove this clothing item
            const storedOutfits = await AsyncStorage.getItem('outfits');
            if (storedOutfits) {
                const allOutfits = JSON.parse(storedOutfits);
                let outfitsUpdated = false;
                
                const updatedAllOutfits = allOutfits.map(outfit => {
                    if (outfit.clothing && outfit.clothing.some(clothingItem => clothingItem.id === id)) {
                        outfitsUpdated = true;
                        return {
                            ...outfit,
                            clothing: outfit.clothing.filter(clothingItem => clothingItem.id !== id)
                        };
                    }
                    return outfit;
                });
                
                if (outfitsUpdated) {
                    await AsyncStorage.setItem('outfits', JSON.stringify(updatedAllOutfits));
                    
                    // Update outfits state as well if needed
                    setOutfits(prevOutfits => 
                        prevOutfits.map(outfit => {
                            if (outfit.clothing && outfit.clothing.some(clothingItem => clothingItem.id === id)) {
                                return {
                                    ...outfit,
                                    clothing: outfit.clothing.filter(clothingItem => clothingItem.id !== id)
                                };
                            }
                            return outfit;
                        })
                    );
                }
            }
        } catch (error) {
            console.error('Error removing clothing from AsyncStorage:', error);
        }
        
        // Comment out server synchronization
        /*
        const serverId_ = clothes.find((item) => item.id === id)?.serverId;

        if (googleId && serverId_) {
            await removeClothingOnServer(id, serverId_);
        } else if (outfits) {
            outfits.forEach(async (outfit) => {
                const updatedClothing = outfit.clothing.filter((clothing) => clothing.id !== id);
                if (updatedClothing.length !== outfit.clothing.length) {
                    await editOutfit(outfit.id, { clothing: updatedClothing, image: outfit.image }); // Preserve the outfit image
                }
            });
        }
        */
    };

    /*
    const removeClothingOnServer = async (id, serverId_) => {
        await checkTokenValidity();

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
    */

    const editClothing = async (id, updatedClothing) => {
        try {
            // Get all stored clothes
            const storedClothes = await AsyncStorage.getItem('clothes');
            const allClothes = storedClothes ? JSON.parse(storedClothes) : [];
            
            // Update the clothing in all clothes
            const updatedAllClothes = allClothes.map(item => 
                item.id === id ? { ...item, ...updatedClothing } : item
            );
            await AsyncStorage.setItem('clothes', JSON.stringify(updatedAllClothes));
            
            // Update state with user's clothes
            const updatedUserClothes = clothes.map(item => 
                item.id === id ? { ...item, ...updatedClothing } : item
            );
            setClothes(updatedUserClothes);
            
            // Also update this clothing item in outfits if needed
            const storedOutfits = await AsyncStorage.getItem('outfits');
            if (storedOutfits) {
                const allOutfits = JSON.parse(storedOutfits);
                let outfitsUpdated = false;
                
                const updatedAllOutfits = allOutfits.map(outfit => {
                    if (outfit.clothing && outfit.clothing.some(clothingItem => clothingItem.id === id)) {
                        outfitsUpdated = true;
                        return {
                            ...outfit,
                            clothing: outfit.clothing.map(clothingItem => 
                                clothingItem.id === id ? { ...clothingItem, ...updatedClothing } : clothingItem
                            )
                        };
                    }
                    return outfit;
                });
                
                if (outfitsUpdated) {
                    await AsyncStorage.setItem('outfits', JSON.stringify(updatedAllOutfits));
                    
                    // Update outfits state as well
                    setOutfits(prevOutfits => 
                        prevOutfits.map(outfit => {
                            if (outfit.clothing && outfit.clothing.some(clothingItem => clothingItem.id === id)) {
                                return {
                                    ...outfit,
                                    clothing: outfit.clothing.map(clothingItem => 
                                        clothingItem.id === id ? { ...clothingItem, ...updatedClothing } : clothingItem
                                    )
                                };
                            }
                            return outfit;
                        })
                    );
                }
            }
        } catch (error) {
            console.error('Error editing clothing in AsyncStorage:', error);
        }
        
        // Comment out server synchronization
        /*
        if (googleId) {
            await editClothingOnServer(id, updatedClothing, updatedClothes);
        }
        */
    };

    /*
    const editClothingOnServer = async (id, updatedClothing, updatedClothes) => {
        await checkTokenValidity(); // Check token validity before making the request

        try {
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
            const currentClothes = updatedClothes.map((item) =>
                item.id === id ? updatedClothingFromDB : item
            );
            await AsyncStorage.setItem('clothes', JSON.stringify(currentClothes));
            setClothes(currentClothes);
        } catch (error) {
            console.error('Error editing clothing in database:', error);
            setRequestQueue([...requestQueue, { request, id }]);
        }
    };
    */

    const synchronizeClothing = async () => {
        // Simply reload clothes from AsyncStorage
        try {
            const storedClothes = await AsyncStorage.getItem('clothes');
            if (storedClothes) {
                const parsedClothes = JSON.parse(storedClothes);
                // Filter clothes that belong to current user
                const userClothes = googleId
                    ? parsedClothes.filter(item => item.owner === googleId)
                    : parsedClothes;
                setClothes(userClothes);
            }
        } catch (err) {
            console.error('Error loading clothes from AsyncStorage:', err);
        }
    };

    /*
    const synchronizeClothingOnServer = async () => {
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
    */

    const resetClothing = async () => {
        // Keep clothes for other users, only remove current user's clothes
        try {
            const storedClothes = await AsyncStorage.getItem('clothes');
            if (storedClothes) {
                const allClothes = JSON.parse(storedClothes);
                
                if (googleId) {
                    // Filter out clothes of current user
                    const otherUsersClothes = allClothes.filter(item => item.owner !== googleId);
                    await AsyncStorage.setItem('clothes', JSON.stringify(otherUsersClothes));
                } else {
                    // If no user logged in, remove all guest clothes
                    const loggedInUserClothes = allClothes.filter(item => item.owner !== 'guest');
                    await AsyncStorage.setItem('clothes', JSON.stringify(loggedInUserClothes));
                }
            }
            
            // Clear state
            setClothes([]);
        } catch (error) {
            console.error('Failed to clear clothing data:', error);
            return false;
        }
        return true;
    };

    const resetAllWardrobeData = async () => {
        const clothingResult = await resetClothing();
        const outfitsResult = await resetOutfits();
        return clothingResult && outfitsResult;
    };
    
    // Helper function to get clothing items by their IDs
    const getClothingByServerIds = (clothingIds, availableClothing) => {
        if (!clothingIds || !Array.isArray(clothingIds)) return [];
        
        return clothingIds
            .map(id => availableClothing.find(item => item.serverId === id))
            .filter(item => item !== undefined);
    };

    return (
        <WardrobeContext.Provider value={{
            outfits, addOutfit, removeOutfit, editOutfit, resetOutfits, synchronizeOutfits,
            clothes, addClothing, removeClothing, editClothing, resetClothing, synchronizeClothing,
            resetAllWardrobeData
        }}>
            {children}
        </WardrobeContext.Provider>
    );
}