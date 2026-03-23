import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';
import { MorningScoreScreen } from './src/screens/MorningScoreScreen';
import { MyDayScreen } from './src/screens/MyDayScreen';
import { KeywordDetailScreen } from './src/screens/KeywordDetailScreen';
import { MyPlanScreen } from './src/screens/MyPlanScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

// --- Tab Icons ---
const ScoreIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} fill="none" />
    <Path d="M12 7V12L15.5 14" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
  </Svg>
);

const MentionsIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} fill="none" />
    <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.8} fill="none" />
    <Path d="M16 12V14C16 16 18 17 20 16" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
  </Svg>
);

const CitationsIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M5 4H15L19 8V20H5V4Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    <Path d="M15 4V8H19" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    <Path d="M8 13H16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M8 16H13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const PlanIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M8 4L8 8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M16 4L16 8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M4 10H20V20H4V10Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    <Path d="M4 10V7C4 6 5 5 6 5H18C19 5 20 6 20 7V10" stroke={color} strokeWidth={1.8} fill="none" />
    <Path d="M9 14L11 16L15 12" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
  </Svg>
);

const OrcaTabIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.orcaTab, focused && styles.orcaTabActive]}>
    <Svg width={24} height={24} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="18" fill={focused ? colors.primary : '#1A2D4D'} />
      <G transform="translate(6, 6)">
        <Path
          d="M14,4 Q22,4 24,12 Q26,18 22,22 Q18,26 14,26 Q8,26 6,20 Q4,14 6,10 Q8,4 14,4 Z"
          fill={focused ? '#0066CC' : '#111D33'}
        />
        <Path
          d="M10,16 Q10,12 14,12 Q18,12 20,16 Q20,22 16,24 Q12,24 10,20 Z"
          fill="#E8F4FD"
        />
        <Ellipse cx="18" cy="10" rx="3.5" ry="2.2" fill="#E8F4FD" />
        <Circle cx="18.5" cy="10" r="1.2" fill={focused ? '#0066CC' : '#111D33'} />
        <Circle cx="19" cy="9.5" r="0.4" fill="#FFFFFF" />
        <Path d="M14,4 Q15,0 17,2 Q16,4 16,6 Z" fill={focused ? '#0066CC' : '#111D33'} />
      </G>
    </Svg>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBarBackground,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 85,
            paddingBottom: 28,
            paddingTop: 10,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.3,
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Score"
          component={MorningScoreScreen}
          options={{
            tabBarIcon: ({ color, size }) => <ScoreIcon color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Mentions"
          component={MyDayScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MentionsIcon color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Orca"
          component={MorningScoreScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => <OrcaTabIcon focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Citations"
          component={KeywordDetailScreen}
          options={{
            tabBarIcon: ({ color, size }) => <CitationsIcon color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Plan"
          component={MyPlanScreen}
          options={{
            tabBarIcon: ({ color, size }) => <PlanIcon color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  orcaTab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: -12,
  },
  orcaTabActive: {
    borderColor: colors.primary + '60',
    backgroundColor: colors.primary + '15',
  },
});
