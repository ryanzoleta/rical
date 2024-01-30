import { ChevronRight, Sun, Hash, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import colors from 'tailwindcss/colors';
import HighlightedPressable from '../lib/components/HighlightedPressable';
import { router } from 'expo-router';

function SettingsPage() {
  return (
    <SafeAreaView className="flex-col gap-5">
      <HighlightedPressable className="flex-row items-center" onPress={router.back}>
        <ChevronLeft color={colors.blue[500]} size={30} />
        <Text className="text-xl text-blue-500">Back</Text>
      </HighlightedPressable>

      <Text className="px-4 text-4xl font-bold">Settings</Text>

      <View className="gap-3">
        <View className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4">
          <View className="flex-row gap-2">
            <Sun color={colors.zinc[400]} />
            <Text className="text-xl text-zinc-900">Appearance</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-700">System</Text>
            <ChevronRight color={colors.zinc[400]} />
          </View>
        </View>

        <View className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4">
          <View className="flex-row gap-2">
            <Hash color={colors.zinc[400]} />
            <Text className="text-xl text-zinc-900">Precision</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-700">2 decimal points</Text>
            <ChevronRight color={colors.zinc[400]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SettingsPage;
