// src/screens/RegisterScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import api from '../services/api';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  city: Yup.string().min(2, 'City name too short').required('City is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function RegisterScreen({ navigation }) {
  const theme = useSelector(state => state.theme.mode);
  const isDark = theme === 'dark';
  
  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      // Save user registration data to AsyncStorage
      const userData = {
        name: values.name,
        email: values.email,
        city: values.city,
      };
      
      // Save to both registeredUser and email-based key
      await AsyncStorage.setItem('registeredUser', JSON.stringify(userData));
      await AsyncStorage.setItem(`user_${values.email}`, JSON.stringify(userData));
      
      // Use dummy behavior: navigate back to login
      await api.post('/users/add', {
        name: values.name,
        email: values.email,
        city: values.city,
        password: values.password,
      }).catch(() => null);
      
      // Show success and go back to login
      alert('Registration successful! Please login.');
      navigation.goBack();
    } catch (err) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerSection}>
        <Ionicons name="person-add" size={60} color="#2196F3" />
        <Text style={[styles.title, isDark && styles.textDark]}>Create Account</Text>
        <Text style={[styles.subtitle, isDark && styles.textDark]}>Join GoMate for better travel experience</Text>
      </View>

      <Formik 
        initialValues={{ name: '', email: '', city: '', password: '', confirmPassword: '' }} 
        validationSchema={RegisterSchema} 
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={[styles.formContainer, isDark && styles.formContainerDark]}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Full Name</Text>
              <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
                <Ionicons name="person-outline" size={20} color={isDark ? '#999' : '#666'} style={styles.inputIcon} />
                <TextInput 
                  placeholder="Enter your full name" 
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  style={[styles.input, isDark && styles.inputDark]} 
                  onChangeText={handleChange('name')} 
                  onBlur={handleBlur('name')} 
                  value={values.name}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Email Address</Text>
              <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
                <Ionicons name="mail-outline" size={20} color={isDark ? '#999' : '#666'} style={styles.inputIcon} />
                <TextInput 
                  placeholder="your.email@example.com" 
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  style={[styles.input, isDark && styles.inputDark]} 
                  onChangeText={handleChange('email')} 
                  onBlur={handleBlur('email')} 
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* City Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>City</Text>
              <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
                <Ionicons name="location-outline" size={20} color={isDark ? '#999' : '#666'} style={styles.inputIcon} />
                <TextInput 
                  placeholder="Your city" 
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  style={[styles.input, isDark && styles.inputDark]} 
                  onChangeText={handleChange('city')} 
                  onBlur={handleBlur('city')} 
                  value={values.city}
                  autoCapitalize="words"
                />
              </View>
              {errors.city && touched.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Password</Text>
              <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
                <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#999' : '#666'} style={styles.inputIcon} />
                <TextInput 
                  placeholder="Create a password" 
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  secureTextEntry 
                  style={[styles.input, isDark && styles.inputDark]} 
                  onChangeText={handleChange('password')} 
                  onBlur={handleBlur('password')} 
                  value={values.password}
                  autoCapitalize="none"
                />
              </View>
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Confirm Password</Text>
              <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
                <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#999' : '#666'} style={styles.inputIcon} />
                <TextInput 
                  placeholder="Re-enter password" 
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  secureTextEntry 
                  style={[styles.input, isDark && styles.inputDark]} 
                  onChangeText={handleChange('confirmPassword')} 
                  onBlur={handleBlur('confirmPassword')} 
                  value={values.confirmPassword}
                  autoCapitalize="none"
                />
              </View>
              {errors.confirmPassword && touched.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

            <TouchableOpacity 
              style={[styles.button, isSubmitting && styles.buttonDisabled]} 
              onPress={handleSubmit} 
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
              <Text style={[styles.loginLinkText, isDark && styles.textDark]}>Already have an account? <Text style={styles.loginLinkBold}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: { 
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#333',
  },
  errorText: { 
    color: '#f44336', 
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  // Dark mode styles
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  textDark: {
    color: '#E5E5E7',
  },
  inputContainerDark: {
    backgroundColor: '#3A3A3C',
    borderColor: '#48484A',
  },
  inputDark: {
    color: '#E5E5E7',
  },
  formContainerDark: {
    backgroundColor: '#2C2C2E',
  },
});
