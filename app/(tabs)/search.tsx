import { ClassSearchUI } from '@/components/ClassSearchUI';
import { ShoppingCart } from '@/components/ShoppingCart';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { YogaClass } from '@/types/yoga';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function SearchScreen() {
  const [isCartVisible, setIsCartVisible] = useState(false);

  const handleClassPress = (yogaClass: YogaClass) => {
    // Handle class selection - can navigate to detail screen
    console.log('Selected class:', yogaClass);
    // You can add navigation logic here
    // router.push(`/class/${yogaClass.id}`);
  };

  const handleBookingComplete = () => {
    // Refresh search results or show success message
    console.log('Booking completed successfully');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Search Classes
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Find yoga classes by teacher, day, or date
        </ThemedText>
        
        {/* Cart Button */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setIsCartVisible(true)}
        >
          <ThemedText style={styles.cartButtonText}>
            🛒 View Cart
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ClassSearchUI onClassPress={handleClassPress} />
      
      {/* Shopping Cart Modal */}
      <ShoppingCart
        isVisible={isCartVisible}
        onClose={() => setIsCartVisible(false)}
        onBookingComplete={handleBookingComplete}
      />
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
  cartButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
