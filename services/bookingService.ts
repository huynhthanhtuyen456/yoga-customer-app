import { db } from '@/config/firebase';
import {
  Booking,
  CartItem,
  UserBooking,
  YogaClass
} from '@/types/yoga';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';

export class BookingService {
  // Collection references
  private bookingsCollection = collection(db, 'bookings');
  private userBookingsCollection = collection(db, 'userBookings');
  private usersCollection = collection(db, 'users');

  // Convert Firestore timestamp to Date
  private convertTimestamp(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }

  // Convert data with timestamps
  private convertTimestamps<T>(data: any): T {
    if (data.createdAt) {
      data.createdAt = this.convertTimestamp(data.createdAt);
    }
    if (data.updatedAt) {
      data.updatedAt = this.convertTimestamp(data.updatedAt);
    }
    if (data.addedAt) {
      data.addedAt = this.convertTimestamp(data.addedAt);
    }
    if (data.bookedAt) {
      data.bookedAt = this.convertTimestamp(data.bookedAt);
    }
    if (data.attendedAt) {
      data.attendedAt = this.convertTimestamp(data.attendedAt);
    }
    return data;
  }

  // Shopping Cart Methods
  async addToCart(yogaClass: YogaClass): Promise<CartItem> {
    try {
      const cartItem: Omit<CartItem, 'id'> = {
        yogaClass,
        addedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'cart'), cartItem);
      return {
        id: docRef.id,
        ...this.convertTimestamps(cartItem)
      } as CartItem;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'cart', cartItemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async getCartItems(): Promise<CartItem[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'cart'));
      const cartItems: CartItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cartItems.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as CartItem);
      });
      
      return cartItems;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, 'cart'));
      const batch = writeBatch(db);
      
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Booking Methods
  async createBooking(userEmail: string, classes: YogaClass[]): Promise<Booking> {
    try {
      const booking: Omit<Booking, 'id'> = {
        userId: `user_${Date.now()}`, // Generate user ID
        userEmail,
        classes,
        totalClasses: classes.length,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.bookingsCollection, booking);
      const bookingId = docRef.id;

      // Create user bookings for each class
      const userBookings = classes.map((yogaClass) => ({
        bookingId,
        yogaClassId: yogaClass.id,
        yogaClass,
        userEmail,
        status: 'booked' as const,
        bookedAt: new Date(),
      }));

      // Add user bookings to database
      const batch = writeBatch(db);
      userBookings.forEach((userBooking) => {
        const userBookingRef = doc(this.userBookingsCollection);
        batch.set(userBookingRef, userBooking);
      });

      await batch.commit();

      return {
        id: bookingId,
        ...this.convertTimestamps(booking)
      } as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getUserBookings(userEmail: string): Promise<UserBooking[]> {
    try {
      const q = query(
        this.userBookingsCollection,
        where('userEmail', '==', userEmail),
        orderBy('bookedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const userBookings: UserBooking[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userBookings.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as UserBooking);
      });
      
      return userBookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const docRef = doc(this.bookingsCollection, bookingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...this.convertTimestamps(data)
        } as Booking;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    try {
      const bookingRef = doc(this.bookingsCollection, bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId: string): Promise<void> {
    try {
      // Update booking status
      await this.updateBookingStatus(bookingId, 'cancelled');
      
      // Update user bookings status
      const q = query(
        this.userBookingsCollection,
        where('bookingId', '==', bookingId)
      );
      
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { status: 'cancelled' });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // User Methods
  async createUser(email: string, name?: string, phone?: string): Promise<string> {
    try {
      const user = {
        email,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.usersCollection, user);
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<any | null> {
    try {
      const q = query(this.usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...this.convertTimestamps(data)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const bookingService = new BookingService();
