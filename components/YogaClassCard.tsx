import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { YogaClass } from '@/types/yoga';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface YogaClassCardProps {
  yogaClass: YogaClass;
  onPress?: () => void;
}

export const YogaClassCard: React.FC<YogaClassCardProps> = ({ yogaClass, onPress }) => {
  // const availableSpots = yogaClass.maxCapacity - yogaClass.currentEnrollment;
  // const isFull = availableSpots === 0;

  // const getLevelColor = (level: string) => {
  //   switch (level) {
  //     case 'beginner':
  //       return '#4CAF50';
  //     case 'intermediate':
  //       return '#FF9800';
  //     case 'advanced':
  //       return '#F44336';
  //     default:
  //       return '#757575';
  //   }
  // };

  // const getCategoryIcon = (category: string) => {
  //   switch (category) {
  //     case 'hatha':
  //       return '🧘‍♀️';
  //     case 'vinyasa':
  //       return '🌊';
  //     case 'ashtanga':
  //       return '🔥';
  //     case 'power':
  //       return '💪';
  //     case 'gentle':
  //       return '🌸';
  //     case 'meditation':
  //       return '🧘';
  //     case 'prenatal':
  //       return '🤱';
  //     case 'therapeutic':
  //       return '💆‍♀️';
  //     default:
  //       return '🧘‍♀️';
  //   }
  // };

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={[styles.card]}>

        <ThemedText style={styles.description} numberOfLines={2}>
          {yogaClass.comments}
        </ThemedText>

        <ThemedView style={styles.details}>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Yoga Teacher:</ThemedText>
            <ThemedText style={styles.detailValue}>{yogaClass.teacherName}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Day Of Week:</ThemedText>
            <ThemedText style={styles.detailValue}>{yogaClass.dayOfWeek} min</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Date:</ThemedText>
            <ThemedText style={styles.detailValue}>{yogaClass.date}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
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
  fullCard: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
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
  fullText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  schedule: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  scheduleItem: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  moreSessions: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
});
