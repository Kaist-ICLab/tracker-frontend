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
    className="bg-white rounded-lg p-3 mx-4 my-1.5 shadow-sm"
    onPress={onPress}
  >
    {iconName && (
      <Ionicons 
        name={iconName as any} 
        size={20} 
        className="mb-1 text-blue-500"
      />
    )}
    <Text className="text-sm font-semibold mb-0.5">{title}</Text>
    <Text className="text-lg font-bold mb-0.5">{recordCount} records</Text>
    <Text className="text-xs text-gray-400">{getTimeAgo(updatedAt)}</Text>
  </TouchableOpacity>
); 