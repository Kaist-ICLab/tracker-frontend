import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';

const CAMPAIGN_NAME = '건강 캠페인';

export const MessagingScreen: React.FC = () => {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // 초기 메시지
    setMessages([
      {
        _id: 1,
        text: '안녕하세요! 궁금한 점이 있으면 언제든 메시지 주세요.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: '연구자',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    // 연구자 타이핑 mock
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => GiftedChat.append(prev, [{
        _id: Math.random().toString(),
        text: '답변 감사합니다!',
        createdAt: new Date(),
        user: { _id: 2, name: '연구자' },
      }]));
    }, 1200);
  }, []);

  const onLoadEarlier = () => {
    // 이전 메시지 mock
    setTimeout(() => {
      setMessages(prev => GiftedChat.prepend(prev, [
        {
          _id: Math.random().toString(),
          text: '이전 메시지 예시입니다.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
          user: { _id: 2, name: '연구자' },
        },
      ]));
    }, 800);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-gray-200">
        <Text className="flex-1 text-lg font-bold text-blue-600">{CAMPAIGN_NAME}</Text>
        <TouchableOpacity className="p-1">
          <Ionicons name="ellipsis-vertical" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>
      {/* Chat */}
      <GiftedChat
        messages={messages}
        onSend={(messages: IMessage[]) => onSend(messages)}
        user={{ _id: 1, name: '나' }}
        isTyping={isTyping}
        loadEarlier={true}
        onLoadEarlier={onLoadEarlier}
        showUserAvatar={false}
        renderUsernameOnMessage={true}
        placeholder="메시지를 입력하세요..."
        renderAvatar={null}
        renderLoading={() => <Text className="text-center mt-5">로딩 중...</Text>}
        renderFooter={() => isTyping ? <Text className="text-center text-gray-500 mb-2 text-sm">연구자 입력 중...</Text> : null}
      />
    </View>
  );
}; 