import { Image } from 'expo-image';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { YogaClassCard } from '@/components/YogaClassCard';
import { YogaCourseCard } from '@/components/YogaCourseCard';
import { useYogaData } from '@/hooks/useYogaData';

export default function HomeScreen() {
  const {
    classes,
    courses,
    loading,
    fetchClasses,
    fetchCourses,
  } = useYogaData();

  useEffect(() => {
    // Load initial data
    fetchClasses();
    fetchCourses();
  }, []);

  const featuredClasses = classes.slice(0, 3); // Show first 3 classes
  const featuredCourses = courses.slice(0, 2); // Show first 2 courses

  const handleClassPress = (yogaClass: any) => {
    console.log('Selected class:', yogaClass.name);
  };

  const handleCoursePress = (course: any) => {
    console.log('Selected course:', course.name);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/lotus.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to YogaFlow!</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Discover Your Yoga Journey</ThemedText>
        <ThemedText>
          Explore our curated collection of yoga classes, meditation sessions, and wellness programs designed to help you find balance and inner peace.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Featured Classes</ThemedText>
        {loading.classes ? (
          <ActivityIndicator size="small" />
        ) : featuredClasses.length > 0 ? (
          featuredClasses.map((yogaClass) => (
            <YogaClassCard
              key={yogaClass.id}
              yogaClass={yogaClass}
              onPress={() => handleClassPress(yogaClass)}
            />
          ))
        ) : (
          <ThemedText>No classes available at the moment.</ThemedText>
        )}
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Featured Courses</ThemedText>
        {loading.courses ? (
          <ActivityIndicator size="small" />
        ) : featuredCourses.length > 0 ? (
          featuredCourses.map((course) => (
            <YogaCourseCard
              key={course.id}
              course={course}
              onPress={() => handleCoursePress(course)}
            />
          ))
        ) : (
          <ThemedText>No courses available at the moment.</ThemedText>
        )}
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Quick Stats</ThemedText>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="defaultSemiBold">{classes.length}</ThemedText>
            <ThemedText>Available Classes</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="defaultSemiBold">{courses.length}</ThemedText>
            <ThemedText>Active Courses</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 160,
    width: 200,
    bottom: -50,
    left: 100,
    position: 'relative',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    minWidth: 80,
  },
});
