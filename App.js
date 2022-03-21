import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppRoutes } from './src/navigation/app.routes';


export default function App() {
  return (
    <AppRoutes/>
  );
}