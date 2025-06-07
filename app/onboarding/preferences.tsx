import React, { useState } from 'react';
import { View, StyleSheet, Switch, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';

type ShoppingSchedule = {
  weekends: boolean;
  weekdays: boolean;
  mornings: boolean;
  afternoons: boolean;
  evenings: boolean;
};

export type PreferencesData = {
  notificationRadius: number;
  dealThreshold: number;
  shoppingSchedule: ShoppingSchedule;
  darkMode: boolean;
  units: 'imperial' | 'metric';
};

interface PreferencesStepProps {
  data: PreferencesData;
  onUpdate: (data: PreferencesData) => void;
}

export default function PreferencesStep({ data, onUpdate }: PreferencesStepProps) {
  const colorScheme = useColorScheme();
  const [localData, setLocalData] = useState<PreferencesData>(data);

  const handleUpdate = (updates: Partial<PreferencesData>) => {
    const newData = { ...localData, ...updates };
    setLocalData(newData);
    onUpdate(newData);
  };

  const updateShoppingSchedule = (key: keyof ShoppingSchedule, value: boolean) => {
    const updatedSchedule = { ...localData.shoppingSchedule, [key]: value };
    handleUpdate({ shoppingSchedule: updatedSchedule });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedText style={styles.title}>Preferences</ThemedText>
      <ThemedText style={styles.subtitle}>Customize your shopping experience</ThemedText>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notification Radius (miles)</ThemedText>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
            value={localData.notificationRadius.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              handleUpdate({ notificationRadius: value });
            }}
            keyboardType="numeric"
          />
          <ThemedText style={styles.unit}>miles</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Deal Threshold (%)</ThemedText>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
            value={localData.dealThreshold.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              handleUpdate({ dealThreshold: value });
            }}
            keyboardType="numeric"
          />
          <ThemedText style={styles.unit}>%</ThemedText>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Units</ThemedText>
        <View style={styles.unitButtons}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              localData.units === 'imperial' && styles.unitButtonActive,
            ]}
            onPress={() => handleUpdate({ units: 'imperial' })}
          >
            <ThemedText
              style={[
                styles.unitButtonText,
                localData.units === 'imperial' && styles.unitButtonTextActive,
              ]}
            >
              Imperial (miles, °F)
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              localData.units === 'metric' && styles.unitButtonActive,
            ]}
            onPress={() => handleUpdate({ units: 'metric' })}
          >
            <ThemedText
              style={[
                styles.unitButtonText,
                localData.units === 'metric' && styles.unitButtonTextActive,
              ]}
            >
              Metric (km, °C)
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Shopping Schedule</ThemedText>
        <PreferenceToggle
          label="Dark Mode"
          value={localData.darkMode}
          onValueChange={(value) => handleUpdate({ darkMode: value })}
        />
        <PreferenceToggle
          label="Weekends"
          value={localData.shoppingSchedule.weekends}
          onValueChange={(value) => updateShoppingSchedule('weekends', value)}
        />
        <PreferenceToggle
          label="Weekdays"
          value={localData.shoppingSchedule.weekdays}
          onValueChange={(value) => updateShoppingSchedule('weekdays', value)}
        />
        <View style={styles.timePreferences}>
          <PreferenceToggle
            label="Mornings (6am-12pm)"
            value={localData.shoppingSchedule.mornings}
            onValueChange={(value) => updateShoppingSchedule('mornings', value)}
          />
          <PreferenceToggle
            label="Afternoons (12pm-5pm)"
            value={localData.shoppingSchedule.afternoons}
            onValueChange={(value) => updateShoppingSchedule('afternoons', value)}
          />
          <PreferenceToggle
            label="Evenings (5pm-10pm)"
            value={localData.shoppingSchedule.evenings}
            onValueChange={(value) => updateShoppingSchedule('evenings', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
        <View style={styles.toggleContainer}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch
            value={localData.darkMode}
            onValueChange={(value) => onUpdate({ ...localData, darkMode: value })}
          />
        </View>
      </View>
    </ScrollView>
  );
}

interface PreferenceToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function PreferenceToggle({ label, value, onValueChange }: PreferenceToggleProps) {
  return (
    <View style={styles.toggleContainer}>
      <ThemedText>{label}</ThemedText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  unitButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  unitButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#f0f0f0',
    borderColor: '#4CAF50',
  },
  unitButtonText: {
    fontSize: 14,
  },
  unitButtonTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  unit: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timePreferences: {
    marginTop: 8,
    marginLeft: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    alignItems: 'center',
  },
});