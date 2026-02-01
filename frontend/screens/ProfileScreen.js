import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axiosClient from '../api/axiosCliend';
import * as ImagePicker from 'expo-image-picker';
import BackgroundGlow from '../components/BackgroundGlow';
import VibrantHeader from '../components/VibrantHeader';

export default function ProfileScreen({ navigation }) {
    const { user, logout, updateUser } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || ''); // Assuming user object has email
    const [profileImage, setProfileImage] = useState(user?.profilePicture || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setProfileImage(user.profilePicture || null);
        }
    }, [user]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.put(`/users/${user._id}`, {
                username,
                email,
                profilePicture: profileImage
            });

            updateUser(response.data); // specific to your AuthContext implementation
            setEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <BackgroundGlow />
            <VibrantHeader />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.mainCard}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.pageTitle}>My Profile</Text>
                        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                            <Ionicons name="log-out-outline" size={20} color="#f87171" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={editing ? pickImage : null} disabled={!editing}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <Text style={styles.avatarText}>{username?.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                            {editing && (
                                <View style={styles.editBadge}>
                                    <Ionicons name="camera" size={16} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {!editing && (
                            <View style={styles.userInfo}>
                                <Text style={styles.userNameDisplay}>{user?.username}</Text>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.userRoleDisplay}>{user?.role?.toUpperCase()}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={[styles.input, !editing && styles.inputDisabled]}
                                value={username}
                                onChangeText={setUsername}
                                editable={editing}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={[styles.input, !editing && styles.inputDisabled]}
                                value={email}
                                onChangeText={setEmail}
                                editable={editing}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        {editing ? (
                            <>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                                    <Text style={styles.cancelBtnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.saveBtnText}>Save Changes</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
                                <Text style={styles.editBtnText}>Edit Profile</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.historyLink}
                        onPress={() => navigation.navigate('History')}
                    >
                        <View style={styles.historyIconBox}>
                            <Ionicons name="time" size={24} color="#3b82f6" />
                        </View>
                        <View>
                            <Text style={styles.historyTitle}>Borrowing History</Text>
                            <Text style={styles.historySub}>View your past books</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#64748b" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02040a',
    },
    content: {
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    mainCard: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 24,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start', // Align left
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1, // Take up space
        textAlign: 'center',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        padding: 8, // Smaller padding since text removed if icon only
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    logoutText: {
        color: '#f87171',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 5,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#3b82f6',
    },
    avatarPlaceholder: {
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3b82f6',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0f172a',
    },
    userInfo: {
        alignItems: 'center',
        marginTop: 15,
    },
    userNameDisplay: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    roleBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    userRoleDisplay: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },
    formSection: {
        marginBottom: 30,
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#94a3b8',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 12,
        color: '#fff',
        fontSize: 16,
    },
    inputDisabled: {
        color: '#cbd5e1',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        paddingLeft: 0,
        paddingVertical: 0,
    },
    actionButtons: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 10,
    },
    editBtn: {
        flex: 1,
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    editBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#334155',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: '#10b981',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyLink: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    historyIconBox: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    historySub: {
        color: '#94a3b8',
        fontSize: 12,
    }
});
