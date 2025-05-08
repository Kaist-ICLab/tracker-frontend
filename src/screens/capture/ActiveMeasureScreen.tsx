import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActiveMeasureScreenProps {
  route: {
    params: {
      sensorId: string;
      label: string;
    };
  };
  navigation: any;
}

const MOCK_UNIT: Record<string, string> = {
  '심박수': 'bpm',
  '체온': '°C',
  '산소포화도': '%',
};

const getRandomResult = (label: string) => {
  switch (label) {
    case '심박수':
      return Math.floor(Math.random() * 40) + 60; // 60~100
    case '체온':
      return (36 + Math.random() * 1.5).toFixed(1); // 36.0~37.5
    case '산소포화도':
      return Math.floor(Math.random() * 4) + 96; // 96~99
    default:
      return Math.floor(Math.random() * 100);
  }
};

export const ActiveMeasureScreen: React.FC<ActiveMeasureScreenProps> = ({ route, navigation }) => {
  const { sensorId, label } = route.params;
  const [status, setStatus] = useState<'idle' | 'measuring' | 'done'>('idle');
  const [result, setResult] = useState<string | number | null>(null);

  const handleStart = () => {
    setStatus('measuring');
    setTimeout(() => {
      const value = getRandomResult(label);
      setResult(value);
      setStatus('done');
    }, 1800);
  };

  const handleSave = () => {
    Alert.alert('저장 완료', '측정값이 저장되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDisconnect = () => {
    Alert.alert('연결 해제', '기기 연결을 해제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '해제', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Text className="flex-1 text-xl font-bold text-blue-600">{label}</Text>
        <Text className="text-sm text-gray-500 mr-3">{sensorId}</Text>
        <TouchableOpacity onPress={handleDisconnect} className="p-1">
          <Ionicons name="power" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
      {/* Main */}
      <View className="flex-1 justify-center items-center">
        {status === 'idle' && (
          <TouchableOpacity 
            className="bg-blue-600 rounded-full w-24 h-24 items-center justify-center mb-6 flex-col"
            onPress={handleStart}
          >
            <Ionicons name="play" size={36} color="white" />
            <Text className="text-white text-base font-semibold mt-2">측정 시작</Text>
          </TouchableOpacity>
        )}
        {status === 'measuring' && (
          <View className="items-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="mt-4 text-base text-blue-600">측정 중...</Text>
          </View>
        )}
        {status === 'done' && (
          <View className="items-center bg-white rounded-2xl p-8 shadow-sm">
            <Text className="text-5xl font-bold text-gray-900">{result}</Text>
            <Text className="text-xl text-blue-600 mt-1">{MOCK_UNIT[label] || ''}</Text>
            <Text className="text-base text-emerald-500 mt-2 font-semibold">정상</Text>
          </View>
        )}
      </View>
      {/* Save Button */}
      <TouchableOpacity
        className={`rounded-xl py-3.5 items-center mb-2 ${
          status === 'done' ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        onPress={handleSave}
        disabled={status !== 'done'}
      >
        <Text className="text-white text-base font-semibold">저장</Text>
      </TouchableOpacity>
    </View>
  );
}; 