import { useAuth } from '@/hooks/settings/useAuth';
import { useCampaigns } from '@/hooks/settings/useCampaigns';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const CampaignParticipationScreen = () => {
  const { campaigns, loadCampaigns } = useCampaigns();
  const { profile, joinCampaign, leaveCampaign } = useAuth();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCampaigns().finally(() => {
      setRefreshing(false);
    });
  };

  const filtered = campaigns.filter(c => c.name.includes(search) || c.description.includes(search));
  const currentCampaign = campaigns.find(c => c.id === profile?.campaignId);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {currentCampaign && (
        <>
          <Text className="text-[15px] font-bold text-blue-600 mt-[18px] mb-2">현재 캠페인</Text>
          <View className="bg-white rounded-2xl p-5 mb-[18px] shadow-sm">
            <Text className="text-base font-bold text-slate-800">{currentCampaign.name}</Text>
            <Text className="text-sm text-gray-500 mt-1 mb-2">{currentCampaign.description}</Text>
            <View className="flex-row items-center mt-2">
              <View className="rounded-lg px-2.5 py-1 mr-3 bg-emerald-100">
                <Text className="text-sm text-blue-600 font-semibold">진행 중</Text>
              </View>
              <TouchableOpacity 
                className="ml-3 bg-red-50 rounded-lg px-3 py-1.5" 
                onPress={() => leaveCampaign()}
              >
                <Text className="text-red-600 text-sm font-semibold">캠페인 나가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      <Text className="text-[15px] font-bold text-blue-600 mt-[18px] mb-2">Available Campaigns</Text>
      <TextInput
        className="bg-slate-100 rounded-lg px-3 py-2 text-[15px] mb-2"
        placeholder="캠페인 검색"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-4 px-5 bg-white">
            <View className="flex-1">
              <Text className="text-base font-bold text-slate-800">{item.name}</Text>
              <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
            </View>
            <TouchableOpacity 
              className={`rounded-lg px-3.5 py-1.5 ml-3 ${profile?.campaignId ? 'bg-gray-400' : 'bg-blue-600'}`}
              onPress={() => joinCampaign(item.id)}
              disabled={!!profile?.campaignId}
            >
              <Text className="text-white text-sm font-semibold">
                {profile?.campaignId ? '참여 불가' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
        contentContainerStyle={{ backgroundColor: 'white', borderRadius: 16, margin: 8, overflow: 'hidden' }}
      />
    </View>
  );
}; 