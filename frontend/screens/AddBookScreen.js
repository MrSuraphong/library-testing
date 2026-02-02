import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, Modal, Animated, Easing } from 'react-native';
import axiosClient from '../api/axiosCliend';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import BackgroundGlow from '../components/BackgroundGlow';
import VibrantHeader from '../components/VibrantHeader';

export default function AddBookScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [quantity, setQuantity] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Custom Modal States
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (modalVisible && modalStatus === 'loading') {
            startSpin();
        } else {
            spinValue.setValue(0);
        }
    }, [modalVisible, modalStatus]);

    const startSpin = () => {
        spinValue.setValue(0);
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [2, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setCoverImage(base64Img);
        }
    };

    const handleAddBook = async () => {
        if (!title || !author || !quantity) {
            Alert.alert('Error', 'Please fill in all fields (Title, Author, Quantity)');
            return;
        }

        // 1. Show Loading Modal
        setModalStatus('loading');
        setModalVisible(true);
        setLoading(true);

        try {
            await axiosClient.post('/books', {
                title,
                author,
                quantity: parseInt(quantity, 10),
                coverImage
            });

            // 2. Show Success State
            setModalStatus('success');

            // 3. Navigate after delay
            setTimeout(() => {
                setModalVisible(false);
                navigation.navigate('Home');
            }, 2000);

        } catch (error) {
            console.error(error);
            setModalVisible(false); // Close generic modal
            const errorMessage = error.response?.data?.error || 'Failed to add book';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <BackgroundGlow />
            <VibrantHeader />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerTitle}>New Entry</Text>
                                <Text style={styles.subHeader}>Add a new book details and cover.</Text>
                            </View>
                        </View>

                        <View style={styles.form}>
                            {/* Image Picker Section */}
                            <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
                                {coverImage ? (
                                    <Image source={{ uri: coverImage }} style={styles.coverPreview} />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <Ionicons name="image-outline" size={40} color="#64748b" />
                                        <Text style={styles.placeholderText}>Tap to add Cover</Text>
                                    </View>
                                )}
                                {coverImage && (
                                    <View style={styles.editIconBadge}>
                                        <Ionicons name="pencil" size={12} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Book Title</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter book title"
                                    placeholderTextColor="#64748b"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Author</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter author name"
                                    placeholderTextColor="#64748b"
                                    value={author}
                                    onChangeText={setAuthor}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Quantity</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter quantity"
                                    placeholderTextColor="#64748b"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="numeric"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.disabledButton]}
                                onPress={handleAddBook}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>
                                    {loading ? 'Processing...' : 'Add Book'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Custom Success/Loading Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {modalStatus === 'loading' ? (
                            <>
                                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                    <Ionicons name="sync" size={60} color="#3b82f6" />
                                </Animated.View>
                                <Text style={styles.modalText}>Adding Book...</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={80} color="#10b981" />
                                <Text style={styles.modalText}>Success!</Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#02040a',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20
    },
    container: {
        flex: 1,
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    subHeader: {
        fontSize: 16,
        color: '#94a3b8',
    },
    form: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    imagePickerContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    coverPreview: {
        width: 120,
        height: 180,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#334155',
    },
    placeholderContainer: {
        width: 120,
        height: 180,
        borderRadius: 10,
        backgroundColor: '#1e293b',
        borderWidth: 2,
        borderColor: '#334155',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#3b82f6',
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#0f172a',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#cbd5e1',
    },
    input: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#f8fafc',
    },
    button: {
        backgroundColor: '#10b981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    disabledButton: {
        backgroundColor: '#475569',
        shadowOpacity: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 200,
        padding: 20,
        backgroundColor: '#1e293b',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    modalText: {
        marginTop: 15,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
