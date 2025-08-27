import React, { useState } from 'react';
import { View, Text, Switch, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
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
    verifySensorStatus,
    verifyAllSensors,
  } = useSensors();
  const [verifying, setVerifying] = useState(false);

  const handleCoreSwitch = async (sensor: Sensor) => {
    const sensorState = coreSensors.find(s => s.key === sensor.key);
    if (!sensorState?.available) {
      console.log(sensorState);
      // Show some indication that sensor is not available
      return;
    }

    if (sensorState.isActive) {
      await deactivateCoreSensor(sensor);
    } else {
      await activateCoreSensor(sensor);
    }
  };

  const handleVerifySensor = async (sensor: Sensor) => {
    setVerifying(true);
    try {
      const status = await verifySensorStatus(sensor.key);
      if (status) {
        Alert.alert(
          `센서 상태 확인: ${sensor.name}`,
          `상태: ${status.active ? '활성화' : '비활성화'}\n마지막 업데이트: ${status.lastUpdate}`,
          [{ text: '확인', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('오류', '센서 상태를 확인할 수 없습니다.');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyAll = async () => {
    setVerifying(true);
    try {
      const allStatus = await verifyAllSensors();
      if (allStatus) {
        const activeSensors = allStatus.filter((s: any) => s.active).map((s: any) => s.key);
        const message = activeSensors.length > 0
          ? `활성화된 센서: ${activeSensors.join(', ')}`
          : '활성화된 센서가 없습니다.';
        Alert.alert('전체 센서 상태', message);
      }
    } catch (error) {
      Alert.alert('오류', '센서 상태를 확인할 수 없습니다.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Verification Button */}
      <View className="mx-4 mt-4 mb-2">
        <TouchableOpacity
          onPress={handleVerifyAll}
          disabled={verifying}
          className="bg-blue-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
        >
          {verifying ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="checkmark-circle" size={20} color="white" />
          )}
          <Text className="text-white font-semibold ml-2">
            {verifying ? '확인 중...' : '전체 센서 상태 확인'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={coreSensors}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-[18px] px-5 bg-white">
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
                <>
                  <TouchableOpacity
                    onPress={() => handleVerifySensor(item)}
                    disabled={verifying}
                    className="mr-2 p-1"
                  >
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color={item.isActive ? "#10b981" : "#6b7280"}
                    />
                  </TouchableOpacity>
                  <Switch
                    value={item.isActive}
                    onValueChange={() => handleCoreSwitch(item)}
                    disabled={!item.available}
                  />
                </>
              )}
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
        contentContainerStyle={{ backgroundColor: 'white', borderRadius: 16, margin: 16, overflow: 'hidden' }}
        scrollEnabled={true}
      />
    </View>
  );
};
