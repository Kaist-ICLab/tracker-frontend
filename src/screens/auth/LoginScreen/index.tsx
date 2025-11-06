import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { GoogleSignInButton } from '@components/GoogleSignInButton';
import { styles } from './styles';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ICLab Tracker</Text>
      </View>
      <View style={styles.buttonContainer}>
        <GoogleSignInButton
          onPress={handleGoogleSignIn}
        />
      </View>
      <TouchableOpacity onPress={handleTestWithoutLogin} activeOpacity={0.7}>
        <Text style={styles.testLink}>Otherwise, test without login.</Text>
      </TouchableOpacity>
    </View>
  );
};
