import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { WaveBackground } from '../components/WaveBackground';
import { OrcaAvatar } from '../components/OrcaIcon';
import { Sparkline, MiniSparkline } from '../components/Sparkline';
import { CompetitorCard } from '../components/CompetitorCard';
import { competitors, trends } from '../data/mockData';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Morning Score Ring ---
const SCORE = 73;
const SCORE_STATUS = 'yellow' as 'green' | 'yellow' | 'red';
const SCORE_COLOR = {
  green: colors.teal,
  yellow: colors.amber,
  red: colors.coral,
};
const SCORE_LABEL = {
  green: 'Strong',
  yellow: 'Moderate',
  red: 'Needs Attention',
};
const SCORE_SUMMARY = {
  green: 'Your brand is highly visible across AI platforms. Keep it up.',
  yellow: 'ChatGPT mentions up 23%, but Claude dropped you from 2 queries overnight. Worth a look.',
  red: 'Significant visibility drop detected across multiple AI platforms. Take action today.',
};

const ScoreRing: React.FC = () => {
  const size = 220;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - SCORE / 100);

  const animatedOffset = useRef(new Animated.Value(circumference)).current;
  const animatedNum = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(animatedOffset, {
        toValue: targetOffset,
        duration: 1800,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedNum, {
        toValue: SCORE,
        duration: 1800,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    const listener = animatedNum.addListener(({ value }) => setDisplayValue(Math.round(value)));
    return () => animatedNum.removeListener(listener);
  }, []);

  const statusColor = SCORE_COLOR[SCORE_STATUS];

  return (
    <Animated.View style={[styles.scoreRingContainer, { opacity: fadeIn }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={statusColor} />
            <Stop offset="100%" stopColor={statusColor} stopOpacity={0.5} />
          </LinearGradient>
        </Defs>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.cardBackgroundLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Glow track (subtle) */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={statusColor}
          strokeWidth={strokeWidth + 8}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          opacity={0.1}
        />
        {/* Main arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      {/* Center content */}
      <View style={styles.scoreCenter}>
        <Text style={styles.scoreGreeting}>Good morning</Text>
        <View style={styles.scoreValueRow}>
          <Text style={[styles.scoreValue, { color: statusColor }]}>{displayValue}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusColor + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusLabel, { color: statusColor }]}>{SCORE_LABEL[SCORE_STATUS]}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// --- Sub-metrics row ---
const SubMetric: React.FC<{
  label: string;
  value: number;
  change: string;
  positive: boolean;
  color: string;
  delay: number;
}> = ({ label, value, change, positive, color, delay }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 500, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.subMetric, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
      <View style={[styles.subMetricDot, { backgroundColor: color }]} />
      <Text style={styles.subMetricValue}>{value}</Text>
      <Text style={styles.subMetricLabel}>{label}</Text>
      <Text style={[styles.subMetricChange, { color: positive ? colors.teal : colors.coral }]}>{change}</Text>
    </Animated.View>
  );
};

// --- Daily Action Item ---
const ActionItem: React.FC<{
  priority: number;
  title: string;
  impact: string;
  impactColor: string;
  icon: string;
  done?: boolean;
}> = ({ priority, title, impact, impactColor, icon, done = false }) => (
  <TouchableOpacity
    style={[styles.actionItem, done && styles.actionItemDone]}
    activeOpacity={0.7}
  >
    <View style={[styles.actionPriority, { backgroundColor: done ? colors.teal + '20' : colors.primary + '15' }]}>
      {done ? (
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Path d="M4 8L7 11L12 5" stroke={colors.teal} strokeWidth={2} strokeLinecap="round" fill="none" />
        </Svg>
      ) : (
        <Text style={styles.actionPriorityText}>{priority}</Text>
      )}
    </View>
    <View style={styles.actionContent}>
      <Text style={[styles.actionTitle, done && styles.actionTitleDone]}>{title}</Text>
      <View style={styles.actionMeta}>
        <View style={[styles.impactBadge, { backgroundColor: impactColor + '15' }]}>
          <Text style={[styles.impactText, { color: impactColor }]}>{impact}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.actionIcon}>{icon}</Text>
  </TouchableOpacity>
);

// --- Citation Notification ---
const CitationNotif: React.FC<{
  platform: string;
  emoji: string;
  query: string;
  position: number;
  time: string;
  color: string;
  isNew?: boolean;
}> = ({ platform, emoji, query, position, time, color, isNew = false }) => (
  <TouchableOpacity style={styles.citationNotif} activeOpacity={0.7}>
    <View style={[styles.citationIcon, { backgroundColor: color + '15' }]}>
      <Text style={styles.citationEmoji}>{emoji}</Text>
    </View>
    <View style={styles.citationContent}>
      <View style={styles.citationHeader}>
        <Text style={styles.citationPlatform}>{platform}</Text>
        {isNew && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>NEW</Text>
          </View>
        )}
        <Text style={styles.citationTime}>{time}</Text>
      </View>
      <Text style={styles.citationQuery} numberOfLines={1}>"{query}"</Text>
      <Text style={styles.citationPosition}>
        Position <Text style={{ color: position <= 3 ? colors.teal : colors.textSecondary, fontWeight: '700' }}>#{position}</Text>
      </Text>
    </View>
  </TouchableOpacity>
);

// --- Main Screen ---
export const MorningScoreScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <WaveBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <OrcaAvatar size={36} />
          <View style={styles.dateChip}>
            <Text style={styles.dateText}>TODAY</Text>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Path d="M10 2C7 2 5 4.5 5 7V11L3 14H17L15 11V7C15 4.5 13 2 10 2Z" stroke={colors.textSecondary} strokeWidth={1.5} fill="none" />
              <Path d="M8 14V15C8 16.1 9 17 10 17C11 17 12 16.1 12 15V14" stroke={colors.textSecondary} strokeWidth={1.5} fill="none" />
            </Svg>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Score Ring */}
        <ScoreRing />

        {/* Briefing text */}
        <View style={styles.briefingCard}>
          <Text style={styles.briefingText}>{SCORE_SUMMARY[SCORE_STATUS]}</Text>
        </View>

        {/* Sub-metrics */}
        <View style={styles.subMetricsRow}>
          <SubMetric label="Visibility" value={73} change="+8%" positive color={colors.visibility} delay={800} />
          <SubMetric label="Sentiment" value={82} change="+3" positive color={colors.sentiment} delay={950} />
          <SubMetric label="Citations" value={47} change="+15" positive color={colors.citations} delay={1100} />
        </View>

        {/* Sparkline trends */}
        <View style={styles.sparklineRow}>
          <View style={styles.sparklineCard}>
            <Sparkline data={trends.visibility} color={colors.visibility} width={90} height={28} label="7D" showDot={false} />
          </View>
          <View style={styles.sparklineCard}>
            <Sparkline data={trends.sentiment} color={colors.sentiment} width={90} height={28} label="7D" showDot={false} />
          </View>
          <View style={styles.sparklineCard}>
            <Sparkline data={trends.citations} color={colors.citations} width={90} height={28} label="7D" showDot={false} />
          </View>
        </View>

        {/* === TODAY'S ACTIONS === */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today's Actions</Text>
            <Text style={styles.sectionSubtitle}>3 things to improve your score</Text>
          </View>
          <View style={styles.actionProgress}>
            <Text style={styles.actionProgressText}>1/3</Text>
          </View>
        </View>

        <ActionItem
          priority={1}
          title="Add schema markup to /pricing"
          impact="HIGH IMPACT"
          impactColor={colors.coral}
          icon="🔧"
          done
        />
        <ActionItem
          priority={2}
          title="Publish FAQ: 'How does findable track AI citations?'"
          impact="CITATION GAP"
          impactColor={colors.amber}
          icon="✍️"
        />
        <ActionItem
          priority={3}
          title="Update comparison page — Semrush overtook you on 'AI SEO tools'"
          impact="COMPETITOR"
          impactColor={colors.primary}
          icon="⚔️"
        />

        {/* === LIVE CITATIONS === */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <View>
            <Text style={styles.sectionTitle}>Citation Feed</Text>
            <Text style={styles.sectionSubtitle}>Recent AI mentions of your brand</Text>
          </View>
          <View style={styles.livePulse}>
            <View style={styles.livePulseDot} />
            <Text style={styles.livePulseText}>LIVE</Text>
          </View>
        </View>

        <CitationNotif
          platform="ChatGPT"
          emoji="🤖"
          query="best AI SEO tools for startups"
          position={2}
          time="12m ago"
          color={colors.teal}
          isNew
        />
        <CitationNotif
          platform="Claude"
          emoji="🟣"
          query="how to monitor brand visibility in AI"
          position={1}
          time="34m ago"
          color={colors.primary}
          isNew
        />
        <CitationNotif
          platform="Perplexity"
          emoji="🔍"
          query="findable vs semrush comparison"
          position={1}
          time="1h ago"
          color={colors.coral}
        />
        <CitationNotif
          platform="Gemini"
          emoji="💎"
          query="AI search optimization platforms"
          position={4}
          time="2h ago"
          color={colors.amber}
        />
        <CitationNotif
          platform="ChatGPT"
          emoji="🤖"
          query="GEO tools for B2B marketers"
          position={3}
          time="3h ago"
          color={colors.teal}
        />

        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all 47 citations this week →</Text>
        </TouchableOpacity>

        {/* === COMPETITOR PULSE === */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <View>
            <Text style={styles.sectionTitle}>Competitor Pulse</Text>
            <Text style={styles.sectionSubtitle}>Your AI visibility ranking</Text>
          </View>
        </View>

        <CompetitorCard competitors={competitors} />

        {/* === WEEKLY DIGEST PREVIEW === */}
        <View style={styles.digestCard}>
          <View style={styles.digestHeader}>
            <Text style={styles.digestEmoji}>🐋</Text>
            <View>
              <Text style={styles.digestTitle}>This Week's Highlights</Text>
              <Text style={styles.digestSubtitle}>Mar 17 – Mar 23</Text>
            </View>
          </View>
          <View style={styles.digestGrid}>
            <View style={styles.digestStat}>
              <Text style={styles.digestStatValue}>+28</Text>
              <Text style={styles.digestStatLabel}>New citations</Text>
            </View>
            <View style={styles.digestStat}>
              <Text style={styles.digestStatValue}>+23%</Text>
              <Text style={styles.digestStatLabel}>Mention growth</Text>
            </View>
            <View style={styles.digestStat}>
              <Text style={styles.digestStatValue}>#2</Text>
              <Text style={styles.digestStatLabel}>Top query rank</Text>
            </View>
            <View style={styles.digestStat}>
              <Text style={styles.digestStatValue}>4</Text>
              <Text style={styles.digestStatLabel}>Platforms citing you</Text>
            </View>
          </View>
          <View style={styles.digestHighlight}>
            <Text style={styles.digestHighlightText}>
              🎯 Biggest win: You moved from #5 to #2 for "AI SEO tools" on ChatGPT
            </Text>
          </View>
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
    paddingTop: 56,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  dateChip: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  notifButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: colors.background,
  },

  // Score Ring
  scoreRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreGreeting: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Briefing
  briefingCard: {
    marginHorizontal: 30,
    marginBottom: 20,
  },
  briefingText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Sub-metrics
  subMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  subMetric: {
    alignItems: 'center',
    gap: 3,
  },
  subMetricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  subMetricValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  subMetricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  subMetricChange: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Sparklines
  sparklineRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
  },
  sparklineCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  actionProgress: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  actionProgressText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // Action items
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  actionItemDone: {
    opacity: 0.6,
  },
  actionPriority: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionPriorityText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  actionTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  actionMeta: {
    flexDirection: 'row',
    gap: 6,
  },
  impactBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  impactText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionIcon: {
    fontSize: 20,
  },

  // Citation feed
  citationNotif: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  citationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  citationEmoji: {
    fontSize: 18,
  },
  citationContent: {
    flex: 1,
  },
  citationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  citationPlatform: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  citationTime: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: 'auto',
  },
  citationQuery: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  citationPosition: {
    color: colors.textMuted,
    fontSize: 11,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.teal + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.teal,
  },
  liveText: {
    color: colors.teal,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  livePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.teal + '10',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal,
  },
  livePulseText: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  viewAllButton: {
    marginHorizontal: 20,
    marginTop: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Weekly digest
  digestCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  digestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  digestEmoji: {
    fontSize: 32,
  },
  digestTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  digestSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  digestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  digestStat: {
    width: '47%',
    backgroundColor: colors.surfaceHover,
    borderRadius: 12,
    padding: 12,
  },
  digestStatValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  digestStatLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  digestHighlight: {
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    padding: 12,
  },
  digestHighlightText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
