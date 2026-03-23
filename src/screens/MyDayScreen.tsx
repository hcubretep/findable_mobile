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
import { PlatformPill } from '../components/SectionHeader';
import { SubtleWaves } from '../components/WaveBackground';
import { MiniSparkline, Sparkline } from '../components/Sparkline';
import { platformTrends } from '../data/mockData';

// Mentions over time chart data
const totalMentions7d = [15, 22, 18, 28, 25, 33, 28];

// Top mentioned content
const topContent = [
  { title: '/blog/ai-seo-guide', mentions: 14, platform: 'ChatGPT', change: '+6', positive: true },
  { title: '/pricing', mentions: 9, platform: 'Claude', change: '+3', positive: true },
  { title: '/vs/semrush', mentions: 7, platform: 'Perplexity', change: '-1', positive: false },
  { title: '/features', mentions: 5, platform: 'Gemini', change: '+2', positive: true },
];

const platformColors: Record<string, string> = {
  ChatGPT: colors.teal,
  Claude: colors.primary,
  Gemini: colors.amber,
  Perplexity: colors.coral,
};

const ContentRow: React.FC<{
  title: string;
  mentions: number;
  platform: string;
  change: string;
  positive: boolean;
}> = ({ title, mentions, platform, change, positive }) => (
  <TouchableOpacity style={styles.contentRow} activeOpacity={0.7}>
    <View style={styles.contentInfo}>
      <Text style={styles.contentTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.contentMeta}>
        <View style={[styles.platformDot, { backgroundColor: platformColors[platform] || colors.textMuted }]} />
        <Text style={styles.contentPlatform}>Most cited on {platform}</Text>
      </View>
    </View>
    <View style={styles.contentStats}>
      <Text style={styles.contentMentions}>{mentions}</Text>
      <Text style={[styles.contentChange, { color: positive ? colors.teal : colors.coral }]}>{change}</Text>
    </View>
  </TouchableOpacity>
);

export const MyDayScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const totalToday = 28;
  const totalYesterday = 25;
  const changePercent = Math.round(((totalToday - totalYesterday) / totalYesterday) * 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SubtleWaves top={300} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Mentions</Text>
        <Text style={styles.screenSubtitle}>How AI platforms talk about your brand</Text>

        {/* Today's total */}
        <View style={styles.todayCard}>
          <View style={styles.todayLeft}>
            <Text style={styles.todayLabel}>TODAY'S MENTIONS</Text>
            <View style={styles.todayValueRow}>
              <Text style={styles.todayValue}>{totalToday}</Text>
              <Text style={[styles.todayChange, { color: changePercent >= 0 ? colors.teal : colors.coral }]}>
                {changePercent >= 0 ? '+' : ''}{changePercent}% vs yesterday
              </Text>
            </View>
          </View>
          <View style={styles.todayChart}>
            <Sparkline data={totalMentions7d} color={colors.primary} width={120} height={44} label="7 DAY TREND" />
          </View>
        </View>

        {/* Platform breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>BY PLATFORM</Text>
        </View>

        <PlatformPill
          icon="🤖"
          label="ChatGPT"
          time="12 mentions today"
          value="+23%"
          color={colors.teal}
          active
          sparkline={<MiniSparkline data={platformTrends.chatgpt} color={colors.teal} />}
        />
        <PlatformPill
          icon="🟣"
          label="Claude"
          time="8 mentions today"
          value="+15%"
          color={colors.primary}
          sparkline={<MiniSparkline data={platformTrends.claude} color={colors.primary} />}
        />
        <PlatformPill
          icon="💎"
          label="Gemini"
          time="5 mentions today"
          value="+8%"
          color={colors.amber}
          sparkline={<MiniSparkline data={platformTrends.gemini} color={colors.amber} />}
        />
        <PlatformPill
          icon="🔍"
          label="Perplexity"
          time="3 mentions today"
          value="-2%"
          color={colors.coral}
          sparkline={<MiniSparkline data={platformTrends.perplexity} color={colors.coral} />}
        />

        {/* Top cited content */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>TOP CITED CONTENT</Text>
          <Text style={styles.sectionAction}>This week</Text>
        </View>

        {topContent.map((item) => (
          <ContentRow key={item.title} {...item} />
        ))}

        {/* Sentiment snapshot */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>SENTIMENT SNAPSHOT</Text>
        </View>

        <View style={styles.sentimentCard}>
          <View style={styles.sentimentRow}>
            <View style={styles.sentimentItem}>
              <Text style={styles.sentimentEmoji}>😊</Text>
              <Text style={styles.sentimentValue}>76%</Text>
              <Text style={styles.sentimentLabel}>Positive</Text>
            </View>
            <View style={styles.sentimentItem}>
              <Text style={styles.sentimentEmoji}>😐</Text>
              <Text style={styles.sentimentValue}>20%</Text>
              <Text style={styles.sentimentLabel}>Neutral</Text>
            </View>
            <View style={styles.sentimentItem}>
              <Text style={styles.sentimentEmoji}>😟</Text>
              <Text style={styles.sentimentValue}>4%</Text>
              <Text style={styles.sentimentLabel}>Negative</Text>
            </View>
          </View>
          <View style={styles.sentimentBar}>
            <View style={[styles.sentimentFill, { width: '76%', backgroundColor: colors.teal }]} />
            <View style={[styles.sentimentFill, { width: '20%', backgroundColor: colors.textMuted }]} />
            <View style={[styles.sentimentFill, { width: '4%', backgroundColor: colors.coral }]} />
          </View>
          <Text style={styles.sentimentNote}>
            AI models describe findable as "innovative" and "comprehensive" most frequently
          </Text>
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

  // Today card
  todayCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayLeft: {
    flex: 1,
  },
  todayLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  todayValueRow: {
    gap: 4,
  },
  todayValue: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
  },
  todayChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  todayChart: {
    justifyContent: 'center',
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
  sectionAction: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },

  // Content rows
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platformDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  contentPlatform: {
    color: colors.textMuted,
    fontSize: 11,
  },
  contentStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  contentMentions: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  contentChange: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Sentiment
  sentimentCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sentimentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  sentimentItem: {
    alignItems: 'center',
    gap: 4,
  },
  sentimentEmoji: {
    fontSize: 24,
  },
  sentimentValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  sentimentLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sentimentBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
    gap: 2,
  },
  sentimentFill: {
    height: '100%',
    borderRadius: 3,
  },
  sentimentNote: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
  },
});
