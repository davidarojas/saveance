import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, TextInput, Button, StyleSheet, Alert, useColorScheme, Platform } from 'react-native';
import { supabase } from '@/utils/supabaseClient';
import { ThemedText } from '@/components/ThemedText';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const lottieBg = Colors[colorScheme ?? 'light'].accent;
  const animation = useRef<LottieView>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        Alert.alert('Login error', error.message);
        return;
      }
      
      // Redirect to onboarding on successful login
      router.replace('/(onboarding)' as any);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={({ pressed }) => [
            styles.backButton,
            pressed ? styles.backButtonPressed : null
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </Pressable>
      </View>
      <View style={[styles.lottieContainer, { backgroundColor: lottieBg }]}> 
        <LottieView
          ref={animation}
          style={styles.lottie}
          source={require('@/assets/lottie/login-lottie.json')}
          autoPlay
          loop
        />
      </View>
      <ThemedText type="title">Sign In</ThemedText>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <ThemedText style={styles.link} onPress={() => router.push('/auth/signup' as any)}>Sign up here</ThemedText>
      <ThemedText style={styles.link} onPress={() => router.push('/auth/forgot' as any)}>Forgot your password?</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    padding: 24 
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#7D868C', 
    borderRadius: 6, 
    marginVertical: 8, 
    padding: 12 
  },
  link: { 
    color: '#007AFF',
    marginTop: 16 
  },
  buttonContainer: {
    paddingTop: 20,
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
});
