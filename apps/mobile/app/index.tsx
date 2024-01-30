import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { evaluate, isAssignment, isComment } from '../lib/evaluate';
import { Variable, Result } from '../lib/types';
import { Calculator, Cog, Keyboard } from 'lucide-react-native';
import colors from 'tailwindcss/colors';

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

export default function HomeScreen() {
  const [inputs, setInputs] = useState(['']);
  const [outputs, setOutputs] = useState<Result[]>([]);
  const [formattedInputs, setFormattedInputs] = useState<ReactNode[][]>([]);
  const [precision, setPrecision] = useState(2);
  const [loaded, setLoaded] = useState(false);
  const [keyboardType, setKeyboardType] = useState<'numeric' | 'default'>('numeric');

  const secondToTheLastInput = useRef<TextInput | null>(null);
  const focusedTextInput = useRef<TextInput | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('inputs').then((value) => {
      const list = JSON.parse(value ?? '[""]') as typeof inputs;
      setInputs(list);
      setFormattedInputs(list.map(formatInput));
    });

    AsyncStorage.getItem('precision').then((value) => {
      setPrecision(parseInt(value ?? '2'));
    });

    navigation.addListener('focus', () => {
      AsyncStorage.getItem('precision').then((value) => {
        setPrecision(parseInt(value ?? '2'));
      });
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
        result = { raw: ' ', formatted: ' ' } as Result;
      } else if (isAssignment(input)) {
        result = evaluate(input.split('=')[1].trim(), variables, precision);
        variables.push({
          name: input.split('=')[0].trim(),
          value: result.raw,
        });
      } else if (isComment(input)) {
        result = { raw: ' ', formatted: ' ' } as Result;
      } else {
        result = evaluate(input.trim(), variables, precision);
      }

      perLineOutput.push(result);
    }

    setOutputs(perLineOutput);
  }, [inputs, precision]);

  useEffect(() => {
    if (focusedTextInput.current) {
      focusedTextInput.current.blur();
      focusedTextInput.current.focus();
    }
  }, [keyboardType]);

  return (
    <SafeAreaView className="min-h-screen">
      <View className="flex-row justify-between p-3">
        <Pressable
          onPress={() => {
            router.push('/settings');
          }}
        >
          <Cog color={colors.zinc[500]} />
        </Pressable>

        <Text className="text-center text-xl text-zinc-900 dark:text-zinc-500">Rical</Text>

        <Pressable
          onPress={() => {
            setKeyboardType(keyboardType === 'numeric' ? 'default' : 'numeric');
          }}
        >
          {keyboardType === 'numeric' ? (
            <Keyboard color={colors.zinc[500]} />
          ) : (
            <Calculator color={colors.zinc[500]} />
          )}
        </Pressable>
      </View>

      <View>
        <View className="flex-row justify-between">
          <View className="flex-1">
            {inputs.map((input, index) => (
              <TextInput
                key={index}
                ref={index === inputs.length - 2 ? secondToTheLastInput : null}
                className="font-jetBrainsMono px-3 text-lg text-zinc-900 dark:text-zinc-100"
                autoFocus
                autoCapitalize="none"
                keyboardType={keyboardType}
                onFocus={(event) => {
                  focusedTextInput.current = event.target as TextInput;
                }}
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
                className="font-jetBrainsMono px-3 text-right text-lg text-lime-500"
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
