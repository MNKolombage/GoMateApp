// src/screens/ProfileScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { logout, updateUser } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/themeSlice';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  city: Yup.string().required('City is required'),
});

export default function ProfileScreen() {
  const user = useSelector(state => state.auth.user);
  const theme = useSelector(state => state.theme.mode);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(logout());
  };

  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      const updatedUser = { ...user, ...values };
      
      // Save to both 'user' and email-based key for persistence
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      await AsyncStorage.setItem(`user_${updatedUser.email}`, JSON.stringify(updatedUser));
      
      dispatch(updateUser(updatedUser));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#007AFF" />
        </View>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>My Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
        {!isEditing ? (
          // View Mode
          <>
            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
                <Ionicons name="person" size={24} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, isDark && styles.textDark]}>Name</Text>
                <Text style={[styles.infoValue, isDark && styles.textDark]}>{user?.name || 'Not provided'}</Text>
              </View>
            </View>

            <View style={[styles.divider, isDark && styles.dividerDark]} />

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
                <Ionicons name="mail" size={24} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, isDark && styles.textDark]}>Email</Text>
                <Text style={[styles.infoValue, isDark && styles.textDark]}>{user?.email || 'Not provided'}</Text>
              </View>
            </View>

            <View style={[styles.divider, isDark && styles.dividerDark]} />

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
                <Ionicons name="location" size={24} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, isDark && styles.textDark]}>City</Text>
                <Text style={[styles.infoValue, isDark && styles.textDark]}>{user?.city || 'Not provided'}</Text>
              </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Edit Mode
          <Formik
            initialValues={{
              name: user?.name || '',
              email: user?.email || '',
              city: user?.city || '',
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                {/* Name Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Name</Text>
                  <View style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                    touched.name && errors.name && styles.inputError
                  ]}>
                    <Ionicons name="person-outline" size={20} color={isDark ? '#999' : '#888'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="Enter your name"
                      placeholderTextColor={isDark ? '#666' : '#999'}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      editable={!isSubmitting}
                    />
                  </View>
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

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

                {/* City Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>City</Text>
                  <View style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                    touched.city && errors.city && styles.inputError
                  ]}>
                    <Ionicons name="location-outline" size={20} color={isDark ? '#999' : '#888'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="Enter your city"
                      placeholderTextColor={isDark ? '#666' : '#999'}
                      value={values.city}
                      onChangeText={handleChange('city')}
                      onBlur={handleBlur('city')}
                      editable={!isSubmitting}
                    />
                  </View>
                  {touched.city && errors.city && (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton, isDark && styles.cancelButtonDark]}
                    onPress={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    <Text style={[styles.cancelButtonText, isDark && styles.textDark]}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.saveButtonText}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        )}
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.settingsCard, isDark && styles.settingsCardDark]}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name={isDark ? "moon" : "sunny"} size={24} color={isDark ? "#FFD700" : "#007AFF"} />
            <Text style={[styles.settingLabel, isDark && styles.textDark]}>Dark Mode</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleSwitch, isDark && styles.toggleSwitchActive]}
            onPress={() => dispatch(toggleTheme())}
          >
            <View style={[styles.toggleThumb, isDark && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E4E8',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  actionButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsCardDark: {
    backgroundColor: '#2C2C2E',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  textDark: {
    color: '#FFFFFF',
  },
  toggleSwitch: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#E1E4E8',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#34C759',
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Dark mode styles
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  profileCardDark: {
    backgroundColor: '#2C2C2E',
  },
  iconContainerDark: {
    backgroundColor: '#3A3A3C',
  },
  dividerDark: {
    backgroundColor: '#48484A',
  },
  inputContainerDark: {
    backgroundColor: '#3A3A3C',
    borderColor: '#48484A',
  },
  inputDark: {
    color: '#E5E5E7',
  },
  cancelButtonDark: {
    backgroundColor: '#3A3A3C',
    borderColor: '#48484A',
  },
});
