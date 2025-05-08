import React from 'react';
import { View, Text } from 'react-native';

export const AppBar: React.FC<{
  title: string;
}> = ({ title }) => (
  <View className="bg-blue-500 p-4 shadow-md">
    <Text className="text-white text-xl font-bold text-center">
      {title}
    </Text>
  </View>
); 