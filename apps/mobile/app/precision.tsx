import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, View, Pressable, TextInput } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import colors from 'tailwindcss/colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PrecisionSetting() {
  const [precision, setPrecision] = useState('2');

  useEffect(() => {
    AsyncStorage.getItem('precision').then((value) => {
      setPrecision(value ?? '2');
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('precision', precision);
  }, [precision]);

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

        <Text className="flex-1 text-center text-xl dark:text-white">Precision</Text>

        <View className="flex-1"></View>
      </View>

      <Text className="mx-3 text-xl text-zinc-600 dark:text-zinc-300">
        Maximum number of decimal points
      </Text>

      <TextInput
        style={{
          lineHeight: 0,
        }}
        className="mx-3 flex-row rounded-xl bg-white p-4 text-xl dark:bg-zinc-800 dark:text-white"
        keyboardType="number-pad"
        inputMode="numeric"
        value={precision}
        onChangeText={setPrecision}
      ></TextInput>
    </SafeAreaView>
  );
}

export default PrecisionSetting;
