import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  children: ReactNode | ReactNode[];
  defaultBackgrounrColor?: string;
  highlightBackgroundColor?: string;
  className?: string;
  onPress: () => void;
};

function PressableBackground(props: Props) {
  const backgroundColor = useSharedValue(props.defaultBackgrounrColor ?? 'white');

  const handlePressIn = () => {
    backgroundColor.value = withSpring(props.highlightBackgroundColor ?? 'white');
  };

  const handlePressOut = () => {
    backgroundColor.value = withSpring(props.defaultBackgrounrColor ?? 'white');
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={props.onPress}
      style={{ backgroundColor }}
      className={props.className}
    >
      {props.children}
    </AnimatedPressable>
  );
}

export default PressableBackground;
