import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AuthProvider, AuthContext } from './context/AuthContext';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import BorrowScreen from './screens/BorrowScreen';
import ReturnScreen from './screens/ReturnScreen';
import HistoryScreen from './screens/HistoryScreen';
import AddBookScreen from './screens/AddBookScreen';

const Stack = createNativeStackNavigator();

// --- Main App Navigation ---
const AppNavigator = () => {
    const { user } = useContext(AuthContext);

    const screenOptions = {
        headerShown: false, // We use custom VibrantHeader
        contentStyle: {
            backgroundColor: '#02040a', // Global Dark Base
        },
        animation: 'fade', // Smooth transitions
    };

    return (
        <Stack.Navigator screenOptions={screenOptions}>
            {user ? (
                // App Stack
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Search" component={SearchScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="Borrow" component={BorrowScreen} />
                    <Stack.Screen name="Return" component={ReturnScreen} />
                    <Stack.Screen name="History" component={HistoryScreen} />
                    <Stack.Screen name="AddBook" component={AddBookScreen} />
                </>
            ) : (
                // Auth Stack
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
