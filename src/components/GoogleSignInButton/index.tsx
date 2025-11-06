import React from 'react';
import { TouchableOpacity, Text, View, ViewStyle } from 'react-native';
import { styles } from './styles';

interface GoogleSignInButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

// TODO: Change this into real google logo
const GoogleLogo: React.FC = () => (
  <View style={styles.logoContainer}>
    <View style={[styles.logoSquare, styles.logoBlue]} />
    <View style={[styles.logoSquare, styles.logoGreen]} />
    <View style={[styles.logoSquare, styles.logoYellow]} />
    <View style={[styles.logoSquare, styles.logoRed]} />
  </View>
);

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.logoWrapper}>
        <GoogleLogo />
      </View>
      <Text style={styles.text}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};
