import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import axiosClient from '../api/axiosCliend';
import { Ionicons } from '@expo/vector-icons';
import BackgroundGlow from '../components/BackgroundGlow';
import VibrantHeader from '../components/VibrantHeader';

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axiosClient.get('/books');
            setBooks(response.data);
            setFilteredBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (text) => {
        setQuery(text);
        if (text) {
            const newData = books.filter((item) => {
                const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredBooks(newData);
        } else {
            setFilteredBooks(books);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Borrow', { book: item })}>
            <View style={styles.card}>
                <Image
                    source={item.coverImage ? { uri: item.coverImage } : null}
                    style={styles.coverImage}
                />
                {!item.coverImage && (
                    <View style={[styles.coverImage, styles.placeholderCover]} >
                        <Ionicons name="book" size={24} color="#3b82f6" />
                    </View>
                )}

                <View style={styles.bookInfo}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.author}>{item.author}</Text>
                    <Text style={[styles.status, item.quantity > 0 ? styles.available : styles.outOfStock]}>
                        {item.quantity > 0 ? 'Available' : 'Out of Stock'}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <BackgroundGlow />
            <VibrantHeader />

            <View style={styles.content}>
                <View style={styles.searchHeader}>
                    <Text style={styles.pageTitle}>Search Collection</Text>
                    <Text style={styles.pageSubtitle}>Find your favorite books instantly</Text>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by title..."
                        placeholderTextColor="#64748b"
                        value={query}
                        onChangeText={handleSearch}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={filteredBooks}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={60} color="#1e293b" />
                            <Text style={styles.emptyText}>No books found matching "{query}"</Text>
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
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    searchHeader: {
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    pageSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        outlineStyle: 'none',
    },
    listContent: {
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    coverImage: {
        width: 50,
        height: 75,
        borderRadius: 8,
        marginRight: 15,
    },
    placeholderCover: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookInfo: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 4,
    },
    author: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 4,
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    },
    available: {
        color: '#34d399',
    },
    outOfStock: {
        color: '#f87171',
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
