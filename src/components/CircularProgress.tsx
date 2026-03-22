import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  colorEnd?: string;
  label: string;
  unit?: string;
  showChevron?: boolean;
  animationDelay?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  maxValue = 100,
  size = 100,
  strokeWidth = 6,
  color,
  colorEnd,
  label,
  unit = '%',
  showChevron = true,
  animationDelay = 0,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / maxValue, 1);
  const targetOffset = circumference * (1 - percentage);
  const gradientId = `grad-${label.replace(/\s/g, '')}`;

  const animatedOffset = useRef(new Animated.Value(circumference)).current;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    // Animate ring fill
    const ringAnim = Animated.timing(animatedOffset, {
      toValue: targetOffset,
      duration: 1200,
      delay: animationDelay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    // Animate number count-up
    const numberAnim = Animated.timing(animatedValue, {
      toValue: value,
      duration: 1200,
      delay: animationDelay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    const listener = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    Animated.parallel([ringAnim, numberAnim]).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, targetOffset, animationDelay]);

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={color} />
              <Stop offset="100%" stopColor={colorEnd || color} />
            </LinearGradient>
          </Defs>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.cardBackgroundLight}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
        </Svg>
        <View style={[styles.valueContainer, { width: size, height: size }]}>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {displayValue}
          </Text>
          {unit === '%' && <Text style={[styles.unit, { color }]}>%</Text>}
        </View>
      </View>
      <Text style={styles.label}>
        {label} {showChevron ? '›' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  valueContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
