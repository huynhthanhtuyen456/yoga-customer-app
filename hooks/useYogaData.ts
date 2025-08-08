import { yogaService } from '@/services/yogaService';
import { YogaClass, YogaCourse } from '@/types/yoga';
import { useState } from 'react';

export const useYogaData = () => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [courses, setCourses] = useState<YogaCourse[]>([]);
  const [loading, setLoading] = useState({
    classes: false,
    courses: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch all classes
  const fetchClasses = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    setError(null);
    
    try {
      const data = await yogaService.getAllClasses();
      setClasses(data);
    } catch (err) {
      setError('Failed to fetch classes');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    setError(null);
    
    try {
      const data = await yogaService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    // Data
    classes,
    courses,
    
    // Loading states
    loading,
    
    // Error state
    error,
    clearError,
    
    // Fetch functions
    fetchClasses,
    fetchCourses,
  };
};
