import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// Mock data type list
const DATA_TYPES: DataType[] = [
  {
    id: 'heartRate',
    label: '심박수',
    icon: 'heart',
    inputMode: 'manual',
    schema: { type: 'number', unit: 'bpm' },
  },
  {
    id: 'bloodPressure',
    label: '혈압',
    icon: 'water',
    inputMode: 'manual',
    schema: { systolic: 'number', diastolic: 'number', unit: 'mmHg' },
  },
  {
    id: 'bodyTemperature',
    label: '체온',
    icon: 'thermometer',
    inputMode: 'active',
    sensorId: 'tempSensor01',
  },
  {
    id: 'steps',
    label: '걸음수',
    icon: 'walk',
    inputMode: 'manual',
    schema: { type: 'number', unit: 'steps' },
  },
  {
    id: 'sleep',
    label: '수면',
    icon: 'bed',
    inputMode: 'manual',
    schema: { duration: 'number', quality: 'string' },
  },
  {
    id: 'spo2',
    label: '산소포화도',
    icon: 'pulse',
    inputMode: 'active',
    sensorId: 'spo2Sensor01',
  },
];

const INPUT_MODE_LABEL = {
  manual: '수동입력',
  active: '측정',
};

type DataType = {
  id: string;
  label: string;
  icon: string;
  inputMode: 'manual' | 'active';
  schema?: any;
  sensorId?: string;
};

interface DataTypeCardProps {
  item: DataType;
  onPress: () => void;
}

const DataTypeCard: React.FC<DataTypeCardProps> = ({ item, onPress }) => (
  <TouchableOpacity 
    className="flex-row items-center bg-white rounded-2xl p-4 shadow-sm"
    onPress={onPress}
  >
    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
      <Ionicons name={item.icon as any} size={28} color="#3b82f6" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-semibold text-slate-800 mb-1">{item.label}</Text>
      <View className={`self-start rounded-lg px-2 py-0.5 mt-0.5 ${
        item.inputMode === 'manual' ? 'bg-yellow-100' : 'bg-blue-100'
      }`}>
        <Text className="text-xs text-blue-600 font-medium">{INPUT_MODE_LABEL[item.inputMode]}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

interface CaptureHomeScreenProps {
  navigation: any; // Replace 'any' with proper StackNavigationProp if available
}

export const CaptureHomeScreen: React.FC<CaptureHomeScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    DATA_TYPES.filter((dt: DataType) =>
      dt.label.toLowerCase().includes(search.toLowerCase()) ||
      dt.id.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      <TextInput
        className="px-4 py-2.5 mb-3 bg-slate-50 rounded-2xl text-base text-gray-900"
        placeholder="지표 검색"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#9ca3af"
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DataTypeCard
            item={item}
            onPress={() => {
              if (item.inputMode === 'manual') {
                navigation.navigate('ManualEntryForm', { schema: item.schema, label: item.label });
              } else if (item.inputMode === 'active') {
                navigation.navigate('ActiveMeasure', { sensorId: item.sensorId, label: item.label });
              }
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </View>
  );
}; 