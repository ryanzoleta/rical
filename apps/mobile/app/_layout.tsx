import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import colors from 'tailwindcss/colors';
import '../global.css';

import React, { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RootLayoutView() {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(useColorScheme());
  const [fontsLoaded] = useFonts({
    JetBrainsMono: require('../assets/fonts/JetBrainsMono-Regular.ttf'),
  });

  useEffect(() => {
    AsyncStorage.getItem('colorScheme').then((value) => {
      console.log('colorScheme from storage', value);
      setColorScheme((value as ColorSchemeName) ?? 'light');
      Appearance.setColorScheme(value as ColorSchemeName);
    });

    Appearance.addChangeListener((preferences) => {
      setColorScheme(preferences.colorScheme);
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
