import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  children: ReactNode | ReactNode[];
  className?: string;
  onPress: () => void;
};

function PressableOpacity(props: Props) {
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    opacity.value = withSpring(0.8);
  };

  const handlePressOut = () => {
    opacity.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={props.onPress}
      style={{ opacity }}
      className={props.className}
    >
      {props.children}
    </AnimatedPressable>
  );
}

export default PressableOpacity;
