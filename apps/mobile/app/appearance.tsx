import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import PressableOpacity from '../lib/components/PressableOpacity';
import { Check, ChevronLeft } from 'lucide-react-native';
import colors from 'tailwindcss/colors';
import { router } from 'expo-router';
import PressableBackground from '../lib/components/PressableBackground';

function ApperanceSetting() {
  return (
    <SafeAreaView>
      <View className="mt-1 flex-row justify-between">
        <PressableOpacity className="flex-1 flex-row items-center" onPress={router.back}>
          <ChevronLeft color={colors.blue[500]} size={30} />
          <Text className="text-xl text-blue-500">Back</Text>
        </PressableOpacity>

        <Text className="flex-1 text-center text-xl">Appearance</Text>

        <View className="flex-1"></View>
      </View>

      <View className="m-2 rounded-xl bg-white">
        <PressableBackground
          className="flex-row justify-between border-b border-b-zinc-100 p-4"
          defaultBackgrounrColor="white"
          highlightBackgroundColor={colors.zinc[200]}
          onPress={() => {}}
        >
          <Text className="text-xl ">System</Text>
          <Check color={colors.zinc[500]} />
        </PressableBackground>

        <PressableBackground
          className="flex-row justify-between border-b border-b-zinc-100 p-4"
          defaultBackgrounrColor="white"
          highlightBackgroundColor={colors.zinc[200]}
          onPress={() => {}}
        >
          <Text className="text-xl ">Dark</Text>
        </PressableBackground>

        <PressableBackground
          className="flex-row justify-between p-4"
          defaultBackgrounrColor="white"
          highlightBackgroundColor={colors.zinc[200]}
          onPress={() => {}}
        >
          <Text className="text-xl ">Light</Text>
        </PressableBackground>
      </View>
    </SafeAreaView>
  );
}

export default ApperanceSetting;
