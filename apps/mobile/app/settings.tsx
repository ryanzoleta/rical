import { ChevronRight, Sun, Hash, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { View, Text, SafeAreaView, useColorScheme } from 'react-native';
import colors from 'tailwindcss/colors';
import PressableOpacity from '../lib/components/PressableOpacity';
import { router } from 'expo-router';
import PressableBackground from '../lib/components/PressableBackground';
import { twMerge } from 'tailwind-merge';

function SettingsPage() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className="flex-col gap-5">
      <PressableOpacity className="flex-row items-center" onPress={router.back}>
        <ChevronLeft color={colors.blue[500]} size={30} />
        <Text className="text-xl text-blue-500">Back</Text>
      </PressableOpacity>

      <Text
        className={twMerge(
          'px-4 text-4xl font-bold',
          colorScheme === 'dark' ? 'text-white' : 'text-black',
        )}
      >
        Settings
      </Text>

      <View className="gap-3">
        <PressableBackground
          className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4"
          onPress={() => {
            router.push('/appearance');
          }}
          defaultBackgrounrColor={colorScheme === 'dark' ? colors.zinc[800] : 'white'}
          highlightBackgroundColor={colorScheme === 'dark' ? colors.zinc[700] : colors.zinc[200]}
        >
          <View className="flex-row gap-2">
            <Sun color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
            <Text
              className={twMerge(
                'text-xl',
                colorScheme === 'dark' ? 'text-zinc-200' : 'text-zinc-900',
              )}
            >
              Appearance
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-500">System</Text>
            <ChevronRight color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
          </View>
        </PressableBackground>

        <PressableBackground
          className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4"
          onPress={() => {}}
          defaultBackgrounrColor={colorScheme === 'dark' ? colors.zinc[800] : 'white'}
          highlightBackgroundColor={colorScheme === 'dark' ? colors.zinc[700] : colors.zinc[200]}
        >
          <View className="flex-row gap-2">
            <Hash color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
            <Text
              className={twMerge(
                'text-xl',
                colorScheme === 'dark' ? 'text-zinc-200' : 'text-zinc-900',
              )}
            >
              Precision
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-500">2 decimal points</Text>
            <ChevronRight color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
          </View>
        </PressableBackground>
      </View>
    </SafeAreaView>
  );
}

export default SettingsPage;
