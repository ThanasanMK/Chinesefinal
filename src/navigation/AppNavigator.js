import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../AuthContext';

import LoginPage from '../pages/LoginPage';
import RegisterScreen from '../pages/RegisterScreen';
import ResetPasswordScreen from '../pages/ResetPasswordScreen';
import HomeScreen from '../pages/HomeScreen';
import WordListScreen from '../pages/WordListScreen';
import WordFormScreen from '../pages/WordFormScreen';
import ImageUploadScreen from '../pages/ImageUploadScreen';
import ChatScreen from '../pages/ChatScreen';
import NotificationsScreen from '../pages/NotificationsScreen'; //  เพิ่มหน้าแจ้งเตือน

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Words" component={WordListScreen} />
      <Stack.Screen name="WordForm" component={WordFormScreen} />
      <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} /> 
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
