import React, { createContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user data
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.error("Failed to load user", e);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (userData) => {
        setUser(userData);
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
            console.error("Failed to save user", e);
        }
    };

    const logout = async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem('user');
        } catch (e) {
            console.error("Failed to remove user", e);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
