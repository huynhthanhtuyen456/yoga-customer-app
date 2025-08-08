export interface YogaCourse {
  id: string;
  // name: string;
  capacity: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  description: string;
  durationMinutes: number;
  price: number;
  time: "08:00 AM" | "09:00 AM" | "10:00 AM" | "11:00 AM" | "12:00 PM" | "1:00 PM" | "2:00 PM" | "3:00 PM" | "4:00 PM" | "5:00 PM" | "6:00 PM" | "7:00 PM" | "8:00 PM" | "9:00 PM" | "10:00 PM";
  type: "AERIAL" | "FLOW" | "FAMILY"
  totalClasses: number;
}

export interface YogaClass {
  id: string;
  comments: string;
  courseId: string;
  date: string;
  teacherName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

// Shopping Cart Types
export interface CartItem {
  id: string;
  yogaClass: YogaClass;
  addedAt: Date;
}

export interface ShoppingCart {
  items: CartItem[];
  totalItems: number;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  classes: YogaClass[];
  totalClasses: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBooking {
  id: string;
  bookingId: string;
  yogaClassId: string;
  yogaClass: YogaClass;
  userEmail: string;
  status: 'booked' | 'attended' | 'cancelled';
  bookedAt: Date;
  attendedAt?: Date;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  // phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
