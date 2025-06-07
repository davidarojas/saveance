import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, StyleSheet, Alert, useColorScheme, TouchableOpacity, Platform, Linking } from 'react-native';
import { supabase } from '@/utils/supabaseClient';
import { ThemedText } from '@/components/ThemedText';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin'
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const lottieBg = Colors[colorScheme ?? 'light'].accent;
  const animation = useRef<LottieView>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // TODO: Finish setting up google sign in configuration
  // GoogleSignin.configure({
  //   scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  //   webClientId: 'YOUR CLIENT ID FROM GOOGLE CONSOLE',
  // })

  async function handleSignup() {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.signUp({ 
        email, 
        password 
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
        Alert.alert('Check your email for a confirmation link!');
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
      <View style={[styles.lottieContainer, { backgroundColor: lottieBg }]}> 
        <LottieView
          ref={animation}
          style={styles.lottie}
          source={require('@/assets/lottie/login-lottie.json')}
          autoPlay
          loop
        />
      </View>
      <ThemedText type="title">Sign Up</ThemedText>
      <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
              onPress={() => router.push('/auth/email-signup' as any)}
            >
              <ThemedText style={styles.buttonText}>Sign up with email</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.orText} fontStyle="bold">or</ThemedText>
      {Platform.OS === 'ios' && (
        <View style={{ width: '100%', height: 50, marginVertical: 2, overflow: 'hidden', borderRadius: 8 }}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
            buttonStyle={colorScheme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={{ width: '100%', height: '100%' }}
            onPress={async () => {
              try {
                const credential = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                })
                if (credential.identityToken) {
                  // Get the full name from Apple's response if available
                  const fullName = credential.fullName
                    ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
                    : '';

                  // Sign in with Supabase
                  const { data: authData, error: signInError } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken
                  });
                  
                  // Update user metadata with full name if available
                  if (fullName) {
                    await supabase.auth.updateUser({
                      data: { full_name: fullName }
                    });
                  }

                  if (signInError) {
                    Alert.alert('Apple Sign In Error', signInError.message);
                    return;
                  }

                  if (authData?.session) {
                    router.replace('/(onboarding)' as any);
                  }
                }
              } catch (e) {
                if ((e as any).code !== 'ERR_REQUEST_CANCELED') {
                  Alert.alert('Error', 'Failed to sign in with Apple');
                }
              }
            }}
          />
        </View>
      )}
      {/* {(Platform.OS === 'android' || Platform.OS == 'ios') && (
        <View style={{ width: '100%', height: 50, marginVertical: 2, overflow: 'hidden', borderRadius: 8 }}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={colorScheme === 'dark' ? GoogleSigninButton.Color.Light : GoogleSigninButton.Color.Dark}
            onPress={async () => {
              try {
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                if (userInfo?.data?.idToken) {
                  const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                  })
                  console.log(error, data)
                } else {
                  throw new Error('no ID token present!')
                }
              } catch (error: any) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                  return;
                } else if (error.code === statusCodes.IN_PROGRESS) {
                  return;
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                  Alert.alert(
                    'Google Play Services Required',
                    'Please update Google Play Services to sign in with Google.',
                    [
                      {
                        text: 'Update',
                        onPress: () => {
                          // Open Play Store to update Google Play Services
                          if (Platform.OS === 'android') {
                            Linking.openURL('market://details?id=com.google.android.gms');
                          }
                        }
                      },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  );
                } else {
                  Alert.alert(
                    'Sign In Error',
                    'Unable to sign in with Google. Please try again later.'
                  );
                  console.error('Google Sign-In Error:', error);
                }
              }
            }}
          />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24,
    paddingTop: 60
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
    borderColor: '#ccc', 
    borderRadius: 6, 
    marginVertical: 8, 
    padding: 12 
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
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  },
  orText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  }
});
