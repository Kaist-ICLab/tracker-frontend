import { usePermissions } from '@/hooks/settings/usePermissions';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, RefreshControl, Switch, Text, TouchableOpacity, View } from 'react-native';

export const PermissionsScreen = () => {
  const { permissions, loading, error, refresh, requestPermission } = usePermissions();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleIconPress = (item: any) => {
    if (item.status !== '허용됨') {
      requestPermission(item.key, true);
    } else {
      requestPermission(item.key, false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={permissions}
        keyExtractor={item => item.key}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleIconPress(item)}>
            <View className="flex-row items-center py-[18px] px-5 bg-white">
              <Ionicons name={item.icon as any} size={24} color="#2563eb" className="mr-4" />
              <Text className="text-[15px] text-slate-800 flex-1">{item.name}</Text>
              <View className={`rounded-lg px-2.5 py-1 mr-3 ${item.status === '허용됨' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                <Text className="text-sm text-blue-600 font-semibold">{item.status}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} />
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
        contentContainerStyle={{ backgroundColor: 'white', borderRadius: 16, margin: 16, overflow: 'hidden' }}
      />
    </View>
  );
};
