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
import { Sparkline, MiniSparkline } from '../components/Sparkline';
import { SubtleWaves } from '../components/WaveBackground';

// Mock keyword citation data
const keywordCitations = [
  {
    query: 'best AI SEO tools 2026',
    platforms: ['ChatGPT', 'Claude', 'Perplexity'],
    mentions: 18,
    trend: [8, 10, 12, 14, 13, 16, 18],
    position: 2,
    isNew: false,
  },
  {
    query: 'how to improve AI visibility',
    platforms: ['ChatGPT', 'Gemini'],
    mentions: 12,
    trend: [4, 5, 7, 8, 9, 10, 12],
    position: 1,
    isNew: false,
  },
  {
    query: 'findable vs semrush for AI',
    platforms: ['ChatGPT', 'Claude'],
    mentions: 8,
    trend: [0, 0, 2, 3, 5, 6, 8],
    position: 1,
    isNew: true,
  },
  {
    query: 'AI search optimization tools',
    platforms: ['Perplexity', 'Claude', 'Gemini'],
    mentions: 6,
    trend: [3, 4, 3, 5, 4, 5, 6],
    position: 4,
    isNew: false,
  },
  {
    query: 'brand monitoring in AI chatbots',
    platforms: ['ChatGPT'],
    mentions: 3,
    trend: [0, 1, 1, 2, 2, 2, 3],
    position: 6,
    isNew: true,
  },
];

const platformColors: Record<string, string> = {
  ChatGPT: colors.teal,
  Claude: colors.primary,
  Gemini: colors.amber,
  Perplexity: colors.coral,
};

const platformEmojis: Record<string, string> = {
  ChatGPT: '🤖',
  Claude: '🟣',
  Gemini: '💎',
  Perplexity: '🔍',
};

const PositionBadge: React.FC<{ position: number }> = ({ position }) => {
  const badgeColor = position <= 3 ? colors.teal : colors.textMuted;
  return (
    <View style={[styles.positionBadge, { borderColor: badgeColor + '40' }]}>
      <Text style={[styles.positionText, { color: badgeColor }]}>#{position}</Text>
    </View>
  );
};

const KeywordRow: React.FC<{
  query: string;
  platforms: string[];
  mentions: number;
  trend: number[];
  position: number;
  isNew: boolean;
}> = ({ query, platforms, mentions, trend, position, isNew }) => (
  <TouchableOpacity style={styles.keywordRow} activeOpacity={0.7}>
    <View style={styles.keywordMain}>
      <View style={styles.keywordHeader}>
        <Text style={styles.keywordQuery} numberOfLines={1}>
          {query}
        </Text>
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
      <View style={styles.platformTags}>
        {platforms.map((p) => (
          <View
            key={p}
            style={[styles.platformTag, { backgroundColor: (platformColors[p] || colors.textMuted) + '15' }]}
          >
            <Text style={styles.platformEmoji}>{platformEmojis[p] || '🔗'}</Text>
            <Text style={[styles.platformName, { color: platformColors[p] || colors.textMuted }]}>
              {p}
            </Text>
          </View>
        ))}
      </View>
    </View>
    <View style={styles.keywordRight}>
      <MiniSparkline data={trend} color={colors.primary} width={50} height={20} />
      <View style={styles.keywordStats}>
        <Text style={styles.mentionCount}>{mentions}</Text>
        <PositionBadge position={position} />
      </View>
    </View>
  </TouchableOpacity>
);

// Summary stats at top
const StatPill: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <View style={styles.statPill}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={[styles.statDot, { backgroundColor: color }]} />
  </View>
);

export const KeywordDetailScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const totalMentions = keywordCitations.reduce((sum, k) => sum + k.mentions, 0);
  const totalQueries = keywordCitations.length;
  const newThisWeek = keywordCitations.filter((k) => k.isNew).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SubtleWaves top={250} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Citations</Text>
        <Text style={styles.screenSubtitle}>Queries where AI models mention findable</Text>

        {/* Overall trend */}
        <View style={styles.trendCard}>
          <Sparkline
            data={[15, 20, 24, 32, 33, 39, 47]}
            color={colors.citations}
            width={280}
            height={60}
            label="TOTAL CITATIONS · 7 DAYS"
            change="+213%"
            changePositive
          />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatPill label="Citations" value={String(totalMentions)} color={colors.citations} />
          <StatPill label="Queries" value={String(totalQueries)} color={colors.primary} />
          <StatPill label="New" value={String(newThisWeek)} color={colors.teal} />
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TOP QUERIES</Text>
          <TouchableOpacity>
            <Text style={styles.sortLabel}>By mentions ↓</Text>
          </TouchableOpacity>
        </View>

        {/* Keyword list */}
        {keywordCitations.map((keyword) => (
          <KeywordRow key={keyword.query} {...keyword} />
        ))}

        {/* Hint card */}
        <View style={styles.hintCard}>
          <Text style={styles.hintEmoji}>🐋</Text>
          <View style={styles.hintContent}>
            <Text style={styles.hintTitle}>Deep Dive Tip</Text>
            <Text style={styles.hintText}>
              Tap any query to see the full AI response and how findable was mentioned in context.
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
  trendCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  statPill: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sortLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  keywordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keywordMain: {
    flex: 1,
    marginRight: 10,
  },
  keywordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  keywordQuery: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  newBadge: {
    backgroundColor: colors.teal + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: colors.teal,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  platformTags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  platformTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  platformEmoji: {
    fontSize: 10,
  },
  platformName: {
    fontSize: 10,
    fontWeight: '600',
  },
  keywordRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  keywordStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mentionCount: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  positionBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  positionText: {
    fontSize: 10,
    fontWeight: '700',
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    gap: 12,
  },
  hintEmoji: {
    fontSize: 28,
  },
  hintContent: {
    flex: 1,
  },
  hintTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  hintText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});
