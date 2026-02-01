import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axiosClient from '../api/axiosCliend';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member');

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await axiosClient.post('/register', {
                username,
                password,
                role,
            });

            Alert.alert('Success', 'Registration successful! Please login.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || 'Registration failed';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.gradient}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <Text style={styles.title}>Get Started</Text>
                            <Text style={styles.subtitle}>Create your account to start borrowing</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Choose a username"
                                    placeholderTextColor="#64748b"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Choose a password"
                                    placeholderTextColor="#64748b"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkContainer}>
                                <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        paddingVertical: 20,
        justifyContent: 'center',
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 20,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#f8fafc',
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        color: '#f8fafc',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#10b981', // Emerald for register
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkContainer: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#10b981',
        fontWeight: 'bold',
    },
});
