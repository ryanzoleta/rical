import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, View, useColorScheme } from 'react-native';
import { twMerge } from 'tailwind-merge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Props } from '.';
import { evaluate, isAssignment } from '../lib/evaluate';
import { Variable, Result } from '../lib/types';

export function HomeScreen({}: Props) {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<Result[]>([]);

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
    const perLineOutput: Result[] = [];
    const variables: Variable[] = [];

    for (const line of lines) {
      let result;

      if (line === '') {
        result = { raw: ' ', formatted: ' ' };
      } else if (isAssignment(line)) {
        result = evaluate(line.split('=')[1].trim(), variables);
        variables.push({ name: line.split('=')[0].trim(), value: result.raw });
      } else {
        result = evaluate(line.trim(), variables);
      }

      perLineOutput.push(result);
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
              <Text
                className="font-jetBrainsMono px-3 text-right text-2xl text-lime-500"
                key={index}
              >
                {output.formatted}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
