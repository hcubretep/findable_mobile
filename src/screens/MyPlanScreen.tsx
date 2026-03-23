import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { SubtleWaves } from '../components/WaveBackground';
import { Sparkline } from '../components/Sparkline';

// Plan goals data
const goals = [
  {
    title: 'Reach 80+ Visibility Score',
    current: 73,
    target: 80,
    unit: '',
    color: colors.visibility,
    trend: [58, 61, 64, 67, 65, 70, 73],
  },
  {
    title: 'Get cited in 60+ AI responses/week',
    current: 47,
    target: 60,
    unit: '',
    color: colors.citations,
    trend: [32, 35, 38, 41, 39, 44, 47],
  },
  {
    title: 'Maintain 80+ Sentiment Score',
    current: 82,
    target: 80,
    unit: '',
    color: colors.sentiment,
    trend: [78, 76, 80, 79, 83, 81, 82],
    completed: true,
  },
  {
    title: 'Appear on 5+ AI platforms',
    current: 4,
    target: 5,
    unit: ' platforms',
    color: colors.primary,
    trend: [2, 2, 3, 3, 3, 4, 4],
  },
];

const milestones = [
  { date: 'Mar 18', event: 'Hit 70 Visibility Score', icon: '🎯', color: colors.visibility },
  { date: 'Mar 20', event: 'First citation on Gemini', icon: '💎', color: colors.amber },
  { date: 'Mar 21', event: '2 actions completed in one day', icon: '⚡', color: colors.teal },
  { date: 'Mar 22', event: 'Sentiment score above 80 for 3 days', icon: '🌊', color: colors.sentiment },
];

const GoalCard: React.FC<{
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  trend: number[];
  completed?: boolean;
}> = ({ title, current, target, unit, color, trend, completed = false }) => {
  const progress = Math.min(current / target, 1);

  return (
    <View style={[styles.goalCard, completed && { borderColor: color + '30' }]}>
      <View style={styles.goalHeader}>
        <View style={styles.goalInfo}>
          <Text style={styles.goalTitle}>{title}</Text>
          <View style={styles.goalValueRow}>
            <Text style={[styles.goalCurrent, { color }]}>{current}{unit}</Text>
            <Text style={styles.goalSeparator}>/</Text>
            <Text style={styles.goalTarget}>{target}{unit}</Text>
          </View>
        </View>
        <Sparkline data={trend} color={color} width={70} height={28} showDot showFill={false} />
      </View>
      <View style={styles.goalBar}>
        <View style={[styles.goalBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
      {completed && (
        <View style={[styles.completedBadge, { backgroundColor: color + '15' }]}>
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path d="M3 6L5 8.5L9 3.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          </Svg>
          <Text style={[styles.completedText, { color }]}>Goal reached!</Text>
        </View>
      )}
    </View>
  );
};

const MilestoneItem: React.FC<{
  date: string;
  event: string;
  icon: string;
  color: string;
  isLast?: boolean;
}> = ({ date, event, icon, color, isLast = false }) => (
  <View style={styles.milestoneItem}>
    <View style={styles.milestoneTimeline}>
      <View style={[styles.milestoneDot, { backgroundColor: color }]} />
      {!isLast && <View style={styles.milestoneLine} />}
    </View>
    <View style={styles.milestoneContent}>
      <Text style={styles.milestoneDate}>{date}</Text>
      <View style={styles.milestoneEvent}>
        <Text style={styles.milestoneIcon}>{icon}</Text>
        <Text style={styles.milestoneText}>{event}</Text>
      </View>
    </View>
  </View>
);

export const MyPlanScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const completedGoals = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length;
  const overallProgress = Math.round(
    goals.reduce((sum, g) => sum + Math.min(g.current / g.target, 1), 0) / totalGoals * 100
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SubtleWaves top={200} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Your Plan</Text>
        <Text style={styles.screenSubtitle}>Weekly visibility goals & progress</Text>

        {/* Overall progress */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewTop}>
            <View>
              <Text style={styles.overviewLabel}>WEEKLY PROGRESS</Text>
              <View style={styles.overviewValueRow}>
                <Text style={styles.overviewValue}>{overallProgress}%</Text>
                <Text style={styles.overviewMeta}>{completedGoals}/{totalGoals} goals hit</Text>
              </View>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>5 day streak</Text>
            </View>
          </View>
          <View style={styles.overviewBar}>
            <View style={[styles.overviewBarFill, { width: `${overallProgress}%` }]} />
          </View>
          <Text style={styles.overviewHint}>
            3 days left to hit your weekly targets
          </Text>
        </View>

        {/* Goals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>GOALS</Text>
          <TouchableOpacity>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {goals.map((goal) => (
          <GoalCard key={goal.title} {...goal} />
        ))}

        {/* What to do next */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>RECOMMENDED NEXT STEPS</Text>
        </View>

        <View style={styles.nextStepCard}>
          <View style={styles.nextStepIcon}>
            <Text style={styles.nextStepEmoji}>🎯</Text>
          </View>
          <View style={styles.nextStepContent}>
            <Text style={styles.nextStepTitle}>To reach 80 Visibility</Text>
            <Text style={styles.nextStepDesc}>
              You need +7 points. Publishing 2 more optimized pages and earning 1 third-party mention should get you there.
            </Text>
            <TouchableOpacity style={styles.nextStepAction}>
              <Text style={styles.nextStepActionText}>See content suggestions →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.nextStepCard}>
          <View style={styles.nextStepIcon}>
            <Text style={styles.nextStepEmoji}>💎</Text>
          </View>
          <View style={styles.nextStepContent}>
            <Text style={styles.nextStepTitle}>To appear on Grok (5th platform)</Text>
            <Text style={styles.nextStepDesc}>
              Grok relies heavily on X/Twitter signals. Post 3 authoritative threads about AI SEO this week.
            </Text>
            <TouchableOpacity style={styles.nextStepAction}>
              <Text style={styles.nextStepActionText}>Draft X threads →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Milestones */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>THIS WEEK'S MILESTONES</Text>
        </View>

        <View style={styles.milestonesCard}>
          {milestones.map((m, i) => (
            <MilestoneItem key={m.event} {...m} isLast={i === milestones.length - 1} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  screenSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Overview card
  overviewCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  overviewLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  overviewValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  overviewValue: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
  },
  overviewMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.amber + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    color: colors.amber,
    fontSize: 11,
    fontWeight: '700',
  },
  overviewBar: {
    height: 8,
    backgroundColor: colors.surfaceHover,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  overviewBarFill: {
    height: '100%',
    backgroundColor: colors.teal,
    borderRadius: 4,
  },
  overviewHint: {
    color: colors.textMuted,
    fontSize: 12,
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  editButton: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Goal cards
  goalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalInfo: {
    flex: 1,
    marginRight: 12,
  },
  goalTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  goalCurrent: {
    fontSize: 20,
    fontWeight: '800',
  },
  goalSeparator: {
    color: colors.textMuted,
    fontSize: 14,
  },
  goalTarget: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  goalBar: {
    height: 4,
    backgroundColor: colors.surfaceHover,
    borderRadius: 2,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Next steps
  nextStepCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  nextStepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextStepEmoji: {
    fontSize: 20,
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  nextStepDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  nextStepAction: {},
  nextStepActionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // Milestones
  milestonesCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  milestoneItem: {
    flexDirection: 'row',
  },
  milestoneTimeline: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  milestoneDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  milestoneLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.surfaceHover,
    marginVertical: 4,
  },
  milestoneContent: {
    flex: 1,
    paddingBottom: 16,
  },
  milestoneDate: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  milestoneEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneIcon: {
    fontSize: 16,
  },
  milestoneText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
