import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExternalDevice } from '@/hooks/settings/useExternalDevice';

export const DevicePairingScreen = () => {
  const { devices, isScanning, startScan, connectDevice, disconnectDevice } = useExternalDevice();

  const handleConnect = (id: string) => {
    connectDevice(id);
    Alert.alert('기기 연결', '기기가 연결되었습니다.');
  };

  const handleDisconnect = (id: string) => {
    disconnectDevice(id);
    Alert.alert('기기 해제', '기기 연결이 해제되었습니다.');
  };

  const handleRescan = () => {
    startScan();
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="flex-row items-center mb-3 px-2">
        <Ionicons name={isScanning ? 'sync' : 'bluetooth'} size={22} color="#2563eb" className="mr-2" />
        <Text className="text-[15px] text-blue-600 font-semibold flex-1">{isScanning ? '스캔 중...' : '스캔 완료'}</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-blue-50 rounded-lg px-2.5 py-1.5"
          onPress={handleRescan} 
          disabled={isScanning}
        >
          <Ionicons name="refresh" size={18} color={isScanning ? '#9ca3af' : '#2563eb'} />
          <Text className={`text-sm font-semibold ml-1 ${isScanning ? 'text-gray-400' : 'text-blue-600'}`}>재스캔</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-4 px-5 bg-white">
            <Text className="text-[15px] text-slate-800 flex-1">{item.name}</Text>
            {item.status === 'CONNECTED' ? (
              <TouchableOpacity 
                className="bg-red-500 rounded-lg px-3.5 py-1.5"
                onPress={() => handleDisconnect(item.id)}
              >
                <Text className="text-white text-sm font-semibold">해제</Text>
              </TouchableOpacity>
            ) : item.status === 'CONNECTING' ? (
              <TouchableOpacity 
                className="bg-gray-400 rounded-lg px-3.5 py-1.5"
                disabled
              >
                <Text className="text-white text-sm font-semibold">연결 중</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="bg-blue-600 rounded-lg px-3.5 py-1.5"
                onPress={() => handleConnect(item.id)}
              >
                <Text className="text-white text-sm font-semibold">연결</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
        contentContainerStyle={{ backgroundColor: 'white', borderRadius: 16, margin: 16, overflow: 'hidden' }}
      />
    </View>
  );
}; 