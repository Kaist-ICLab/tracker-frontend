import { useAuth } from '@/hooks/settings/useAuth';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export const AccountScreen = () => {
  const { profile, login, logout } = useAuth();

  if (!profile) {
    return (
      <View className="flex-1 bg-gray-100 p-6">
        <TouchableOpacity
          className="rounded-xl py-4 items-center bg-blue-600"
          onPress={() => login()}
        >
          <Text className="text-white text-base font-bold">로그인</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-6">
      {/* 프로필 헤더 */}
      <View className="flex-row items-center mb-8 bg-white rounded-2xl p-5 shadow-sm">
        <Image source={{ uri: profile.avatar }} className="w-16 h-16 rounded-full mr-5 bg-gray-200" />
        <View>
          <Text className="text-lg font-bold text-slate-800">{profile.name}</Text>
          <Text className="text-sm text-gray-500 mt-1">{profile.email}</Text>
        </View>
      </View>
      {/* 로그아웃 버튼 */}
      <TouchableOpacity
        className="rounded-xl py-4 items-center bg-red-500"
        onPress={() => logout()}
      >
        <Text className="text-white text-base font-bold">로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}; 