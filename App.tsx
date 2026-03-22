import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { MyDayScreen } from './src/screens/MyDayScreen';
import { MyPlanScreen } from './src/screens/MyPlanScreen';
import { KeywordDetailScreen } from './src/screens/KeywordDetailScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

// Tab icons
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill={color === colors.primary ? color + '20' : 'none'}
    />
  </Svg>
);

const MentionsIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M21 12C21 7 17 3 12 3C7 3 3 7 3 12C3 17 7 21 12 21"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M12 8C10 8 8 10 8 12C8 14 10 16 12 16C14 16 16 14 16 12V8"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M16 16C17 17.5 18.5 18 20 17.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

const CitationsIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 6H14L18 10V20H4V6Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M14 6V10H18" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    <Path d="M7 13H15" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M7 16H12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx={18} cy={6} r={4} fill={color} opacity={0.2} />
    <Path d="M16.5 6L17.5 7L19.5 5" stroke={color} strokeWidth={1.2} strokeLinecap="round" fill="none" />
  </Svg>
);

const PlanIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 4H20V20H4V4Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M4 9H20" stroke={color} strokeWidth={1.8} />
    <Path d="M9 4V9" stroke={color} strokeWidth={1.8} />
    <Circle cx={8} cy={13} r={1} fill={color} />
    <Circle cx={12} cy={13} r={1} fill={color} />
    <Circle cx={8} cy={17} r={1} fill={color} />
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
          name="Home"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
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
        <Tab.Screen
          name="Orca"
          component={DashboardScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => <OrcaTabIcon focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  orcaTab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: -8,
  },
  orcaTabActive: {
    borderColor: colors.primary + '60',
    backgroundColor: colors.primary + '15',
  },
});
