import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { YogaClassCard } from '@/components/YogaClassCard';
import { bookingService } from '@/services/bookingService';
import { yogaService } from '@/services/yogaService';
import { YogaClass } from '@/types/yoga';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface ClassSearchUIProps {
  onClassPress?: (yogaClass: YogaClass) => void;
}

export const ClassSearchUI: React.FC<ClassSearchUIProps> = ({ onClassPress }) => {
  // Search states
  const [teacherName, setTeacherName] = useState('');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<YogaClass['dayOfWeek'] | ''>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Results and loading states
  const [searchResults, setSearchResults] = useState<YogaClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString();
  };

  // Format date for API
  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Handle date picker changes
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const searchAdvanced = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      
      if (teacherName.trim()) {
        filters.teacherName = teacherName.trim();
      }
      
      if (selectedDayOfWeek) {
        filters.dayOfWeek = selectedDayOfWeek;
      }
      
      if (startDate) {
        filters.startDate = formatDateForAPI(startDate);
      }
      
      if (endDate) {
        filters.endDate = formatDateForAPI(endDate);
      }
      
      const results = await yogaService.searchClassesAdvanced(filters);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to perform advanced search');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setTeacherName('');
    setSelectedDayOfWeek('');
    setStartDate(null);
    setEndDate(null);
    setSearchResults([]);
  };

  const handleAddToCart = async (yogaClass: YogaClass) => {
    try {
      await bookingService.addToCart(yogaClass);
      Alert.alert('Success', 'Class added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add class to cart');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.searchContainer}>

        <ThemedView style={styles.textInput}>
            <TextInput
            style={styles.input}
            value={teacherName}
            onChangeText={setTeacherName}
            placeholder="Search classes..."
            placeholderTextColor="#666"
            />
        </ThemedView>

        {/* Date Range Search */}
        <ThemedView style={styles.searchSection}>
          <ThemedText style={styles.sectionTitle}>Filter by Date Range</ThemedText>
          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Start Date:</ThemedText>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <ThemedText style={styles.dateButtonText}>
                {formatDate(startDate)}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>End Date (Optional):</ThemedText>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <ThemedText style={styles.dateButtonText}>
                {formatDate(endDate)}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.searchButton} onPress={searchAdvanced}>
          <ThemedText style={styles.buttonText}>Search</ThemedText>
        </TouchableOpacity>

        {/* Clear Search Button */}
        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
          <ThemedText style={styles.clearButtonText}>Clear Search</ThemedText>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoading && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>Searching...</ThemedText>
          </ThemedView>
        )}

        {/* Results */}
        {searchResults.length > 0 && (
          <ThemedView style={styles.resultsContainer}>
            <ThemedText type="title" style={styles.resultsTitle}>
              Search Results ({searchResults.length})
            </ThemedText>
            {searchResults.map((yogaClass) => (
              <ThemedView key={yogaClass.id} style={styles.resultCard}>
                <YogaClassCard
                  yogaClass={yogaClass}
                  onPress={() => onClassPress?.(yogaClass)}
                />
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(yogaClass)}
                >
                  <ThemedText style={styles.addToCartButtonText}>
                    Add to Cart
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* No Results */}
        {!isLoading && searchResults.length === 0 && teacherName && (
          <ThemedView style={styles.noResultsContainer}>
            <ThemedText style={styles.noResultsText}>
              No classes found matching your search criteria
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeToggleButton: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  advancedSearchButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  resultCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
