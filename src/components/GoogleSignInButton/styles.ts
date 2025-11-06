import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    minWidth: 320,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DADCE0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoWrapper: {
    marginRight: 12,
  },
  logoContainer: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  logoSquare: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
  logoBlue: {
    top: 0,
    left: 0,
    backgroundColor: '#4285F4',
    borderTopLeftRadius: 2,
  },
  logoGreen: {
    top: 0,
    right: 0,
    backgroundColor: '#34A853',
    borderTopRightRadius: 2,
  },
  logoYellow: {
    bottom: 0,
    left: 0,
    backgroundColor: '#FBBC04',
    borderBottomLeftRadius: 2,
  },
  logoRed: {
    bottom: 0,
    right: 0,
    backgroundColor: '#EA4335',
    borderBottomRightRadius: 2,
  },
  text: {
    color: '#3C4043',
    fontSize: 14,
    fontWeight: '500',
  },
});
