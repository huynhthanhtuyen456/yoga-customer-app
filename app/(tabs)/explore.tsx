import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { YogaClassCard } from '@/components/YogaClassCard';
import { YogaCourseCard } from '@/components/YogaCourseCard';
import { useYogaData } from '@/hooks/useYogaData';
import { bookingService } from '@/services/bookingService';
import { YogaClass } from '@/types/yoga';

export default function TabTwoScreen() {
  const {
    classes,
    courses,
    loading,
    error,
    fetchClasses,
    fetchCourses,
    getClassesByLevel,
    getClassesByCategory,
  } = useYogaData();

  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  useEffect(() => {
    // Load initial data
    fetchClasses();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleAddToCart = async (yogaClass: YogaClass) => {
    try {
      await bookingService.addToCart(yogaClass);
      Alert.alert('Success', 'Class added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add class to cart');
      console.error(error);
    }
  };

  if (loading.classes && loading.courses) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading yoga classes and courses...</ThemedText>
      </ThemedView>
    );
  }

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
        <ThemedText type="title">Yoga Classes</ThemedText>
      </ThemedView>
      
      <ThemedText>Discover our comprehensive collection of yoga classes and wellness programs.</ThemedText>
      
      <Collapsible title="Yoga Classes">
        {loading.classes ? (
          <ActivityIndicator size="small" />
        ) : classes.length > 0 ? (
          classes.map((yogaClass) => (
            <YogaClassCard
              key={yogaClass.id}
              yogaClass={yogaClass}
              onPress={() => handleAddToCart(yogaClass)}
            />
          ))
        ) : (
          <ThemedText>No yoga classes available at the moment.</ThemedText>
        )}
      </Collapsible>
      
      <Collapsible title="Yoga Courses">
        {loading.courses ? (
          <ActivityIndicator size="small" />
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <YogaCourseCard
              key={course.id}
              course={course}
            />
          ))
        ) : (
          <ThemedText>No courses available at the moment.</ThemedText>
        )}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  reactLogo: {
    height: 160,
    width: 200,
    bottom: -50,
    left: 100,
    position: 'relative',
  },
});
