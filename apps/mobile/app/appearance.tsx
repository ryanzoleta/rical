import React from 'react';
import { Text, SafeAreaView, View, Pressable } from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import colors from 'tailwindcss/colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

function ApperanceSetting() {
  const { colorScheme, setColorScheme } = useColorScheme();

  function updateColorScheme(mode: typeof colorScheme) {
    setColorScheme(mode);
    AsyncStorage.setItem('colorScheme', mode?.toString() ?? 'light');
    router.back();
  }

  return (
    <SafeAreaView className="gap-3">
      <View className="mt-1 flex-row justify-between">
        <Pressable
          className="flex-1 flex-row items-center transition-opacity active:opacity-50"
          onPress={router.back}
        >
          <ChevronLeft color={colors.blue[500]} size={30} />
          <Text className="text-xl text-blue-500">Back</Text>
        </Pressable>

        <Text className="flex-1 text-center text-xl dark:text-white">Appearance</Text>

        <View className="flex-1"></View>
      </View>

      <View className="m-2 rounded-xl">
        <Pressable
          className="flex-row justify-between rounded-t-xl border-b border-b-zinc-100 bg-white p-4 transition-colors duration-300 active:bg-zinc-200 dark:border-b-zinc-700 dark:bg-zinc-800 dark:active:bg-zinc-700"
          onPress={() => {
            updateColorScheme('dark');
          }}
        >
          <Text className="text-xl dark:text-white">Dark</Text>

          {colorScheme === 'dark' && <Check color={colors.zinc[500]} />}
        </Pressable>

        <Pressable
          className="flex-row justify-between rounded-b-xl bg-white p-4 transition-colors duration-300 active:bg-zinc-200 dark:border-b-zinc-700 dark:bg-zinc-800 dark:active:bg-zinc-700"
          onPress={() => {
            updateColorScheme('light');
          }}
        >
          <Text className="text-xl dark:text-white">Light</Text>

          {colorScheme === 'light' && <Check color={colors.zinc[500]} />}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default ApperanceSetting;
