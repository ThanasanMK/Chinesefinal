import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { paperTheme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}



