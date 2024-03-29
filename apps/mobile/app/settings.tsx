import { ChevronRight, Sun, Hash, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Pressable, Alert } from 'react-native';
import colors from 'tailwindcss/colors';
import { router, useNavigation } from 'expo-router';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SettingsPage() {
  const [precision, setPrecision] = useState(2);
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('precision').then((value) => {
      setPrecision(parseInt(value ?? '2'));
    });

    navigation.addListener('focus', () => {
      AsyncStorage.getItem('precision').then((value) => {
        setPrecision(parseInt(value ?? '2'));
      });
    });
  }, []);

  return (
    <SafeAreaView className="flex-col gap-5">
      <Pressable
        className="flex-row items-center transition-opacity active:opacity-50"
        onPress={router.back}
      >
        <ChevronLeft color={colors.blue[500]} size={30} />
        <Text className="text-xl text-blue-500">Back</Text>
      </Pressable>

      <Text className={'px-4 text-4xl font-bold text-black dark:text-white'}>Settings</Text>

      <View className="gap-3">
        <Pressable
          className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4 transition-colors duration-300 active:bg-zinc-200 dark:bg-zinc-800 dark:active:bg-zinc-700"
          onPress={() => {
            router.push('/appearance');
          }}
        >
          <View className="flex-row gap-2">
            <Sun color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
            <Text className="text-xl text-zinc-900 dark:text-zinc-200">Appearance</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-500">System</Text>
            <ChevronRight color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
          </View>
        </Pressable>

        <Pressable
          className="mx-2 flex-row items-center justify-between rounded-lg bg-white p-4 transition-colors duration-300 active:bg-zinc-200 dark:bg-zinc-800 dark:active:bg-zinc-700"
          onPress={() => {
            router.push('/precision');
          }}
        >
          <View className="flex-row gap-2">
            <Hash color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
            <Text className="text-xl text-zinc-900 dark:text-zinc-200">Precision</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text text-xl text-zinc-500">
              {precision !== 1 ? `${precision} decimal points` : '1 decimal point'}
            </Text>
            <ChevronRight color={colorScheme === 'dark' ? colors.zinc[200] : colors.zinc[400]} />
          </View>
        </Pressable>

        <Pressable
          className="mx-2 flex-row items-center justify-center gap-2 rounded-lg bg-white p-4
           dark:bg-zinc-800 dark:active:bg-zinc-700"
          onPress={() => {
            Alert.alert('Clear data', 'Are you sure you want to clear all data?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Clear',
                style: 'destructive',
                onPress: () => {
                  AsyncStorage.setItem('inputs', '[""]');
                  router.navigate('/');
                },
              },
            ]);
          }}
        >
          <Text className="text-center text-xl text-red-500">Clear Data</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default SettingsPage;
