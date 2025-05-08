import React, { useState, useEffect } from 'react';
import { View, Text, Switch, FlatList, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSensors } from '@/hooks/settings/useSensors';
import { Sensor } from '@/types/settings';

export const SensorCenterScreen = () => {
  const [search, setSearch] = useState('');
  const {
    coreSensors,
    communitySensors,
    installedCommunitySensors,
    loadCommunitySensors,
    installCommunitySensor,
    uninstallCommunitySensor,
    activateCommunitySensor,
    deactivateCommunitySensor,
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

  const handlePluginInstall = async (sensor: Sensor) => {
    await installCommunitySensor(sensor);
    Alert.alert('플러그인 설치', '플러그인 설치 및 활성화 완료');
  };

  const handlePluginToggle = async (sensor: Sensor) => {
    const isInstalled = installedCommunitySensors.some(s => s.key === sensor.key);
    if (isInstalled) {
      const isActive = installedCommunitySensors.find(s => s.key === sensor.key)?.isActive;
      if (isActive) {
        await deactivateCommunitySensor(sensor);
      } else {
        await activateCommunitySensor(sensor);
      }
    }
  };

  const handlePluginUninstall = async (sensor: Sensor) => {
    await uninstallCommunitySensor(sensor);
    Alert.alert('플러그인 제거', '플러그인이 성공적으로 제거되었습니다.');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-[15px] font-bold text-blue-600 mt-[18px] mb-2">Core Sensors</Text>
        <FlatList
          data={coreSensors}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <View className="flex-row items-center py-3.5 px-4 bg-white">
              <Ionicons name={item.icon as any} size={22} color="#2563eb" className="mr-3" />
              <Text className="text-[15px] text-slate-800 flex-1">{item.name}</Text>
              <Text className="text-sm text-gray-500 mr-3">{item.desc}</Text>
              <Switch 
                value={item.isActive} 
                onValueChange={() => handleCoreSwitch(item)} 
                trackColor={{ true: '#2563eb' }} 
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
          className="bg-white rounded-xl mb-2"
          scrollEnabled={false}
        />

        <Text className="text-[15px] font-bold text-blue-600 mt-[18px] mb-2">Community Plugins</Text>
        
        {/* 설치된 플러그인 섹션 */}
        <Text className="text-sm text-gray-600 mb-2">설치된 플러그인</Text>
        <FlatList
          data={communitySensors.filter(p => installedCommunitySensors.some(s => s.key === p.key))}
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            const isActive = installedCommunitySensors.find(s => s.key === item.key)?.isActive;
            return (
              <View className="flex-row items-center py-3.5 px-4 bg-white">
                <Ionicons name={item.icon as any} size={22} color="#2563eb" className="mr-3" />
                <View className="flex-1">
                  <Text className="text-[15px] text-slate-800">{item.name}</Text>
                  <Text className="text-sm text-gray-500">{item.desc}</Text>
                </View>
                <TouchableOpacity 
                  className="bg-red-500 rounded-lg px-3.5 py-1.5 mr-2"
                  onPress={() => handlePluginUninstall(item)}
                >
                  <Text className="text-white text-sm font-semibold">제거</Text>
                </TouchableOpacity>
                <Switch
                  value={isActive}
                  onValueChange={() => handlePluginToggle(item)}
                  trackColor={{ true: '#2563eb' }}
                />
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
          className="bg-white rounded-xl mb-4"
          scrollEnabled={false}
        />

        {/* 플러그인 검색 섹션 */}
        <Text className="text-sm text-gray-600 mb-2">플러그인 검색</Text>
        <TextInput
          className="bg-slate-100 rounded-lg px-3 py-2 text-[15px] mb-2"
          placeholder="플러그인 검색"
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={search 
            ? communitySensors.filter(p => p.name.includes(search))
            : communitySensors.filter(p => !installedCommunitySensors.some(s => s.key === p.key))}
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            const isInstalled = installedCommunitySensors.some(s => s.key === item.key);
            return (
              <View className="flex-row items-center py-3.5 px-4 bg-white">
                <Ionicons name={item.icon as any} size={22} color="#2563eb" className="mr-3" />
                <View className="flex-1">
                  <Text className="text-[15px] text-slate-800">{item.name}</Text>
                  <Text className="text-sm text-gray-500">{item.desc}</Text>
                </View>
                {!isInstalled && (
                  <TouchableOpacity 
                    className="bg-blue-600 rounded-lg px-3.5 py-1.5"
                    onPress={() => handlePluginInstall(item)}
                  >
                    <Text className="text-white text-sm font-semibold">설치</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
          className="bg-white rounded-xl mb-2"
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}; 