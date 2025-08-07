import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserBookings } from '@/components/UserBookings';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';

export default function BookingsScreen() {
  const [userEmail, setUserEmail] = useState('');
  const [isViewingBookings, setIsViewingBookings] = useState(false);

  const handleViewBookings = () => {
    if (!userEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    setIsViewingBookings(true);
  };

  const handleBack = () => {
    setIsViewingBookings(false);
    setUserEmail('');
  };

  if (isViewingBookings) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            My Bookings
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Email: {userEmail}
          </ThemedText>
        </ThemedView>
        
        <UserBookings userEmail={userEmail} />
        
        <ThemedView style={styles.backButtonContainer}>
          <ThemedText
            style={styles.backButton}
            onPress={handleBack}
          >
            ← Back to Search
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          View Your Bookings
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Enter your email to view your booking history
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.content}>
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.inputLabel}>Email Address:</ThemedText>
          <TextInput
            style={styles.textInput}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="Enter your email address"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ThemedView>
        
        <ThemedText
          style={styles.viewButton}
          onPress={handleViewBookings}
        >
          View My Bookings
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
