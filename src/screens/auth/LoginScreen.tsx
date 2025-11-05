import React from 'react';
import GoogleButton from 'react-google-button'
import { View, Text, TouchableOpacity, Image } from 'react-native';

export const LoginScreen: React.FC<{
  navigation: any;
}> = ({ navigation }) => {
  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in functionality
    console.log('Google sign in button pressed');
  };

  const handleTestWithoutLogin = () => {
    navigation.replace('MainApp');
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="flex-row items-center justify-center mb-10">
        <Image
          source={require('@assets/icon.png')}
          style={{ width: 70, height: 70, marginRight: 20 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-black">ICLab Tracker System</Text>
      </View>
       <View className="mb-8">
         <GoogleButton
           onClick={handleGoogleSignIn}
         />
       </View>
       <TouchableOpacity onPress={handleTestWithoutLogin} activeOpacity={0.7}>
        <Text className="text-gray-500 text-sm underline">Otherwise, test without login.</Text>
      </TouchableOpacity>
    </View>
  );
};

