import { db } from '@/config/firebase';
import { Instructor, YogaClass, YogaCourse } from '@/types/yoga';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where
} from 'firebase/firestore';

export class YogaService {
  // Collection references
  private classesCollection = collection(db, 'yogaClasses');
  private coursesCollection = collection(db, 'yogaCourses');
  private instructorsCollection = collection(db, 'instructors');

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
    if (data.startDate) {
      data.startDate = this.convertTimestamp(data.startDate);
    }
    if (data.endDate) {
      data.endDate = this.convertTimestamp(data.endDate);
    }
    return data;
  }

  // Get all yoga classes
  async getAllClasses(): Promise<YogaClass[]> {
    try {
      const querySnapshot = await getDocs(this.classesCollection);
      const classes: YogaClass[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        classes.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as YogaClass);
      });
      
      return classes;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  // Get a specific class by ID
  async getClassById(id: string): Promise<YogaClass | null> {
    try {
      const docRef = doc(this.classesCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...this.convertTimestamps(data)
        } as YogaClass;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  }

  // Get all courses
  async getAllCourses(): Promise<YogaCourse[]> {
    try {
      const q = query(
        this.coursesCollection,
        // where('isActive', '==', true),
        // orderBy('startDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const courses: YogaCourse[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        courses.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as YogaCourse);
      });
      
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Get a specific course by ID
  async getCourseById(id: string): Promise<YogaCourse | null> {
    try {
      const docRef = doc(this.coursesCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...this.convertTimestamps(data)
        } as YogaCourse;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  }

  // Search classes by teacher name
  async searchClassesByTeacher(teacherName: string): Promise<YogaClass[]> {
    try {
      const q = query(
        this.classesCollection,
        where('teacherName', '==', teacherName),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const classes: YogaClass[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        classes.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as YogaClass);
      });

      return classes;
    } catch (error) {
      console.error('Error searching classes by teacher:', error);
      throw error;
    }
  }

  // Search classes by day of week
  async searchClassesByDayOfWeek(dayOfWeek: YogaClass['dayOfWeek']): Promise<YogaClass[]> {
    try {
      const q = query(
        this.classesCollection,
        where('dayOfWeek', '==', dayOfWeek),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const classes: YogaClass[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        classes.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as YogaClass);
      });

      return classes;
    } catch (error) {
      console.error('Error searching classes by day of week:', error);
      throw error;
    }
  }

  // Search classes by date range
  async searchClassesByDateRange(startDate: string, endDate?: string): Promise<YogaClass[]> {
    try {
      let q;
      
      if (endDate) {
        // Search within date range
        q = query(
          this.classesCollection,
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          orderBy('date', 'asc')
        );
      } else {
        // Search for specific date
        q = query(
          this.classesCollection,
          where('date', '==', startDate),
          orderBy('date', 'asc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const classes: YogaClass[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        classes.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as YogaClass);
      });

      return classes;
    } catch (error) {
      console.error('Error searching classes by date range:', error);
      throw error;
    }
  }

  // Advanced search with multiple criteria
  async searchClassesAdvanced(filters: {
    teacherName?: string;
    dayOfWeek?: YogaClass['dayOfWeek'];
    startDate?: string;
    endDate?: string;
  }): Promise<YogaClass[]> {
    try {
      const constraints: any[] = [];
      
      // Add filters based on provided criteria
      if (filters.teacherName) {
        constraints.push(where('teacherName', '==', filters.teacherName));
      }
      
      if (filters.dayOfWeek) {
        constraints.push(where('dayOfWeek', '==', filters.dayOfWeek));
      }
      
      if (filters.startDate) {
        constraints.push(where('date', '>=', filters.startDate));
      }
      
      if (filters.endDate) {
        constraints.push(where('date', '<=', filters.endDate));
      }
      
      // Add ordering
      constraints.push(orderBy('date', 'desc'));
      
      const q = query(this.classesCollection, ...constraints);
      const querySnapshot = await getDocs(q);
      const classes: YogaClass[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        classes.push({
          id: doc.id,
          ...this.convertTimestamps(data)
        } as YogaClass);
      });

      return classes;
    } catch (error) {
      console.error('Error in advanced class search:', error);
      throw error;
    }
  }

  // Updated searchClasses method for general search
  async searchClasses(query: string): Promise<YogaClass[]> {
    try {
      // First try to search by teacher name
      const teacherResults = await this.searchClassesByTeacher(query);
      if (teacherResults.length > 0) {
        return teacherResults;
      }
      
      // Then try to search by day of week
      const dayResults = await this.searchClassesByDayOfWeek(query as YogaClass['dayOfWeek']);
      if (dayResults.length > 0) {
        return dayResults;
      }
      
      // Finally try to search by date
      const dateResults = await this.searchClassesByDateRange(query);
      return dateResults;
    } catch (error) {
      console.error('Error searching classes:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const yogaService = new YogaService();
