import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AppBar } from '@components/AppBar';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { MessagingScreen } from '@/screens/messaging/MessagingScreen';
import { SettingsHomeScreen } from '@/screens/setttings/SettingsHomeScreen';
import { AccountScreen } from '@/screens/setttings/AccountScreen';
import { DataSyncScreen } from '@/screens/setttings/DataSyncScreen';
import { PermissionsScreen } from '@/screens/setttings/PermissionsScreen';
import { SensorCenterScreen } from '@/screens/setttings/SensorCenterScreen';
import { DevicePairingScreen } from '@/screens/setttings/DevicePairingScreen';
import { CampaignParticipationScreen } from '@/screens/setttings/CampaignParticipationScreen';
import { DataDetailScreen } from '@/screens/dashboard/DataDetailScreen';
import { CaptureHomeScreen } from '@/screens/capture/CaptureHomeScreen';
import { ManualEntryFormScreen } from '@/screens/capture/ManualEntryFormScreen';
import { ActiveMeasureScreen } from '@/screens/capture/ActiveMeasureScreen';
import "./global.css"


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="DashboardMain" 
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="DataDetail"
      component={DataDetailScreen}
      options={{ 
        headerShown: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: '#3b82f6',
      }}
    />
  </Stack.Navigator>
);

const CaptureStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CaptureHome"
      component={CaptureHomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ManualEntryForm"
      component={ManualEntryFormScreen}
      options={{ headerShown: true, title: 'Manual Entry' }}
    />
    <Stack.Screen
      name="ActiveMeasure"
      component={ActiveMeasureScreen}
      options={{ headerShown: true, title: 'Active Measure' }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Account" component={AccountScreen} options={{ title: '계정' }} />
    <Stack.Screen name="DataSync" component={DataSyncScreen} options={{ title: '데이터 동기화' }} />
    <Stack.Screen name="Permissions" component={PermissionsScreen} options={{ title: '권한' }} />
    <Stack.Screen name="SensorCenter" component={SensorCenterScreen} options={{ title: '센서·확장' }} />
    <Stack.Screen name="DevicePairing" component={DevicePairingScreen} options={{ title: '디바이스' }} />
    <Stack.Screen name="CampaignParticipation" component={CampaignParticipationScreen} options={{ title: '캠페인' }} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView className="flex-1">
        <StatusBar style="auto" />
        <AppBar title="Tracker App" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'home';
              
              if (route.name === 'Dashboard') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Capture') {
                iconName = focused ? 'camera' : 'camera-outline';
              } else if (route.name === 'Messaging') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }
              
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardStack} />
          <Tab.Screen name="Capture" component={CaptureStack} />
          <Tab.Screen name="Messaging" component={MessagingScreen} />
          <Tab.Screen name="Settings" component={SettingsStack} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
