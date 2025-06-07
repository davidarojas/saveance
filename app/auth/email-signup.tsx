import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, TextInput, Button, StyleSheet, Alert, useColorScheme, Platform, TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabaseClient';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState([
    { text: 'At least 8 characters', valid: false },
    { text: 'At least 1 number or symbol', valid: false },
  ]);
  const [loading, setLoading] = useState(false);

  // Password requirements check
  const checkPasswordRequirements = (pass: string) => {
    return [
      { 
        text: 'At least 8 characters', 
        valid: pass.length >= 8 
      },
      { 
        text: 'At least 1 number or symbol', 
        valid: /[^A-Za-z]/.test(pass) // Matches any non-letter character
      },
    ];
  };
  
  // Get count of valid requirements
  const getValidRequirementCount = () => {
    return passwordRequirements.filter(req => req.valid).length;
  };

  // Check if password is valid (matches all requirements)
  const isPasswordValid = getValidRequirementCount() === 2;
  
  // Check if all fields are valid to display "Create account" button
  const areAllFieldsValid = () => {
    return fullName.trim() !== '' && 
           !fullNameError &&
           email.trim() !== '' && 
           !emailError && 
           isPasswordValid;
  };

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(String(email).toLowerCase());
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    // Calculate strength based on requirements
    const requirements = checkPasswordRequirements(password);
    const validCount = requirements.filter(req => req.valid).length;
    
    // Map to 0-10 scale for consistency
    return validCount * 5; // 0, 5, or 10
  };

  const getPasswordStrengthColor = (strength: number): string => {
    const validCount = getValidRequirementCount();
    if (validCount === 0) return '#ff4444';  // Red (just started typing)
    if (validCount === 1) return '#ffbb33';  // Yellow (1 condition met)
    return '#2ecc71';  // Green (both conditions met)
  };

  // Full name validation
  const validateFullName = (name: string): boolean => {
    // Allows letters, spaces, hyphens, and apostrophes
    // Must contain at least one letter
    // Allows multiple spaces between names but not at start/end
    const re = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    return re.test(name.trim());
  };

  // Handle full name change by validating input
  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (text.trim() === '') {
      setFullNameError('');
    } else if (!validateFullName(text)) {
      setFullNameError('Please enter a valid name');
    } else {
      setFullNameError('');
    }
  };

  // Handle email change by validating input
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Handle password change by validating input and updating state
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const strength = calculatePasswordStrength(text);
    setPasswordStrength(strength);
    setPasswordRequirements(checkPasswordRequirements(text));
  };

  // Handle signup with email and password
  async function handleSignup() {
    setLoading(true);
    try {
      const { 
        data: { session },
        error
      } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        Alert.alert('Signup error', error.message);
        return;
      }
      
      if (session) {
        // Redirect to onboarding on successful signup
        router.replace('/(onboarding)' as any);
      } else {
        // If email confirmation is required
        Alert.alert('Please check your inbox for email verification!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred during signup');
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
      <View style={styles.inputContainer}>
        <ThemedText type="title" style={styles.title}>Create new account</ThemedText>
        <ThemedText style={[styles.label, { color: Colors[colorScheme ?? 'light'].label }]}>
          Full Name <ThemedText style={{ color: '#ff4444' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[
            styles.input, 
            { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: fullNameError ? '#ff4444' : '#7D868C'
            }
          ]}
          placeholder="John Doe"
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
          value={fullName}
          onChangeText={handleFullNameChange}
          autoCapitalize="words"
        />
        {fullNameError ? (
          <ThemedText style={styles.errorText}>{fullNameError}</ThemedText>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <ThemedText style={[styles.label, { color: Colors[colorScheme ?? 'light'].label }]}>
          Email <ThemedText style={{ color: '#ff4444' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[
            styles.input, 
            { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: emailError ? '#ff4444' : '#7D868C'
            }
          ]}
          placeholder="example@gmail.com"
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={handleEmailChange}
        />
        {emailError ? (
          <ThemedText style={styles.errorText}>{emailError}</ThemedText>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <ThemedText style={[styles.label, { color: Colors[colorScheme ?? 'light'].label }]}>
          Password <ThemedText style={{ color: '#ff4444' }}>*</ThemedText>
        </ThemedText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input, 
              styles.passwordInput, 
              { 
                color: Colors[colorScheme ?? 'light'].text,
              }
            ]}
            placeholder="Enter password"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={Colors[colorScheme ?? 'light'].tabIconDefault} 
            />
          </Pressable>
        </View>
        {password ? (
          <View style={styles.strengthMeter}>
            <View 
              style={[
                styles.strengthMeterFill, 
                { 
                  width: `${(passwordStrength / 10) * 100}%`,
                  backgroundColor: getPasswordStrengthColor(passwordStrength)
                }
              ]} 
            />
          </View>
        ) : null}
        {password ? (
          <ThemedText style={styles.strengthText}>
            {passwordStrength <= 1 ? 'Weak' : passwordStrength <= 5 ? 'Fair' : passwordStrength <= 8 ? 'Good' : 'Strong'}
          </ThemedText>
        ) : null}
      </View>
      {password && !isPasswordValid && (
        <View style={[
          styles.requirementsContainer,
          { borderLeftColor: isPasswordValid ? '#2ecc71' : '#ff4444' }
        ]}>
          <ThemedText style={styles.requirementsTitle}>
            {isPasswordValid ? 'All password requirements met!' : 'Password requirements:'}
          </ThemedText>
          {passwordRequirements.map((req, index) => (
            <ThemedText 
              key={index} 
              style={[
                styles.requirementText,
                { color: req.valid ? '#2ecc71' : '#ff4444' }
              ]}
            >
              {req.valid ? '✓' : '•'} {req.text}
            </ThemedText>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.button, 
          { 
            backgroundColor: areAllFieldsValid() 
              ? Colors[colorScheme ?? 'light'].accent 
              : '#cccccc',
            opacity: areAllFieldsValid() ? 1 : 0.7
          }
        ]}
        onPress={areAllFieldsValid() ? () => router.push('/auth/email-signup' as any) : undefined}
        disabled={!areAllFieldsValid()}
      >
        <ThemedText style={styles.buttonText}>Create account</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  title: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#7D868C', 
    borderRadius: 6, 
    padding: 12,
    width: '100%'
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 40, // Make room for the eye icon
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  link: { 
    color: '#007AFF',
    marginTop: 16 
  },
  buttonContainer: {
    paddingTop: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  strengthMeter: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  strengthMeterFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  requirementsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 6,
    borderLeftWidth: 3,
  },
  requirementsTitle: {
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  },
});
