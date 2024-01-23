import React from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, View, useColorScheme } from 'react-native';
import { twMerge } from 'tailwind-merge';

type Props = {};

function HomeScreen({}: Props) {
  const mode = useColorScheme();

  StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content');

  return (
    <SafeAreaView
      className={twMerge('min-h-screen', mode === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100')}
    >
      <Text className="text-center text-xl">Rical</Text>

      <TextInput className="font-jetBrainsMono text-2xl" />
    </SafeAreaView>
  );
}

export default HomeScreen;
