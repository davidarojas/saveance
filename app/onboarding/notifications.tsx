import React, { useState } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';

interface NotificationPrefs {
  pushEnabled: boolean;
  dealAlerts: boolean;
  priceDrops: boolean;
  soundEnabled: boolean;
  vibrate: boolean;
  frequency: 'instant' | 'digest' | 'daily';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationsStepProps {
  data: NotificationPrefs;
  onUpdate: (prefs: NotificationPrefs) => void;
}

export default function NotificationsStep({ data, onUpdate }: NotificationsStepProps) {
  const colorScheme = useColorScheme();
  const [notificationSettings, setNotificationSettings] = useState<NotificationPrefs>(data);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);

  // Check notification permissions on mount
  React.useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
    
    // If permission is granted, update push notifications setting
    if (status === 'granted' && !notificationSettings.pushEnabled) {
      const updated = { ...notificationSettings, pushEnabled: true };
      setNotificationSettings(updated);
      onUpdate(updated);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true
      },
    });
    
    setPermissionStatus(status);
    
    if (status === 'granted') {
      const updated = { ...notificationSettings, pushEnabled: true };
      setNotificationSettings(updated);
      onUpdate(updated);
    }
  };

  const toggleSetting = (setting: keyof Omit<NotificationPrefs, 'quietHours' | 'frequency'>) => {
    const updated = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    } as NotificationPrefs;
    setNotificationSettings(updated);
    onUpdate(updated);
  };

  const toggleQuietHours = (enabled: boolean) => {
    const updated = {
      ...notificationSettings,
      quietHours: {
        ...notificationSettings.quietHours,
        enabled
      }
    };
    setNotificationSettings(updated);
    onUpdate(updated);
  };

  const setFrequency = (frequency: 'instant' | 'digest' | 'daily') => {
    const updated = { ...notificationSettings, frequency };
    setNotificationSettings(updated);
    onUpdate(updated);
  };

  const renderToggle = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingTextContainer}>
        <ThemedText style={styles.settingLabel}>{label}</ThemedText>
        {description && (
          <ThemedText style={styles.settingDescription}>{description}</ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors[colorScheme].border, true: Colors[colorScheme].primary }}
        thumbColor="#fff"
      />
    </View>
  );

  const renderFrequencyOption = (value: 'instant' | 'digest' | 'daily', label: string) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.frequencyOption,
        notificationSettings.frequency === value && {
          backgroundColor: `${Colors[colorScheme].primary}20`,
          borderColor: Colors[colorScheme].primary,
        },
      ]}
      onPress={() => setFrequency(value)}
    >
      <View style={[
        styles.radioOuter,
        { borderColor: Colors[colorScheme].border },
      ]}>
        {notificationSettings.frequency === value && (
          <View style={[
            styles.radioInner,
            { backgroundColor: Colors[colorScheme].primary },
          ]} />
        )}
      </View>
      <ThemedText style={styles.frequencyLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.title, { color: Colors[colorScheme].text }]}>Notification Preferences</ThemedText>
      <ThemedText style={styles.subtitle}>
        Choose how you'd like to receive updates and alerts
      </ThemedText>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notification Methods</ThemedText>
        {renderToggle(
          'Push Notifications',
          notificationSettings.pushEnabled,
          (value) => {
            if (value && permissionStatus !== 'granted') {
              requestPermissions();
            } else {
              toggleSetting('pushEnabled');
            }
          },
          'Get instant alerts on your device'
        )}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notification Types</ThemedText>
        {renderToggle(
          'Deal Alerts',
          notificationSettings.dealAlerts,
          () => toggleSetting('dealAlerts'),
          'Get notified about new deals from your favorite stores'
        )}
        {renderToggle(
          'Price Drop Alerts',
          notificationSettings.priceDrops,
          () => toggleSetting('priceDrops'),
          'Be the first to know when prices drop on your saved items'
        )}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notification Settings</ThemedText>
        {renderToggle(
          'Sound',
          notificationSettings.soundEnabled,
          () => toggleSetting('soundEnabled'),
          'Play sound for notifications'
        )}
        {renderToggle(
          'Vibrate',
          notificationSettings.vibrate,
          () => toggleSetting('vibrate'),
          'Vibrate for notifications'
        )}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notification Frequency</ThemedText>
        <View style={styles.frequencyContainer}>
          {renderFrequencyOption('instant', 'Instant')}
          {renderFrequencyOption('digest', 'Digest (2-3x daily)')}
          {renderFrequencyOption('daily', 'Daily Summary')}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.quietHoursHeader}>
          <ThemedText style={styles.sectionTitle}>Quiet Hours</ThemedText>
          <Switch
            value={notificationSettings.quietHours.enabled}
            onValueChange={toggleQuietHours}
            trackColor={{ false: Colors[colorScheme].border, true: Colors[colorScheme].primary }}
            thumbColor="#fff"
          />
        </View>
        <ThemedText style={styles.settingDescription}>
          {notificationSettings.quietHours.enabled 
            ? `Notifications will be silenced between ${notificationSettings.quietHours.start} and ${notificationSettings.quietHours.end}`
            : 'Turn on to silence notifications during specific hours'}
        </ThemedText>
        
        {notificationSettings.quietHours.enabled && (
          <View style={styles.timePickers}>
            <View style={styles.timePickerContainer}>
              <ThemedText style={styles.timeLabel}>From</ThemedText>
              <TouchableOpacity style={styles.timeButton}>
                <ThemedText>{notificationSettings.quietHours.start}</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.timePickerContainer}>
              <ThemedText style={styles.timeLabel}>To</ThemedText>
              <TouchableOpacity style={styles.timeButton}>
                <ThemedText>{notificationSettings.quietHours.end}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
    marginBottom: 8,
    color: '#000', // Default color, will be overridden by style prop
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
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
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  frequencyContainer: {
    marginTop: 8,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  frequencyLabel: {
    fontSize: 16,
  },
  quietHoursHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timePickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  timePickerContainer: {
    flex: 1,
    marginRight: 16,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
});