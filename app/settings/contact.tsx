import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Contact Us</ThemedText>
      <ThemedText>If you have any questions or feedback, reach out to us at support@saveance.com.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
