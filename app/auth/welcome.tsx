import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const lottieBg = Colors[colorScheme ?? 'light'].accent;
  const animation = useRef<LottieView>(null);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.lottieContainer, { backgroundColor: lottieBg }]}> 
        <LottieView
          ref={animation}
          style={styles.lottie}
          source={require('@/assets/lottie/save-money-lottie.json')}
          autoPlay
          loop
        />
      </View>
      <ThemedText type="title" style={styles.title}>Welcome to Saveance</ThemedText>
      <ThemedText style={[styles.description, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
        Discover and share the best store deals, clearance deals, and store closings nearby.
      </ThemedText>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
        onPress={() => router.push('/auth/signup' as any)}
      >
        <ThemedText style={styles.buttonText}>Create an account</ThemedText>
      </TouchableOpacity>
      <ThemedText style={[styles.loginLink, { color: Colors[colorScheme ?? 'light'].text }]} onPress={() => router.push('/auth/login' as any)}>
        Already have an account? <ThemedText style={styles.loginLinkBold} fontStyle="bold">Log in</ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  lottieContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  lottie: {
    width: 200,
    height: 200
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 12
  },
  description: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 32,
    fontSize: 16
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  },
  loginLink: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15
  },
  loginLinkBold: {
    fontWeight: 'bold'
  },
});
