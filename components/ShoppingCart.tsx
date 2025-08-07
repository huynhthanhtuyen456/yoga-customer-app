import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { YogaClassCard } from '@/components/YogaClassCard';
import { bookingService } from '@/services/bookingService';
import { CartItem } from '@/types/yoga';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

interface ShoppingCartProps {
  isVisible: boolean;
  onClose: () => void;
  onBookingComplete?: () => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isVisible,
  onClose,
  onBookingComplete,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  // Load cart items when modal opens
  useEffect(() => {
    if (isVisible) {
      loadCartItems();
    }
  }, [isVisible]);

  const loadCartItems = async () => {
    setIsLoading(true);
    try {
      const items = await bookingService.getCartItems();
      setCartItems(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load cart items');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await bookingService.removeFromCart(cartItemId);
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      Alert.alert('Success', 'Item removed from cart');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item from cart');
      console.error(error);
    }
  };

  const clearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingService.clearCart();
              setCartItems([]);
              Alert.alert('Success', 'Cart cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cart');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleCheckout = async () => {
    if (!userEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create or get user
      let user = await bookingService.getUserByEmail(userEmail);
      if (!user) {
        const userId = await bookingService.createUser(userEmail, userName);
        user = { id: userId, email: userEmail, name: userName };
      }

      // Create booking
      const classes = cartItems.map(item => item.yogaClass);
      const booking = await bookingService.createBooking(userEmail, classes);

      // Clear cart
      await bookingService.clearCart();
      setCartItems([]);
      setUserEmail('');
      setUserName('');

      Alert.alert(
        'Booking Successful!',
        `Your booking has been confirmed. Booking ID: ${booking.id}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              onBookingComplete?.();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete booking. Please try again.');
      console.error(error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalItems = cartItems.length;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Shopping Cart
          </ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Cart Items */}
        <ScrollView style={styles.content}>
          {isLoading ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Loading cart...</ThemedText>
            </ThemedView>
          ) : cartItems.length === 0 ? (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Add some yoga classes to get started
              </ThemedText>
            </ThemedView>
          ) : (
            <>
              {/* Cart Items List */}
              <ThemedView style={styles.itemsContainer}>
                <ThemedText style={styles.sectionTitle}>
                  Cart Items ({totalItems})
                </ThemedText>
                {cartItems.map((cartItem) => (
                  <ThemedView key={cartItem.id} style={styles.cartItem}>
                    <YogaClassCard
                      yogaClass={cartItem.yogaClass}
                      onPress={() => {}}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFromCart(cartItem.id)}
                    >
                      <ThemedText style={styles.removeButtonText}>
                        Remove
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                ))}
              </ThemedView>

              {/* User Information */}
              <ThemedView style={styles.userInfoSection}>
                <ThemedText style={styles.sectionTitle}>
                  Contact Information
                </ThemedText>
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Email *</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </ThemedView>
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Name (Optional)</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Enter your name"
                    placeholderTextColor="#666"
                  />
                </ThemedView>
              </ThemedView>

              {/* Action Buttons */}
              <ThemedView style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearCart}
                >
                  <ThemedText style={styles.clearButtonText}>
                    Clear Cart
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ThemedText style={styles.checkoutButtonText}>
                      Book Classes ({totalItems})
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </ThemedView>
            </>
          )}
        </ScrollView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  itemsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  cartItem: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userInfoSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
