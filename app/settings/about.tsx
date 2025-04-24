import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title" fontStyle="bold">About Saveance</ThemedText>
      <ThemedText>Saveance helps you discover and share the best shopping deals, clearance deals, and store closings nearby.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
