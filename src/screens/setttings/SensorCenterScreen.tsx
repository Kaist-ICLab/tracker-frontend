import React from 'react';
import { View, Text, Switch, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSensors } from '@/hooks/settings/useSensors';
import { Sensor } from '@/types/settings';
import { LoadingScreen } from '@/components/LoadingScreen';

export const SensorCenterScreen = () => {
  const {
    coreSensors,
    loading,
    activateCoreSensor,
    deactivateCoreSensor,
  } = useSensors();

  const handleSensorSwitch = async (sensor: Sensor) => {
    const sensorState = coreSensors.find(s => s.key === sensor.key);
    if (!sensorState?.available) {
      // Show some indication that sensor is not available
      return;
    }

    if (sensorState.isActive) {
      await deactivateCoreSensor(sensor);
    } else {
      await activateCoreSensor(sensor);
    }
  };

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <View className="flex-1 bg-gray-100 mt-4">
      <FlatList
        data={coreSensors}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-[18px] px-5 bg-white mx-4 mb-2 rounded-lg">
            <Ionicons
              name={item.icon as any}
              size={24}
              color={item.available ? "#2563eb" : "#9ca3af"}
              className="mr-4"
            />
            <View className="flex-1">
              <Text className={`text-[15px] ${item.available ? 'text-slate-800' : 'text-gray-400'}`}>
                {item.name}
              </Text>
              <Text className={`text-sm ${item.available ? 'text-gray-500' : 'text-gray-300'}`}>
                {item.desc}
              </Text>
              {item.status && (
                <Text className={`text-xs mt-1 ${item.status === 'RUNNING' ? 'text-green-600' : 'text-gray-500'}`}>
                  상태: {item.status === 'RUNNING' ? '실행 중' : '중지됨'}
                </Text>
              )}
              {!item.available && (
                <Text className="text-xs text-red-500 mt-1">사용할 수 없음</Text>
              )}
            </View>
            <View className="flex-row items-center">
              {item.loading ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <Switch
                  value={item.isActive}
                  onValueChange={() => handleSensorSwitch(item)}
                  disabled={!item.available}
                />
              )}
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};
