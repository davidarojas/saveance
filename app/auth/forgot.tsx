import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/utils/supabaseClient';
import { ThemedText } from '@/components/ThemedText';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Check your email for password reset instructions!');
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title">Forgot Password</ThemedText>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title={loading ? 'Sending...' : 'Send Reset Link'} onPress={handleReset} disabled={loading} />
      <ThemedText style={styles.link} onPress={() => navigation.navigate('login')}>Back to login</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginVertical: 8, padding: 12 },
  link: { color: '#007AFF', marginTop: 16 },
});
