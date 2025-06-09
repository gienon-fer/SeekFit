import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';

const CalendarContext = createContext();

export function useCalendar() {
    return useContext(CalendarContext);
}

export function CalendarProvider({ children }) {
    const [calendarOutfits, setCalendarOutfits] = useState({});
    // Get user context safely without directly rendering any values
    const userContext = useUser();
    // Safe extraction with default values
    const googleId = userContext?.googleId || 'guest';

    // Load calendar data from AsyncStorage when user changes
    useEffect(() => {
        const loadCalendarData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('calendarOutfits');
                if (storedData) {
                    const allCalendarData = JSON.parse(storedData);
                    // Filter to only show current user's data
                    const userCalendarData = allCalendarData[googleId] || {};
                    setCalendarOutfits(userCalendarData);
                }
            } catch (err) {
                console.error('Error loading calendar data from AsyncStorage:', err);
            }
        };

        loadCalendarData();
    }, [googleId]);

    // Add outfit to a specific date
    const addOutfitToDate = async (date, outfit) => {
        try {
            // Get all stored calendar data first
            const storedData = await AsyncStorage.getItem('calendarOutfits');
            const allCalendarData = storedData ? JSON.parse(storedData) : {};
            
            // Make sure the current user has a section in the data
            if (!allCalendarData[googleId]) {
                allCalendarData[googleId] = {};
            }
            
            // Add the outfit to the user's calendar data
            allCalendarData[googleId][date] = outfit;
            
            // Save all data back to storage
            await AsyncStorage.setItem('calendarOutfits', JSON.stringify(allCalendarData));
            
            // Update state with the current user's data
            setCalendarOutfits((prev) => ({
                ...prev,
                [date]: outfit
            }));
        } catch (error) {
            console.error('Error saving calendar outfit to AsyncStorage:', error);
        }
    };

    // Remove outfit from a specific date
    const removeOutfitFromDate = async (date) => {
        try {
            // Get all stored calendar data
            const storedData = await AsyncStorage.getItem('calendarOutfits');
            if (storedData) {
                const allCalendarData = JSON.parse(storedData);
                
                // If the user has no data or no outfit for this date, there's nothing to remove
                if (!allCalendarData[googleId] || !allCalendarData[googleId][date]) {
                    return;
                }
                
                // Remove the outfit from this date
                delete allCalendarData[googleId][date];
                
                // Save updated data back to storage
                await AsyncStorage.setItem('calendarOutfits', JSON.stringify(allCalendarData));
                
                // Update state by creating a new object and removing the entry
                setCalendarOutfits((prev) => {
                    const updated = { ...prev };
                    delete updated[date];
                    return updated;
                });
            }
        } catch (error) {
            console.error('Error removing calendar outfit from AsyncStorage:', error);
        }
    };

    // Reset all calendar data for the current user
    const resetCalendar = async () => {
        try {
            const storedData = await AsyncStorage.getItem('calendarOutfits');
            if (storedData) {
                const allCalendarData = JSON.parse(storedData);
                
                // Remove current user's calendar data
                if (allCalendarData[googleId]) {
                    delete allCalendarData[googleId];
                    
                    // Save the updated data back to storage
                    await AsyncStorage.setItem('calendarOutfits', JSON.stringify(allCalendarData));
                }
            }
            
            // Clear state
            setCalendarOutfits({});
        } catch (error) {
            console.error('Error resetting calendar data:', error);
        }
    };

    return (
        <CalendarContext.Provider value={{
            calendarOutfits,
            addOutfitToDate,
            removeOutfitFromDate,
            resetCalendar
        }}>
            {children}
        </CalendarContext.Provider>
    );
}
