import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const getTimeAgo = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }
  return `${Math.floor(hours / 24)} days ago`;
};

export const DataCard: React.FC<{
  id: string;
  title: string;
  recordCount: number;
  updatedAt: Date;
  iconName?: string;
  onPress: () => void;
}> = ({ id, title, recordCount, updatedAt, iconName, onPress }) => (
  <TouchableOpacity 
    className="bg-white rounded-xl p-4 mx-4 my-2 shadow-sm"
    onPress={onPress}
  >
    {iconName && (
      <Ionicons 
        name={iconName as any} 
        size={24} 
        className="mb-2 text-blue-500"
      />
    )}
    <Text className="text-base font-semibold mb-1">{title}</Text>
    <Text className="text-2xl font-bold mb-1">{recordCount} records</Text>
    <Text className="text-xs text-gray-400">{getTimeAgo(updatedAt)}</Text>
  </TouchableOpacity>
); 