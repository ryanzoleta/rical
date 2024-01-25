import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, View, useColorScheme } from 'react-native';
import { twMerge } from 'tailwind-merge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Props } from '.';
import { evaluate, isAssignment } from '../lib/evaluate';
import { Variable, Result } from '../lib/types';

export function HomeScreen({}: Props) {
  const [inputList, setInputList] = useState(['']);
  const [outputs, setOutputs] = useState<Result[]>([]);
  const [formattedInputList, setFormattedInputList] = useState<ReactNode[][]>([]);
  // const [loaded, setLoaded] = useState(false);

  const secondToTheLastInput = useRef<TextInput | null>(null);

  const mode = useColorScheme();
  StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content');

  // useEffect(() => {
  //   AsyncStorage.getItem('inputList').then((value) => setInputList(JSON.parse(value ?? '[""]')));
  //   setLoaded(true);
  // }, []);

  // useEffect(() => {
  //   if (loaded) AsyncStorage.setItem('inputList', JSON.stringify(inputList));
  // }, [inputList]);

  useEffect(() => {
    console.log(JSON.stringify(inputList));

    const perLineOutput: Result[] = [];
    const variables: Variable[] = [];

    for (const input of inputList) {
      let result;

      if (input === '') {
        result = { raw: ' ', formatted: ' ' };
      } else if (isAssignment(input)) {
        result = evaluate(input.split('=')[1].trim(), variables);
        variables.push({ name: input.split('=')[0].trim(), value: result.raw });
      } else {
        result = evaluate(input.trim(), variables);
      }

      perLineOutput.push(result);
    }

    setOutputs(perLineOutput);
  }, [inputList]);

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
            {inputList.map((input, index) => (
              <TextInput
                key={index}
                ref={index === inputList.length - 2 ? secondToTheLastInput : null}
                className={twMerge(
                  'font-jetBrainsMono px-3 text-2xl',
                  mode === 'dark' ? 'text-white' : 'text-black',
                )}
                autoFocus
                onSubmitEditing={() => {
                  setInputList([...inputList, '']);
                }}
                onKeyPress={(event) => {
                  if (event.nativeEvent.key === 'Backspace') {
                    if (inputList[index] === '' && inputList.length > 1) {
                      setInputList(inputList.slice(0, -1));
                      if (secondToTheLastInput.current) {
                        secondToTheLastInput.current.focus();
                      }
                    }
                  }
                }}
                onChangeText={(text) => {
                  const newInputList = [...inputList];
                  newInputList[index] = text;
                  setInputList(newInputList);

                  const formattedInputLines = [];

                  const lines = text.split('\n');

                  for (const line of lines) {
                    if (isAssignment(line)) {
                      const tokens = line.split('=');
                      formattedInputLines.push(<Text className="text-blue-500">{tokens[0]}=</Text>);
                      formattedInputLines.push(<Text>{tokens[1]}</Text>);
                    } else {
                      formattedInputLines.push(line);
                    }
                  }

                  const originalFormattedInputList = formattedInputList;
                  originalFormattedInputList[index] = formattedInputLines;

                  setFormattedInputList(originalFormattedInputList);
                }}
              >
                <Text>{formattedInputList[index]}</Text>
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
