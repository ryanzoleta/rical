import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import colors from 'tailwindcss/colors';
import '../global.css';

import React from 'react';
import { useColorScheme } from 'react-native';

function RootLayoutView() {
  const mode = useColorScheme();
  const [fontsLoaded] = useFonts({
    JetBrainsMono: require('../assets/fonts/JetBrainsMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: mode === 'dark' ? colors.zinc[900] : colors.zinc[100],
        },
        headerShown: false,
      }}
    ></Stack>
  );
}

export default RootLayoutView;
