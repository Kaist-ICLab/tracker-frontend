import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  VirtualizedList,
} from 'react-native';
import { useDataSamples } from '../../hooks/useDataSamples';
import { DataSample, MetricInfo } from '../../types/dataSample';
import { Ionicons } from '@expo/vector-icons';

interface DataDetailScreenProps {
  route: {
    params: {
      id: string;
      title: string;
    };
  };
  navigation: any;
}

const METRIC_INFO: MetricInfo[] = [
  { key: 'timestamp', label: 'Time', formatter: (value: Date) => value.toLocaleTimeString(), category: 'vital' },
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', category: 'vital' },
  { key: 'bloodPressureSystolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg', category: 'vital' },
  { key: 'bloodPressureDiastolic', label: 'Blood Pressure (Diastolic)', unit: 'mmHg', category: 'vital' },
  { key: 'bodyTemperature', label: 'Temperature', unit: '°C', formatter: (value: number) => value.toFixed(1), category: 'vital' },
  { key: 'oxygenSaturation', label: 'SpO2', unit: '%', category: 'vital' },
  { key: 'respiratoryRate', label: 'Respiratory Rate', unit: '/min', category: 'vital' },
  { key: 'steps', label: 'Steps', category: 'activity' },
  { key: 'distance', label: 'Distance', unit: 'km', formatter: (value: number) => value.toFixed(2), category: 'activity' },
  { key: 'calories', label: 'Calories', unit: 'kcal', category: 'activity' },
  { key: 'activeMinutes', label: 'Active Time', unit: 'min', category: 'activity' },
  { key: 'weight', label: 'Weight', unit: 'kg', formatter: (value: number) => value.toFixed(1), category: 'body' },
  { key: 'bodyFatPercentage', label: 'Body Fat', unit: '%', formatter: (value: number) => value.toFixed(1), category: 'body' },
  { key: 'muscleMass', label: 'Muscle Mass', unit: 'kg', formatter: (value: number) => value.toFixed(1), category: 'body' },
  { key: 'bmi', label: 'BMI', formatter: (value: number) => value.toFixed(1), category: 'body' },
  { key: 'bloodGlucose', label: 'Blood Glucose', unit: 'mg/dL', category: 'blood' },
  { key: 'stressLevel', label: 'Stress Level', unit: '/100', category: 'stress' },
  { key: 'hrvScore', label: 'HRV Score', unit: 'ms', category: 'stress' },
  { key: 'recoveryScore', label: 'Recovery', unit: '/100', category: 'stress' },
];

const DataSampleRow = ({ item }: { item: DataSample }) => (
  <View className="bg-white p-4 border-b border-gray-200">
    <Text className="text-base font-semibold text-blue-500 mb-3">
      {item.timestamp.toLocaleTimeString()}
    </Text>
    <View className="rounded-lg bg-gray-50 p-3">
      {METRIC_INFO.map((metric) => {
        if (metric.key === 'timestamp') return null;
        const value = item[metric.key];
        if (value === undefined) return null;

        const displayValue = metric.formatter 
          ? metric.formatter(value)
          : value.toString();

        return (
          <View key={metric.key} className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">{metric.label}</Text>
            <Text className="text-sm font-medium text-gray-900 ml-4">
              {displayValue}
              {metric.unit ? ` ${metric.unit}` : ''}
            </Text>
          </View>
        );
      })}
    </View>
    {item.notes && (
      <Text className="mt-3 text-sm text-gray-500 italic">{item.notes}</Text>
    )}
  </View>
);

export const DataDetailScreen = ({ route, navigation }: DataDetailScreenProps) => {
  const { id, title } = route.params;
  const { samples, isLoading, hasNextPage, error, fetchNextPage, refresh } = useDataSamples(id);

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="#3b82f6"
          className="ml-4"
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, title]);

  const getItem = (_: any, index: number) => samples[index];
  const getItemCount = () => samples.length;

  if (error && samples.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-base">{error}</Text>
      </View>
    );
  }

  if (samples.length === 0 && isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <VirtualizedList
      data={samples}
      renderItem={({ item }) => <DataSampleRow item={item} />}
      keyExtractor={item => item.id}
      getItem={getItem}
      getItemCount={getItemCount}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} />
      }
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center bg-gray-100">
          <Text className="text-gray-500 text-base">No data available</Text>
        </View>
      }
      ListFooterComponent={
        hasNextPage ? (
          <ActivityIndicator className="p-4" color="#3b82f6" />
        ) : null
      }
    />
  );
}; 