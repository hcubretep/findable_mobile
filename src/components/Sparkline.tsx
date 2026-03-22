import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  showDot?: boolean;
  showFill?: boolean;
  label?: string;
  change?: string;
  changePositive?: boolean;
}

const buildPath = (data: number[], width: number, height: number, padding: number = 4): string => {
  if (data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (data.length - 1);

  const points = data.map((value, i) => ({
    x: padding + i * stepX,
    y: padding + (1 - (value - min) / range) * (height - padding * 2),
  }));

  // Build smooth curve using cubic bezier
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpx = (curr.x + next.x) / 2;
    path += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
};

const buildFillPath = (data: number[], width: number, height: number, padding: number = 4): string => {
  const linePath = buildPath(data, width, height, padding);
  if (!linePath) return '';
  const lastX = padding + (data.length - 1) * ((width - padding * 2) / (data.length - 1));
  return `${linePath} L ${lastX} ${height} L ${padding} ${height} Z`;
};

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  width = 120,
  height = 36,
  showDot = true,
  showFill = true,
  label,
  change,
  changePositive,
}) => {
  if (data.length < 2) return null;

  const linePath = buildPath(data, width, height);
  const fillPath = showFill ? buildFillPath(data, width, height) : '';
  const gradientId = `sparkFill_${Math.random().toString(36).slice(2)}`;

  // Last point position for dot
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const stepX = (width - padding * 2) / (data.length - 1);
  const lastPoint = {
    x: padding + (data.length - 1) * stepX,
    y: padding + (1 - (data[data.length - 1] - min) / range) * (height - padding * 2),
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {change && (
            <Text style={[styles.change, { color: changePositive ? colors.teal : colors.coral }]}>
              {change}
            </Text>
          )}
        </View>
      )}
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.25} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {showFill && fillPath && (
          <Path d={fillPath} fill={`url(#${gradientId})`} />
        )}
        <Path d={linePath} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
        {showDot && (
          <>
            <Circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill={color} opacity={0.3} />
            <Circle cx={lastPoint.x} cy={lastPoint.y} r={2.5} fill={color} />
          </>
        )}
      </Svg>
    </View>
  );
};

// Compact sparkline for use inside metric cards
export const MiniSparkline: React.FC<{
  data: number[];
  color: string;
  width?: number;
  height?: number;
}> = ({ data, color, width = 60, height = 24 }) => {
  if (data.length < 2) return null;
  const linePath = buildPath(data, width, height, 2);

  return (
    <Svg width={width} height={height}>
      <Path d={linePath} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {},
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  change: {
    fontSize: 11,
    fontWeight: '700',
  },
});
