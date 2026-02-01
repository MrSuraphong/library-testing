import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const BackgroundGlow = () => {
    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={[styles.glowOrb, styles.glowOrbLeft]} />
            <View style={[styles.glowOrb, styles.glowOrbRight]} />
            <View style={styles.noiseOverlay} />
        </View>
    );
};

const styles = StyleSheet.create({
    glowOrb: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75,
        opacity: 0.3,
        // Web Blur
        ...Platform.select({
            web: {
                filter: 'blur(120px)',
            },
            default: {
                // Approximate blur for native (though simple opacity looks okay too)
            }
        })
    },
    glowOrbLeft: {
        backgroundColor: '#3b82f6', // Blue
        top: -width * 0.4,
        left: -width * 0.4,
    },
    glowOrbRight: {
        backgroundColor: '#f97316', // Orange
        top: height * 0.2,
        right: -width * 0.6,
        opacity: 0.2,
    },
    noiseOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)', // Slight dim
        zIndex: -1,
    }
});

export default BackgroundGlow;
