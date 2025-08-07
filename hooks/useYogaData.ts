import { useState, useEffect } from 'react';
import { yogaService } from '@/services/yogaService';
import { YogaClass, YogaCourse, Instructor } from '@/types/yoga';

export const useYogaData = () => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [courses, setCourses] = useState<YogaCourse[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState({
    classes: false,
    courses: false,
    instructors: false,
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

  // Fetch classes by level
  const fetchClassesByLevel = async (level: YogaClass['level']) => {
    setLoading(prev => ({ ...prev, classes: true }));
    setError(null);
    
    try {
      const data = await yogaService.getClassesByLevel(level);
      setClasses(data);
    } catch (err) {
      setError('Failed to fetch classes by level');
      console.error('Error fetching classes by level:', err);
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  // Fetch classes by category
  const fetchClassesByCategory = async (category: YogaClass['category']) => {
    setLoading(prev => ({ ...prev, classes: true }));
    setError(null);
    
    try {
      const data = await yogaService.getClassesByCategory(category);
      setClasses(data);
    } catch (err) {
      setError('Failed to fetch classes by category');
      console.error('Error fetching classes by category:', err);
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

  // Fetch courses by level
  const fetchCoursesByLevel = async (level: YogaCourse['level']) => {
    setLoading(prev => ({ ...prev, courses: true }));
    setError(null);
    
    try {
      const data = await yogaService.getCoursesByLevel(level);
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses by level');
      console.error('Error fetching courses by level:', err);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  // Fetch all instructors
  const fetchInstructors = async () => {
    setLoading(prev => ({ ...prev, instructors: true }));
    setError(null);
    
    try {
      const data = await yogaService.getAllInstructors();
      setInstructors(data);
    } catch (err) {
      setError('Failed to fetch instructors');
      console.error('Error fetching instructors:', err);
    } finally {
      setLoading(prev => ({ ...prev, instructors: false }));
    }
  };

  // Get classes grouped by level
  const getClassesByLevel = () => {
    const grouped = {
      beginner: classes.filter(c => c.level === 'beginner'),
      intermediate: classes.filter(c => c.level === 'intermediate'),
      advanced: classes.filter(c => c.level === 'advanced'),
    };
    return grouped;
  };

  // Get classes grouped by category
  const getClassesByCategory = () => {
    const grouped = {
      hatha: classes.filter(c => c.category === 'hatha'),
      vinyasa: classes.filter(c => c.category === 'vinyasa'),
      ashtanga: classes.filter(c => c.category === 'ashtanga'),
      power: classes.filter(c => c.category === 'power'),
      gentle: classes.filter(c => c.category === 'gentle'),
      meditation: classes.filter(c => c.category === 'meditation'),
      prenatal: classes.filter(c => c.category === 'prenatal'),
      therapeutic: classes.filter(c => c.category === 'therapeutic'),
    };
    return grouped;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    // Data
    classes,
    courses,
    instructors,
    
    // Loading states
    loading,
    
    // Error state
    error,
    clearError,
    
    // Fetch functions
    fetchClasses,
    fetchClassesByLevel,
    fetchClassesByCategory,
    fetchCourses,
    fetchCoursesByLevel,
    fetchInstructors,
    
    // Utility functions
    getClassesByLevel,
    getClassesByCategory,
  };
};
