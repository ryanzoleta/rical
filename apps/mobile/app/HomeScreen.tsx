import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, View, useColorScheme } from 'react-native';
import { twMerge } from 'tailwind-merge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Props } from '.';
import { evaluate, isAssignment, isComment } from '../lib/evaluate';
import { Variable, Result } from '../lib/types';

function formatInput(text: string) {
  const texts = [];

  if (isAssignment(text)) {
    const tokens = text.split('=');
    texts.push(<Text className="text-blue-500">{tokens[0]}=</Text>);
    texts.push(<Text>{tokens[1]}</Text>);
  } else if (isComment(text)) {
    texts.push(<Text className="text-orange-500">{text}</Text>);
  } else {
    texts.push(text);
  }

  return texts;
}

export function HomeScreen({}: Props) {
  const [inputs, setInputs] = useState(['']);
  const [outputs, setOutputs] = useState<Result[]>([]);
  const [formattedInputs, setFormattedInputs] = useState<ReactNode[][]>([]);
  const [loaded, setLoaded] = useState(false);

  const secondToTheLastInput = useRef<TextInput | null>(null);

  const mode = useColorScheme();
  StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content');

  useEffect(() => {
    AsyncStorage.getItem('inputs').then((value) => {
      const list = JSON.parse(value ?? '[""]') as typeof inputs;
      setInputs(list);
      setFormattedInputs(list.map(formatInput));
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem('inputs', JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    const perLineOutput: Result[] = [];
    const variables: Variable[] = [];

    for (const input of inputs) {
      let result;

      if (input === '') {
        result = { raw: ' ', formatted: ' ', formatType: 'comment' } as Result;
      } else if (isAssignment(input)) {
        result = evaluate(input.split('=')[1].trim(), variables);
        variables.push({
          name: input.split('=')[0].trim(),
          value: result.raw,
          isCurrency: result.formatType === 'currency',
        });
      } else if (isComment(input)) {
        result = { raw: ' ', formatted: ' ', formatType: 'comment' } as Result;
      } else {
        result = evaluate(input.trim(), variables);
      }

      perLineOutput.push(result);
    }

    setOutputs(perLineOutput);
  }, [inputs]);

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
          <View className="flex-1">
            {inputs.map((input, index) => (
              <TextInput
                key={index}
                ref={index === inputs.length - 2 ? secondToTheLastInput : null}
                className={twMerge(
                  'font-jetBrainsMono px-3 text-2xl',
                  mode === 'dark' ? 'text-white' : 'text-black',
                )}
                autoFocus
                autoCapitalize="none"
                onSubmitEditing={() => {
                  setInputs([...inputs, '']);
                }}
                onKeyPress={(event) => {
                  if (
                    event.nativeEvent.key === 'Backspace' &&
                    inputs[index] === '' &&
                    inputs.length > 1
                  ) {
                    setInputs(inputs.slice(0, -1));
                    if (secondToTheLastInput.current) {
                      secondToTheLastInput.current.focus();
                    }
                  }
                }}
                onChangeText={(text) => {
                  setInputs([...inputs.slice(0, index), text, ...inputs.slice(index + 1)]);

                  setFormattedInputs([
                    ...formattedInputs.slice(0, index),
                    formatInput(text),
                    ...formattedInputs.slice(index + 1),
                  ]);
                }}
              >
                <Text>{formattedInputs[index]}</Text>
              </TextInput>
            ))}
          </View>

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
