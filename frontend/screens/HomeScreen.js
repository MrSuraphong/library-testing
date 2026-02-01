import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ScrollView, Dimensions, Platform, Image, Alert, Modal, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axiosClient from '../api/axiosCliend';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BackgroundGlow from '../components/BackgroundGlow';
import VibrantHeader from '../components/VibrantHeader';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [books, setBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchBooks = async () => {
        try {
            const response = await axiosClient.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchBooks();
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBooks();
        }, [])
    );

    // --- Delete Logic ---
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    const handleDelete = (book) => {
        setBookToDelete(book);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete) return;
        try {
            await axiosClient.delete(`/books/${bookToDelete._id}`);
            fetchBooks();
            setDeleteModalVisible(false);
            setBookToDelete(null);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete book');
            setDeleteModalVisible(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setBookToDelete(null);
    };

    // --- Components ---
    // BackgroundGlow and Navbar are now imported globally


    const HeroSection = () => (
        <View style={styles.heroSection}>
            <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'transparent']}
                style={styles.heroGlow}
            />
            <Text style={styles.heroLabel}>POWER UP YOUR KNOWLEDGE</Text>
            <Text style={styles.heroTitle}>
                Discover Your Next <Text style={styles.heroTitleGradient}>Great Read</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
                Explore thousands of books, curated collections, and join a community of passionate readers.
            </Text>

            <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('SearchTab')}>
                    <Text style={styles.primaryBtnText}>Start Exploring</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Return')}>
                    <Text style={styles.secondaryBtnText}>My Returns</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderBookItem = ({ item }) => (
        <View style={styles.bookRow}>
            <View style={styles.bookRowContent}>
                <Image
                    source={item.coverImage ? { uri: item.coverImage } : null}
                    style={styles.rowCover}
                />
                {!item.coverImage && (
                    <View style={[styles.rowCover, styles.rowCoverPlaceholder]}>
                        <Ionicons name="book" size={20} color="#3b82f6" />
                    </View>
                )}

                <View style={styles.rowInfo}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.rowAuthor}>{item.author}</Text>
                </View>
            </View>

            <View style={styles.rowActions}>
                <Text style={[styles.rowStatus, item.quantity > 0 ? styles.statusAvail : styles.statusOut]}>
                    {item.quantity} Avail
                </Text>

                {item.quantity > 0 && (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Borrow', { book: item })}>
                        <Text style={styles.actionBtnText}>Get</Text>
                    </TouchableOpacity>
                )}

                {user?.role === 'admin' && (
                    <TouchableOpacity style={styles.deleteIconBtn} onPress={() => handleDelete(item)}>
                        <Ionicons name="trash-outline" size={18} color="#f87171" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const FeaturedCard = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Borrow', { book: item })}
            style={styles.featuredCard}
        >
            <Image
                source={item.coverImage ? { uri: item.coverImage } : null}
                style={styles.featuredImage}
            />
            {!item.coverImage && (
                <View style={styles.featuredPlaceholder}>
                    <Ionicons name="image-outline" size={32} color="#fff" />
                </View>
            )}

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                style={styles.featuredOverlay}
            >
                <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.featuredAuthor}>{item.author}</Text>
            </LinearGradient>

            <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
        </TouchableOpacity>
    );

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <VibrantHeader />
            <HeroSection />

            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Trending Now</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
                {books.slice(0, 5).map((item) => (
                    <FeaturedCard key={item._id} item={item} />
                ))}
            </ScrollView>

            <View style={[styles.sectionHeaderRow, { marginTop: 40 }]}>
                <Text style={styles.sectionHeading}>Library Collection</Text>
                {user?.role === 'admin' && (
                    <TouchableOpacity style={styles.addBookBtn} onPress={() => navigation.navigate('AddBook')}>
                        <Ionicons name="add" size={16} color="#000" />
                        <Text style={styles.addBookText}>Add Book</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <BackgroundGlow />

            <FlatList
                data={books}
                keyExtractor={(item) => item._id}
                renderItem={renderBookItem}
                ListHeaderComponent={ListHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Custom Delete Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={cancelDelete}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalGlass}>
                        <View style={styles.modalIconBox}>
                            <Ionicons name="trash" size={30} color="#ef4444" />
                        </View>
                        <Text style={styles.modalTitle}>Delete this book?</Text>
                        <Text style={styles.modalDesc}>
                            You are about to remove <Text style={{ color: '#fff', fontWeight: 'bold' }}>{bookToDelete?.title}</Text>. This action is irreversible.
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancel} onPress={cancelDelete}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalDelete} onPress={confirmDelete}>
                                <Text style={styles.modalDeleteText}>Confirm Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#02040a', // Deep Black/Blue Base
    },
    listContent: {
        paddingBottom: 100,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    // Background Effects
    glowOrb: {
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: 300,
        opacity: 0.3,
        // Web Blur
        ...Platform.select({
            web: {
                filter: 'blur(80px)',
            }
        })
    },
    glowOrbLeft: {
        backgroundColor: '#3b82f6',
        top: -200,
        left: -100,
    },
    glowOrbRight: {
        backgroundColor: '#f97316', // Orange
        top: 100,
        right: -200,
        opacity: 0.2,
    },

    // Header & Navbar
    headerContainer: {
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        paddingTop: 20,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        paddingVertical: 10,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBox: {
        width: 32,
        height: 32,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    brandText: {
        fontSize: 20,
        fontWeight: '800', // Extra Bold
        color: '#fff',
        letterSpacing: 0.5,
    },
    navSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        width: 300,
    },
    navSearchInput: {
        marginLeft: 10,
        color: '#fff',
        flex: 1,
        outlineStyle: 'none', // Remove web outline
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navIconBtn: {
        marginRight: 15,
        padding: 5,
    },
    navAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#3b82f6',
    },

    // Hero Section
    heroSection: {
        alignItems: 'center',
        marginBottom: 50,
        paddingVertical: 40,
        position: 'relative',
    },
    heroGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 30,
    },
    heroLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#f97316', // Orange Accent
        letterSpacing: 2,
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    heroTitle: {
        fontSize: Platform.OS === 'web' ? 56 : 36,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: Platform.OS === 'web' ? 64 : 42,
        marginBottom: 20,
        maxWidth: 800,
    },
    heroTitleGradient: {
        color: '#3b82f6',
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#94a3b8',
        textAlign: 'center',
        maxWidth: 600,
        lineHeight: 28,
        marginBottom: 40,
    },
    heroButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    primaryBtn: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 50,
        shadowColor: 'white',
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    primaryBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 50,
    },
    secondaryBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },

    // Sections
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    sectionHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    seeAllText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    addBookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 30,
    },
    addBookText: {
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },

    // Horizontal Scroll
    scrollSection: {
        marginBottom: 20,
        paddingLeft: 10,
    },
    featuredCard: {
        width: 220,
        height: 320,
        marginRight: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1e293b',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    featuredPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        padding: 15,
        justifyContent: 'flex-end',
    },
    featuredTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featuredAuthor: {
        color: '#cbd5e1',
        fontSize: 14,
    },
    featuredBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    featuredBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    // Book List Items (Clean Row Style)
    bookRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    bookRowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rowCover: {
        width: 40,
        height: 60,
        borderRadius: 6,
        marginRight: 15,
    },
    rowCoverPlaceholder: {
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowInfo: {
        justifyContent: 'center',
    },
    rowTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    rowAuthor: {
        color: '#64748b',
        fontSize: 13,
    },
    rowActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowStatus: {
        fontSize: 12,
        marginRight: 15,
        fontWeight: '600',
        color: '#64748b',
        display: Platform.OS === 'web' ? 'flex' : 'none', // Hide status text on small mobile if needed
    },
    statusAvail: { color: '#34d399' },
    statusOut: { color: '#ef4444' },

    actionBtn: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    actionBtnText: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 12,
    },
    deleteIconBtn: {
        marginLeft: 15,
        padding: 5,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalGlass: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#0f172a',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    modalIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    modalDesc: {
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    modalActions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 15,
    },
    modalCancel: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#1e293b',
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalDelete: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#ef4444',
        alignItems: 'center',
    },
    modalDeleteText: {
        color: '#fff',
        fontWeight: '600',
    }
});
