import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, Modal, Platform } from 'react-native';
import axiosClient from '../api/axiosCliend';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function BorrowScreen({ route, navigation }) {
    const { book } = route.params;
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [isBorrowed, setIsBorrowed] = useState(false);

    const handleBorrow = async () => {
        setLoading(true);
        try {
            await axiosClient.post('/borrow', {
                user_id: user._id,
                book_id: book._id,
            });
            setSuccessModalVisible(true);
            setIsBorrowed(true);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || 'Borrow failed';

            if (Platform.OS === 'web') {
                alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.gradient}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.coverContainer}>
                        {book.coverImage ? (
                            <Image source={{ uri: book.coverImage }} style={styles.bookCover} resizeMode="contain" />
                        ) : (
                            <View style={styles.iconContainer}>
                                <Ionicons name="book-outline" size={80} color="#3b82f6" />
                            </View>
                        )}
                    </View>

                    <Text style={styles.confirmText}>Confirm Borrow</Text>
                    <Text style={styles.subText}>You are about to borrow:</Text>

                    <View style={styles.bookDetails}>
                        <Text style={styles.bookTitle}>{book.title}</Text>
                        <Text style={styles.bookAuthor}>by {book.author}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isBorrowed && styles.disabledButton]}
                        onPress={handleBorrow}
                        disabled={loading || isBorrowed}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {isBorrowed ? 'Borrowed' : 'Confirm & Borrow'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                {/* Success Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={successModalVisible}
                    onRequestClose={() => navigation.navigate('Home')}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.successIconContainer}>
                                <Ionicons name="checkmark-circle" size={60} color="#34d399" />
                            </View>
                            <Text style={styles.modalTitle}>Borrow Successful!</Text>
                            <Text style={styles.modalMessage}>
                                Enjoy reading <Text style={styles.highlightText}>{book.title}</Text>!
                            </Text>
                            <Text style={styles.modalSubMessage}>
                                Has been added to your collection.
                            </Text>

                            <TouchableOpacity
                                style={[styles.button, styles.successButton]}
                                onPress={() => {
                                    setSuccessModalVisible(false);
                                    navigation.navigate('Home');
                                }}
                            >
                                <Text style={styles.buttonText}>Back to Home</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        paddingVertical: 20,
        // Web Responsiveness
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    coverContainer: {
        marginBottom: 20,
        height: 180,
        justifyContent: 'center',
    },
    bookCover: {
        width: 120,
        height: 180,
        borderRadius: 10,
    },
    iconContainer: {
        padding: 30,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 50,
    },
    confirmText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 20,
    },
    bookDetails: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        width: '100%',
    },
    bookTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3b82f6',
        textAlign: 'center',
        marginBottom: 5,
    },
    bookAuthor: {
        fontSize: 16,
        color: '#cbd5e1',
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    disabledButton: {
        backgroundColor: '#64748b', // Slate 500
        opacity: 0.8,
    },
    cancelButton: {
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#94a3b8',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1e293b',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.3)', // Emerald border
        shadowColor: '#34d399',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    successIconContainer: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#cbd5e1',
        textAlign: 'center',
        marginBottom: 5,
        lineHeight: 24,
    },
    modalSubMessage: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 30,
    },
    highlightText: {
        color: '#34d399',
        fontWeight: 'bold',
    },
    successButton: {
        backgroundColor: '#34d399', // Emerald 400
        marginBottom: 0,
        width: '100%',
    }
});
