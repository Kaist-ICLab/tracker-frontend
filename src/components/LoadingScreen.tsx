import React from 'react';
import { LOADING_TEXT } from '@/constants/settings';
import { View, Text, ActivityIndicator } from 'react-native';

export const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-4 text-gray-600">{LOADING_TEXT}</Text>
    </View>
  )
}
