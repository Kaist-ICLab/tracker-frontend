import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useDashboardData } from '@hooks/useDashboardData';
import { DataCard } from '@components/DataCard';
import { DataCard as DataCardType } from '@types/dashboard';

export const DashboardScreen: React.FC<{
  navigation: any;
}> = ({ navigation }) => {
  const { cards, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator className="text-blue-500" size="large"/>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-base">{error}</Text>
      </View>
    );
  }

  const handleCardPress = (card: DataCardType) => {
    navigation.navigate('DataDetail', {
      id: card.id,
      title: card.title,
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DataCard {...item} onPress={() => handleCardPress(item)} />
        )}
        className="py-4"
      />
    </View>
  );
}; 