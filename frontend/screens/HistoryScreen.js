import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, Platform, TouchableOpacity } from 'react-native';
import axiosClient from '../api/axiosCliend';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import BackgroundGlow from '../components/BackgroundGlow';
import VibrantHeader from '../components/VibrantHeader';

const HistoryScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axiosClient.get(`/history/${user._id}`);
            setHistory(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        if (!item) return null;
        const status = item.status || 'unknown';
        const isReturned = status === 'returned';

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={[styles.statusIcon, isReturned ? styles.iconReturned : styles.iconBorrowed]}>
                        <Ionicons
                            name={isReturned ? "checkmark" : "time"}
                            size={16}
                            color={isReturned ? "#10b981" : "#f59e0b"}
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={[styles.statusText, isReturned ? { color: '#10b981' } : { color: '#f59e0b' }]}>
                            {status.toUpperCase()}
                        </Text>
                        <Text style={styles.date}> Borrowed: {item.borrow_date ? new Date(item.borrow_date).toLocaleDateString() : 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.contentRow}>
                    {item.book_id?.coverImage ? (
                        <Image source={{ uri: item.book_id.coverImage }} style={styles.bookCover} resizeMode="cover" />
                    ) : (
                        <View style={styles.bookIconPlaceholder}>
                            <Ionicons name="book" size={24} color="#3b82f6" />
                        </View>
                    )}

                    <View style={styles.details}>
                        <Text style={styles.bookTitle}>{item.book_id?.title || "Unknown Book"}</Text>

                        {item.return_date && (
                            <View style={styles.returnBadge}>
                                <Ionicons name="return-down-back" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                <Text style={styles.returnDateText}>Returned: {new Date(item.return_date).toLocaleDateString()}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <BackgroundGlow />
            <VibrantHeader />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => navigation.goBack && navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Borrowing History</Text>
                    </View>
                    <Text style={styles.subtitle}>Track your reading journey</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={history}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="library-outline" size={60} color="#1e293b" />
                                <Text style={styles.emptyText}>No borrowing history yet.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02040a',
    },
    content: {
        flex: 1,
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        maxWidth: 1000, // Increase max width slightly
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
        marginTop: 5,
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    statusIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconReturned: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    iconBorrowed: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    date: {
        color: '#94a3b8',
        fontSize: 12,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bookCover: {
        width: 50,
        height: 75,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: '#1e293b',
    },
    bookIconPlaceholder: {
        width: 50,
        height: 75,
        borderRadius: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    bookTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    returnBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    returnDateText: {
        color: '#94a3b8',
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#64748b',
        marginTop: 10,
        fontSize: 16,
    }
});

export default HistoryScreen;
