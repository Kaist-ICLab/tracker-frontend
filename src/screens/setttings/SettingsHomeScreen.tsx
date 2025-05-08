import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Account: undefined;
  DataSync: undefined;
  Permissions: undefined;
  SensorCenter: undefined;
  DevicePairing: undefined;
  CampaignParticipation: undefined;
};

type SettingsHomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const CATEGORIES = [
  {
    key: 'Account',
    icon: 'person-circle' as const,
    title: '계정',
    subtitle: '로그인/로그아웃 및 프로필',
  },
  {
    key: 'DataSync',
    icon: 'cloud-upload' as const,
    title: '데이터 동기화',
    subtitle: '업로드 방식, 자원 제한',
  },
  {
    key: 'Permissions',
    icon: 'lock-closed' as const,
    title: '권한',
    subtitle: '시스템 권한 상태 관리',
  },
  {
    key: 'SensorCenter',
    icon: 'hardware-chip' as const,
    title: '센서·확장',
    subtitle: '센서 및 플러그인 관리',
  },
  {
    key: 'DevicePairing',
    icon: 'bluetooth' as const,
    title: '디바이스',
    subtitle: 'BLE 기기 연결/해제',
  },
  {
    key: 'CampaignParticipation',
    icon: 'flag' as const,
    title: '캠페인',
    subtitle: '캠페인 참여 관리',
  },
];

export const SettingsHomeScreen: React.FC<SettingsHomeScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={CATEGORIES}
        keyExtractor={item => item.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="flex-row items-center py-[18px] px-5 bg-white"
            onPress={() => navigation.navigate(item.key)}
          >
            <Ionicons name={item.icon} size={28} color="#2563eb" className="mr-4" />
            <View className="flex-1">
              <Text className="text-base font-semibold text-slate-800">{item.title}</Text>
              <Text className="text-sm text-gray-500 mt-0.5">{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
        contentContainerStyle={{ backgroundColor: 'white', borderRadius: 16, margin: 16, overflow: 'hidden' }}
      />
    </View>
  );
}; 