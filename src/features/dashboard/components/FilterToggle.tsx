import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type FilterPeriod = 'monthly' | 'weekly';

interface FilterToggleProps {
  selectedPeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
}

export function FilterToggle({ selectedPeriod, onPeriodChange }: FilterToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        {(['monthly', 'weekly'] as FilterPeriod[]).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.toggleButton,
              selectedPeriod === period && styles.toggleButtonActive
            ]}
            onPress={() => onPeriodChange(period)}
          >
            <Text
              style={[
                styles.toggleText,
                selectedPeriod === period 
                  ? styles.toggleTextActive 
                  : styles.toggleTextInactive
              ]}
            >
              {period === 'monthly' ? 'Monthly' : 'Weekly'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  } as ViewStyle,
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // gray-100
    borderRadius: 8,
    padding: 4,
  } as ViewStyle,
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
  } as ViewStyle,
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  } as TextStyle,
  toggleTextActive: {
    color: '#4F46E5', // indigo-600
  } as TextStyle,
  toggleTextInactive: {
    color: '#6B7280', // gray-500
  } as TextStyle,
});
