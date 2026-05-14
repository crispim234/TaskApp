import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import type { SplashScreenProps } from '../types';

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);
  const glowOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.logoContainer, { opacity, transform: [{ scale }] }]}>
        <View style={styles.iconWrapper}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.appName}>TaskApp</Text>
        <Text style={styles.tagline}>Organize. Foque. Conquiste.</Text>
      </Animated.View>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(124, 92, 252, 0.12)',
    top: '30%',
    alignSelf: 'center',
  },
  logoContainer: { alignItems: 'center' },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(124, 92, 252, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.3)',
  },
  logo: { width: 56, height: 56 },
  appName: { fontSize: 36, fontWeight: '800', color: '#F4F4F5', letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: '#8B8FA8', marginTop: 8 },
  version: { position: 'absolute', bottom: 40, color: '#4A4E65', fontSize: 12 },
});
