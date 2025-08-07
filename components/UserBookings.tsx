import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { YogaClassCard } from '@/components/YogaClassCard';
import { bookingService } from '@/services/bookingService';
import { UserBooking } from '@/types/yoga';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

interface UserBookingsProps {
  userEmail: string;
}

export const UserBookings: React.FC<UserBookingsProps> = ({ userEmail }) => {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (userEmail) {
      loadUserBookings();
    }
  }, [userEmail]);

  const loadUserBookings = async () => {
    setIsLoading(true);
    try {
      const userBookings = await bookingService.getUserBookings(userEmail);
      setBookings(userBookings);
    } catch (error) {
      Alert.alert('Error', 'Failed to load your bookings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBookings = async () => {
    setIsRefreshing(true);
    try {
      await loadUserBookings();
    } finally {
      setIsRefreshing(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingService.cancelBooking(bookingId);
              Alert.alert('Success', 'Booking cancelled successfully');
              loadUserBookings(); // Refresh the list
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: UserBooking['status']) => {
    switch (status) {
      case 'booked':
        return '#34C759';
      case 'attended':
        return '#007AFF';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: UserBooking['status']) => {
    switch (status) {
      case 'booked':
        return 'Booked';
      case 'attended':
        return 'Attended';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading your bookings...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={refreshBookings}>
        <ThemedText style={styles.refreshButtonText}>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </ThemedText>
      </TouchableOpacity>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No bookings found</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            You haven't booked any classes yet. Start by searching for classes!
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.bookingsContainer}>
          <ThemedText style={styles.sectionTitle}>
            Your Bookings ({bookings.length})
          </ThemedText>
          
          {bookings.map((booking) => (
            <ThemedView key={booking.id} style={styles.bookingCard}>
              <ThemedView style={styles.bookingHeader}>
                <ThemedText style={styles.bookingId}>
                  Booking ID: {booking.bookingId}
                </ThemedText>
                <ThemedView
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) },
                  ]}
                >
                  <ThemedText style={styles.statusText}>
                    {getStatusText(booking.status)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <YogaClassCard
                yogaClass={booking.yogaClass}
                onPress={() => {}}
              />

              <ThemedView style={styles.bookingDetails}>
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Booked on:</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {formatDate(booking.bookedAt)}
                  </ThemedText>
                </ThemedView>

                {booking.attendedAt && (
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Attended on:</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {formatDate(booking.attendedAt)}
                    </ThemedText>
                  </ThemedView>
                )}
              </ThemedView>

              {booking.status === 'booked' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelBooking(booking.bookingId)}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    Cancel Booking
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
};

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
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 16,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingHorizontal: 20,
  },
  bookingsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
