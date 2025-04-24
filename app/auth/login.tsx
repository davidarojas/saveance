import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, useColorScheme } from 'react-native';
import { supabase } from '@/utils/supabaseClient';
import { ThemedText } from '@/components/ThemedText';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';

export default function LoginScreen({ navigation }: any) {
  const animation = useRef<LottieView>(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Login error', error.message);
    // You'd typically navigate to the main app here on success
  }

  const colorScheme = useColorScheme();
  const lottieBg = Colors[colorScheme ?? 'light'].accent;

  return (
    <View style={styles.container}>
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
      <ThemedText style={styles.link} onPress={() => navigation.navigate('signup')}>Sign up here</ThemedText>
      <ThemedText style={styles.link} onPress={() => navigation.navigate('forgot')}>Forgot your password?</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    padding: 24 
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
