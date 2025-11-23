// src/screens/LoginScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { loginSuccess } from '../redux/slices/authSlice';
import { loginUser } from '../services/authService';

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Username or email is required'),
  password: Yup.string().min(3, 'Too short').required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);
  const isDark = theme === 'dark';
  const [showApiHelp, setShowApiHelp] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // First check local registered users before trying API
      const userByEmailStr = await AsyncStorage.getItem(`user_${values.email}`);
      const userByEmail = userByEmailStr ? JSON.parse(userByEmailStr) : null;
      
      const registeredUserStr = await AsyncStorage.getItem('registeredUser');
      const registeredUser = registeredUserStr ? JSON.parse(registeredUserStr) : null;
      
      // If local user found, use it directly (no API call needed)
      if (userByEmail || registeredUser) {
        const user = userByEmail || registeredUser;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        dispatch(loginSuccess({ user }));
        setSubmitting(false);
        return;
      }
      
      // Only try DummyJSON API if no local user exists
      const username = values.email.includes('@') ? values.email.split('@')[0] : values.email;
      const apiResult = await loginUser(username, values.password);
      
      if (apiResult.success) {
        // Successful API login
        const user = {
          id: apiResult.user.id,
          name: `${apiResult.user.firstName} ${apiResult.user.lastName}`,
          email: apiResult.user.email,
          city: apiResult.user.address?.city || 'Not specified',
          username: apiResult.user.username,
          image: apiResult.user.image,
          token: apiResult.user.token
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem(`user_${apiResult.user.email}`, JSON.stringify(user));
        dispatch(loginSuccess({ user }));
        setSubmitting(false);
        return;
      }
      
      // No valid credentials found
      setErrors({ 
        general: 'Invalid credentials. Try: emilys / emilyspass (DummyJSON API)'
      });
      setShowApiHelp(true);
      
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, isDark && styles.containerDark]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.header}>
          <Ionicons name="bus" size={60} color="#007AFF" />
          <Text style={[styles.title, isDark && styles.textDark]}>Welcome Back!</Text>
          <Text style={[styles.subtitle, isDark && styles.textDark]}>Sign in to continue your journey</Text>
        </View>

        {showApiHelp && (
          <View style={styles.apiHelpBox}>
            <Text style={styles.apiHelpTitle}>🔑 Demo Credentials (DummyJSON API)</Text>
            <Text style={styles.apiHelpText}>Username: emilys | Password: emilyspass</Text>
            <Text style={styles.apiHelpText}>Username: michaelw | Password: michaelwpass</Text>
            <Text style={styles.apiHelpText}>Or register a new account!</Text>
          </View>
        )}

        <View style={[styles.formCard, isDark && styles.formCardDark]}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Email</Text>
                  <View style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                    touched.email && errors.email && styles.inputError
                  ]}>
                    <Ionicons name="mail-outline" size={20} color={isDark ? '#999' : '#888'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="Enter your email"
                      placeholderTextColor={isDark ? '#666' : '#999'}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      editable={!isSubmitting}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Password</Text>
                  <View style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                    touched.password && errors.password && styles.inputError
                  ]}>
                    <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#999' : '#888'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="Enter your password"
                      placeholderTextColor={isDark ? '#666' : '#999'}
                      secureTextEntry
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      editable={!isSubmitting}
                    />
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* General Error */}
                {errors.general && (
                  <Text style={styles.generalError}>{errors.general}</Text>
                )}

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>

        {/* Register Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.textDark]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  apiHelpBox: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 8,
  },
  apiHelpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  apiHelpText: {
    fontSize: 13,
    color: '#424242',
    marginBottom: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E4E8',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#1A1A1A',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 6,
    marginLeft: 4,
  },
  generalError: {
    fontSize: 13,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  // Dark mode styles
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  textDark: {
    color: '#E5E5E7',
  },
  formCardDark: {
    backgroundColor: '#2C2C2E',
  },
  inputContainerDark: {
    backgroundColor: '#3A3A3C',
    borderColor: '#48484A',
  },
  inputDark: {
    color: '#E5E5E7',
  },
});
