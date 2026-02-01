import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const VibrantHeader = () => {
    const navigation = useNavigation();
    const { user, logout } = useContext(AuthContext);
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => setMenuVisible(!menuVisible);

    const navigateTo = (screen) => {
        setMenuVisible(false);
        navigation.navigate(screen);
    };

    const handleLogout = () => {
        setMenuVisible(false);
        logout();
    };

    const MenuLink = ({ icon, label, screen, isDestructive }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => isDestructive ? handleLogout() : navigateTo(screen)}
        >
            <View style={[styles.menuIconBox, isDestructive ? styles.iconDestructive : null]}>
                <Ionicons name={icon} size={20} color={isDestructive ? '#ef4444' : '#fff'} />
            </View>
            <View>
                <Text style={[styles.menuLabel, isDestructive ? { color: '#ef4444' } : null]}>{label}</Text>
                {!isDestructive && <Text style={styles.menuSubLabel}>Tap to open</Text>}
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748b" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.headerContainer}>
            {/* Navbar */}
            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigateTo('Home')} style={styles.brandContainer}>
                    <View style={styles.logoBox}>
                        <Ionicons name="library" size={20} color="#fff" />
                    </View>
                    <Text style={styles.brandText}>LIBRARIA<Text style={{ color: '#3b82f6' }}>PRO</Text></Text>
                </TouchableOpacity>

                <View style={styles.rightNav}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.menuTrigger}>
                        <Text style={styles.menuTriggerText}>Menu</Text>
                        <Ionicons name={menuVisible ? "chevron-up" : "chevron-down"} size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigateTo('Profile')} style={styles.profileBtn}>
                        {user?.profilePicture ? (
                            <Image source={{ uri: user.profilePicture }} style={styles.navAvatar} />
                        ) : (
                            <View style={[styles.navAvatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dropdown Menu Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.dropdownMenu}>
                        <LinearGradient
                            colors={['#1e293b', '#0f172a']}
                            style={styles.menuGradient}
                        >
                            <Text style={styles.menuHeading}>Navigation</Text>

                            <MenuLink icon="grid-outline" label="Dashboard" screen="Home" />
                            <MenuLink icon="search-outline" label="Search Books" screen="Search" />
                            <MenuLink icon="person-outline" label="My Profile" screen="Profile" />
                            <MenuLink icon="time-outline" label="Borrow History" screen="History" />
                            <MenuLink icon="return-down-back-outline" label="Return Books" screen="Return" />

                            {user?.role === 'admin' && (
                                <>
                                    <View style={styles.divider} />
                                    <Text style={styles.menuHeading}>Admin</Text>
                                    <MenuLink icon="add-circle-outline" label="Add New Book" screen="AddBook" />
                                </>
                            )}
                        </LinearGradient>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20, // More breathing room on web
        paddingTop: Platform.OS === 'web' ? 30 : 50,
        zIndex: 100,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightNav: {
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
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
    },
    menuTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    menuTriggerText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    navAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#3b82f6',
    },
    avatarPlaceholder: {
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    // Dropdown Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)', // Lighter overlay
        justifyContent: 'flex-start',
        paddingTop: Platform.OS === 'web' ? 65 : 100,
        paddingRight: 20, // Align to right
        alignItems: 'flex-end', // Align to right
    },
    dropdownMenu: {
        width: 250, // Fixed smaller width
        backgroundColor: '#1e293b',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        marginRight: Platform.OS === 'web' ? 60 : 20,
    },
    menuGradient: {
        padding: 15,
    },
    menuHeading: {
        fontSize: 11,
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 2,
    },
    menuIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconDestructive: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    menuSubLabel: {
        fontSize: 10,
        color: '#64748b',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 8,
    }
});

export default VibrantHeader;
