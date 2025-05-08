import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ManualEntryFormScreenProps {
  route: {
    params: {
      schema: Record<string, string>;
      label: string;
    };
  };
  navigation: any;
}

export const ManualEntryFormScreen: React.FC<ManualEntryFormScreenProps> = ({ route, navigation }) => {
  const { schema, label } = route.params;
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [showDatePicker, setShowDatePicker] = useState<{ key: string; visible: boolean }>({ key: '', visible: false });

  const handleChange = (key: string, value: any) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // 간단 검증: 모든 필드 값이 비어있지 않은지 확인
    for (const key of Object.keys(schema)) {
      if (draft[key] === undefined || draft[key] === '') {
        Alert.alert('입력 오류', `${key} 값을 입력해 주세요.`);
        return;
      }
    }
    // 실제 저장 로직 대신 Alert
    Alert.alert('저장 완료', '입력값이 저장되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  const renderField = (key: string, type: string) => {
    if (type === 'number') {
      return (
        <TextInput
          key={key}
          className="bg-white rounded-xl px-4 py-3 text-base mb-4 text-gray-900"
          placeholder={key}
          keyboardType="numeric"
          value={draft[key] !== undefined ? String(draft[key]) : ''}
          onChangeText={text => handleChange(key, text.replace(/[^0-9.]/g, ''))}
        />
      );
    } else if (type === 'string') {
      return (
        <TextInput
          key={key}
          className="bg-white rounded-xl px-4 py-3 text-base mb-4 text-gray-900"
          placeholder={key}
          value={draft[key] || ''}
          onChangeText={text => handleChange(key, text)}
        />
      );
    } else if (type === 'date') {
      return (
        <View key={key} className="mb-4">
          <TouchableOpacity
            className="bg-white rounded-xl px-4 py-3"
            onPress={() => setShowDatePicker({ key, visible: true })}
          >
            <Text className={draft[key] ? "text-gray-900" : "text-gray-400"}>
              {draft[key] ? new Date(draft[key]).toLocaleDateString() : `${key} (날짜 선택)`}
            </Text>
          </TouchableOpacity>
          {showDatePicker.visible && showDatePicker.key === key && (
            <DateTimePicker
              value={draft[key] ? new Date(draft[key]) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                setShowDatePicker({ key: '', visible: false });
                if (date) handleChange(key, date.toISOString());
              }}
            />
          )}
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-xl font-bold mb-6 text-blue-600">{label} 입력</Text>
      <View className="mb-6">
        {Object.entries(schema).map(([key, type]) => renderField(key, type))}
      </View>
      <TouchableOpacity className="bg-blue-600 rounded-xl py-3.5 items-center" onPress={handleSave}>
        <Text className="text-white text-base font-semibold">저장</Text>
      </TouchableOpacity>
    </View>
  );
}; 