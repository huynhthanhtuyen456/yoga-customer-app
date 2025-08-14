import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { YogaCourse } from '@/types/yoga';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface YogaCourseCardProps {
  course: YogaCourse;
  onPress?: () => void;
}

export const YogaCourseCard: React.FC<YogaCourseCardProps> = ({ course, onPress }) => {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={styles.dateRow}>
        <ThemedText style={styles.dateValue}>{course.dayOfWeek}</ThemedText>
      </ThemedView>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.titleContainer}>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.details}>
          
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Duration in Minutes:</ThemedText>
            <ThemedText style={styles.detailValue}>{course.durationMinutes} Minutes</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Price:</ThemedText>
            <ThemedText style={styles.detailValue}>${course.price}</ThemedText>
          </ThemedView>

          <ThemedText style={styles.detailLabel}>Description:</ThemedText>
        </ThemedView>

        <ThemedText style={styles.description} numberOfLines={3}>
          {course.description}
        </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  upcomingCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  dates: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    gap: 6,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  upcomingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
