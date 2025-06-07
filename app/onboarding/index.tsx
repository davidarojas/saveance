import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

// Import steps
import PreferencesStep from './preferences';
import StoreSelectionStep from './store-selection';
import CategoriesStep from './categories';
import NotificationsStep from './notifications';

export interface OnboardingData {
  // Store preferences
  favorite_stores: string[];
  preferred_categories: string[];
  
  // Deal preferences
  deal_threshold: number;
  notification_radius: number;
  
  // Shopping schedule
  shopping_schedule: {
    weekends: boolean;
    weekdays: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
  };
  
  // Notification preferences
  push_notifications_enabled: boolean;
  deal_posted_alerts: boolean;
  deal_confirmed_alerts: boolean;
  deal_expiring_alerts: boolean;
  location_notifications: boolean;
  
  // Quiet hours
  quiet_hours_start: string; // Format: 'HH:MM:SS'
  quiet_hours_end: string;   // Format: 'HH:MM:SS'
}

const TOTAL_STEPS = 4;

export default function OnboardingFlow() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    favorite_stores: [],
    preferred_categories: [],
    deal_threshold: 20,
    notification_radius: 10,
    shopping_schedule: {
      weekends: true,
      weekdays: true,
      mornings: true,
      afternoons: true,
      evenings: true
    },
    push_notifications_enabled: true,
    deal_posted_alerts: true,
    deal_confirmed_alerts: true,
    deal_expiring_alerts: true,
    location_notifications: true,
    quiet_hours_start: '20:00:00',
    quiet_hours_end: '08:00:00'
  });

  // Update form data with type safety
  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleComplete = () => {
    console.log('Onboarding complete!', formData);
    // TODO: Save onboarding data and navigate to main app
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PreferencesStep
            data={{
              notificationRadius: formData.notification_radius,
              dealThreshold: formData.deal_threshold,
              shoppingSchedule: formData.shopping_schedule,
              darkMode: false, // Not used in new schema
              units: 'imperial' as const, // Default value
            }}
            onUpdate={(updates) => {
              updateFormData({
                notification_radius: updates.notificationRadius,
                deal_threshold: updates.dealThreshold,
                shopping_schedule: updates.shoppingSchedule,
              });
            }}
          />
        );
      case 2:
        return (
          <StoreSelectionStep
            data={formData.favorite_stores}
            onUpdate={(data) => updateFormData({ favorite_stores: data })}
          />
        );
      case 3:
        return (
          <CategoriesStep
            data={formData.preferred_categories}
            onUpdate={(data) => updateFormData({ preferred_categories: data })}
          />
        );
      case 4:
        return (
          <NotificationsStep
            data={{
              pushEnabled: formData.push_notifications_enabled,
              dealAlerts: formData.deal_posted_alerts,
              priceDrops: formData.deal_confirmed_alerts,
              soundEnabled: true, // Default value
              vibrate: true, // Default value
              frequency: 'instant' as const, // Default value
              quietHours: {
                enabled: true, // Always enabled in new schema
                start: formData.quiet_hours_start,
                end: formData.quiet_hours_end,
              },
            }}
            onUpdate={(updates) => {
              const updatesToApply: Partial<OnboardingData> = {
                push_notifications_enabled: updates.pushEnabled,
                deal_posted_alerts: updates.dealAlerts,
                deal_confirmed_alerts: updates.priceDrops,
              };
              
              if (updates.quietHours?.start) {
                updatesToApply.quiet_hours_start = updates.quietHours.start;
              }
              
              if (updates.quietHours?.end) {
                updatesToApply.quiet_hours_end = updates.quietHours.end;
              }
              
              updateFormData(updatesToApply);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme as keyof typeof Colors].background },
      ]}
    >
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${(currentStep / 4) * 100}%` },
          ]}
        />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.stepDot,
              currentStep === step && styles.activeStepDot,
              currentStep > step && styles.completedStepDot,
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 1 ? (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={handleBack}
          >
            <ThemedText style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />

        {currentStep < 4 ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.nextButton,
              {
                backgroundColor:
                  Colors[colorScheme as keyof typeof Colors].primary,
              },
            ]}
            onPress={handleNext}
          >
            <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
              Next
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              styles.completeButton,
              {
                backgroundColor:
                  Colors[colorScheme as keyof typeof Colors].primary,
              },
            ]}
            onPress={handleComplete}
          >
            <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
              Get Started
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: '#007AFF',
  },
  completedStepDot: {
    backgroundColor: '#4CAF50',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});