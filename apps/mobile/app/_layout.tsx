import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import colors from 'tailwindcss/colors';
import '../global.css';

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

function RootLayoutView() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    JetBrainsMono: require('../assets/fonts/JetBrainsMono-Regular.ttf'),
  });

  useEffect(() => {
    AsyncStorage.getItem('colorScheme').then((value) => {
      setColorScheme(value as typeof colorScheme);
    });
  }, []);

  useEffect(() => {
    StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.zinc[900] : colors.zinc[100],
        },
        headerShown: false,
      }}
    ></Stack>
  );
}

export default RootLayoutView;
