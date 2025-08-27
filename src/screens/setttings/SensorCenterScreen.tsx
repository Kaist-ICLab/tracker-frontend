import React, { useEffect } from 'react';
import { View, Text, Switch, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSensors } from '@/hooks/settings/useSensors';
import { Sensor } from '@/types/settings';

export const SensorCenterScreen = () => {
  const {
    coreSensors,
    loadCommunitySensors,
    activateCoreSensor,
    deactivateCoreSensor,
  } = useSensors();

  useEffect(() => {
    loadCommunitySensors();
  }, []);

  const handleCoreSwitch = async (sensor: Sensor) => {
    const isActive = coreSensors.find(s => s.key === sensor.key)?.isActive;
    if (isActive) {
      await deactivateCoreSensor(sensor);
    } else {
      await activateCoreSensor(sensor);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={coreSensors}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-[18px] px-5 bg-white">
            <Ionicons name={item.icon as any} size={24} color="#2563eb" className="mr-4" />
            <Text className="text-[15px] text-slate-800 flex-1">{item.name}</Text>
            <Text className="text-sm text-gray-500 mr-3">{item.desc}</Text>
            <Switch
              value={item.isActive}
              onValueChange={() => handleCoreSwitch(item)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
        contentContainerStyle={{ backgroundColor: 'white', borderRadius: 16, margin: 16, overflow: 'hidden' }}
        scrollEnabled={false}
      />
    </View>
  );
};
