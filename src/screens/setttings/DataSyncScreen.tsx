import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDataSync } from '@/hooks/settings/useDataSync';
import { AutoUploadMode } from '@/types/settings';

const UPLOAD_MODES: AutoUploadMode[] = ['WiFi Only', 'WiFi + Mobile', 'Off'];
const UPLOAD_INTERVALS = [
  { label: '매 1시간', value: 3600000 },
  { label: '매 3시간', value: 10800000 },
  { label: '매 6시간', value: 21600000 },
  { label: '매일', value: 86400000 },
];

export const DataSyncScreen = () => {
  const { 
    autoUploadMode, 
    autoUploadInterval, 
    syncDataStat,
    updateAutoUploadMode, 
    updateAutoUploadInterval 
  } = useDataSync();

  const handleSyncNow = () => {
    Alert.alert('즉시 동기화', '데이터가 즉시 동기화됩니다. (mock)');
  };

  const isManualMode = autoUploadMode === 'Off';

  const formatLastUploadTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <View className="bg-white rounded-xl p-4 mb-6">
        <Text className="text-[15px] font-medium text-gray-500 mb-1">마지막 업로드</Text>
        <Text className="text-[17px] font-semibold text-gray-900">{formatLastUploadTime(syncDataStat.lastUploadTime)}</Text>
        <Text className="text-[15px] font-medium text-gray-500 mt-4 mb-1">미업로드 레코드</Text>
        <Text className="text-[17px] font-semibold text-gray-900">{syncDataStat.pendingRecordsCount}개</Text>
      </View>

      <Text className="text-[15px] font-bold text-blue-600 mt-[18px] mb-2">업로드 모드</Text>
      <View className="flex-row mb-3">
        {UPLOAD_MODES.map(mode => (
          <TouchableOpacity
            key={mode}
            className={`bg-white rounded-lg px-4 py-2.5 mr-2.5 border ${
              autoUploadMode === mode ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
            onPress={() => updateAutoUploadMode(mode)}
          >
            <Text className={`text-sm font-medium ${
              autoUploadMode === mode ? 'text-blue-600' : 'text-gray-700'
            }`}>{mode === 'Off' ? 'Manual' : mode}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-[15px] font-bold text-blue-600 mt-[18px] mb-2">업로드 주기</Text>
      <View className="flex-row mb-3">
        {UPLOAD_INTERVALS.map(interval => (
          <TouchableOpacity
            key={interval.label}
            className={`bg-white rounded-lg px-4 py-2.5 mr-2.5 border ${
              autoUploadInterval === interval.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            } ${isManualMode ? 'opacity-50' : ''}`}
            onPress={() => !isManualMode && updateAutoUploadInterval(interval.value)}
            disabled={isManualMode}
          >
            <Text className={`text-sm font-medium ${
              autoUploadInterval === interval.value ? 'text-blue-600' : 'text-gray-700'
            } ${isManualMode ? 'text-gray-400' : ''}`}>{interval.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity className="bg-blue-600 rounded-xl py-4 items-center mt-4" onPress={handleSyncNow}>
        <Text className="text-white text-base font-bold">즉시 동기화</Text>
      </TouchableOpacity>
    </View>
  );
}; 