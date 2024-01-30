import { ChevronRight, Sun, Hash, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import colors from 'tailwindcss/colors';
import PressableOpacity from '../lib/components/PressableOpacity';
import { router } from 'expo-router';
import PressableBackground from '../lib/components/PressableBackground';

function SettingsPage() {
  return (
    <SafeAreaView className="flex-col gap-5">
      <PressableOpacity className="flex-row items-center" onPress={router.back}>
        <ChevronLeft color={colors.blue[500]} size={30} />
        <Text className="text-xl text-blue-500">Back</Text>
      </PressableOpacity>

      <Text className="px-4 text-4xl font-bold">Settings</Text>

      <View className="gap-3">
        <PressableBackground
          className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4"
          onPress={() => {
            router.push('/appearance');
          }}
          defaultBackgrounrColor="white"
          highlightBackgroundColor={colors.zinc[200]}
        >
          <View className="flex-row gap-2">
            <Sun color={colors.zinc[400]} />
            <Text className="text-xl text-zinc-900">Appearance</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-700">System</Text>
            <ChevronRight color={colors.zinc[400]} />
          </View>
        </PressableBackground>

        <PressableBackground
          className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4"
          onPress={() => {}}
          defaultBackgrounrColor="white"
          highlightBackgroundColor={colors.zinc[200]}
        >
          <View className="flex-row gap-2">
            <Hash color={colors.zinc[400]} />
            <Text className="text-xl text-zinc-900">Precision</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-700">2 decimal points</Text>
            <ChevronRight color={colors.zinc[400]} />
          </View>
        </PressableBackground>
      </View>
    </SafeAreaView>
  );
}

export default SettingsPage;
