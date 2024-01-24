import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, View, useColorScheme } from 'react-native';
import { twMerge } from 'tailwind-merge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Props } from '.';
import { evaluate } from '../lib/evaluate';

export function HomeScreen({}: Props) {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<string[]>([]);

  const mode = useColorScheme();
  StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content');

  useEffect(() => {
    AsyncStorage.getItem('input').then((value) => setInput(value ?? ''));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('input', input);
  }, [input]);

  useEffect(() => {
    const lines = input.split('\n');
    const perLineOutput = [];

    for (const line of lines) {
      perLineOutput.push(line === '' ? ' ' : evaluate(line.trim())); // where the magic will happen
    }

    setOutputs(perLineOutput);
  }, [input]);

  return (
    <SafeAreaView
      className={twMerge('min-h-screen', mode === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100')}
    >
      <Text
        className={twMerge(
          'text-center text-xl',
          mode === 'dark' ? 'text-zinc-500' : 'text-zinc-900',
        )}
      >
        Rical
      </Text>

      <View>
        <View className="flex-row justify-between">
          <TextInput
            className={twMerge(
              'font-jetBrainsMono flex-1 px-3 text-2xl',
              mode === 'dark' ? 'text-white' : 'text-black',
            )}
            multiline
            value={input}
            onChangeText={setInput}
          />

          <View>
            {outputs.map((output, index) => (
              <Text className="font-jetBrainsMono px-3 text-2xl text-lime-500" key={index}>
                {output}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
