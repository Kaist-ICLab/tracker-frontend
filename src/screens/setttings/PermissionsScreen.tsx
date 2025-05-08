import { usePermissions } from '@/hooks/settings/usePermissions';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, RefreshControl, Switch, Text, View } from 'react-native';

export const PermissionsScreen = () => {
  const { permissions, requestPermission } = usePermissions();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // 상태 랜덤 변경 mock
      permissions.forEach(perm => {
        requestPermission(perm.key, Math.random() > 0.5);
      });
      setRefreshing(false);
    }, 800);
  };


  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={permissions}
        keyExtractor={item => item.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-[18px] px-5 bg-white">
            <Ionicons name={item.icon as any} size={24} color="#2563eb" className="mr-4" />
            <Text className="text-[15px] text-slate-800 flex-1">{item.name}</Text>
            <View className={`rounded-lg px-2.5 py-1 mr-3 ${
              item.status === '허용됨' ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              <Text className="text-sm text-blue-600 font-semibold">{item.status}</Text>
            </View>
            <Switch
              value={item.status === '허용됨'}
              onValueChange={(value) => requestPermission(item.key, value)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
        contentContainerStyle={{ backgroundColor: 'white', borderRadius: 16, margin: 16, overflow: 'hidden' }}
      />
    </View>
  );
}; 