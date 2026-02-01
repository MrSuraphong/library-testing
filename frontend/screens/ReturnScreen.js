import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert, Image, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axiosClient from '../api/axiosCliend';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import BackgroundGlow from '../components/BackgroundGlow';
import VibrantHeader from '../components/VibrantHeader';

export default function ReturnScreen({ navigation }) {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [returningId, setReturningId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await axiosClient.get(`/history/${user._id}`);
            const activeLoans = response.data.filter(t => t.status === 'borrowed');
            setBorrowedBooks(activeLoans);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReturn = async (transactionId) => {
        setReturningId(transactionId);
        try {
            await axiosClient.post('/return', {
                transaction_id: transactionId,
                returnDate: new Date()
            });
            Alert.alert('Success', 'Book returned successfully');
            fetchBorrowedBooks();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to return book');
        } finally {
            setReturningId(null);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchBorrowedBooks();
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBorrowedBooks();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.bookInfo}>
                <View style={styles.coverContainer}>
                    {item.book_id?.coverImage ? (
                        <Image source={{ uri: item.book_id.coverImage }} style={styles.bookCover} resizeMode="cover" />
                    ) : (
                        <View style={styles.iconPlaceholder}>
                            <Ionicons name="book" size={24} color="#3b82f6" />
                        </View>
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.bookTitle} numberOfLines={2}>{item.book_id?.title || 'Unknown Title'}</Text>
                    <Text style={styles.bookAuthor}>{item.book_id?.author || 'Unknown Author'}</Text>
                    <View style={styles.dueTag}>
                        <Ionicons name="time-outline" size={12} color="#fbbf24" style={{ marginRight: 4 }} />
                        <Text style={styles.dueDate}>Borrowed: {new Date(item.borrow_date).toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.returnButton, returningId === item._id && styles.returningBtn]}
                onPress={() => handleReturn(item._id)}
                disabled={returningId === item._id}
            >
                {returningId === item._id ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.returnButtonText}>Return Book</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <BackgroundGlow />
            <VibrantHeader />

            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>Return Books</Text>
                        <Text style={styles.subtitle}>Manage your active loans</Text>
                    </View>
                </View>

                <FlatList
                    data={borrowedBooks}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="library-outline" size={60} color="#1e293b" />
                            <Text style={styles.emptyText}>You have no books to return.</Text>
                            <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
                                <Text style={styles.homeBtnText}>Back to Home</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02040a',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    bookInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    coverContainer: {
        marginRight: 15,
    },
    bookCover: {
        width: 60,
        height: 90,
        borderRadius: 8,
        backgroundColor: '#1e293b',
    },
    iconPlaceholder: {
        width: 60,
        height: 90,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 8,
    },
    dueTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    dueDate: {
        fontSize: 12,
        color: '#fbbf24',
        fontWeight: '600',
    },
    returnButton: {
        backgroundColor: '#3b82f6', // Indigo
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    returningBtn: {
        backgroundColor: '#1e293b',
    },
    returnButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#64748b',
        marginTop: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    homeBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    homeBtnText: {
        color: '#3b82f6',
        fontWeight: 'bold',
    },
});
