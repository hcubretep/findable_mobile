import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { MiniSparkline } from './Sparkline';

interface CompetitorData {
  name: string;
  score: number;
  trend: number[];
  isYou: boolean;
}

interface CompetitorCardProps {
  competitors: CompetitorData[];
  title?: string;
}

const RankBadge: React.FC<{ rank: number; isYou: boolean }> = ({ rank, isYou }) => (
  <View style={[styles.rankBadge, isYou && styles.rankBadgeYou]}>
    <Text style={[styles.rankText, isYou && styles.rankTextYou]}>#{rank}</Text>
  </View>
);

const BarFill: React.FC<{ score: number; color: string; maxScore: number }> = ({
  score,
  color,
  maxScore,
}) => (
  <View style={styles.barContainer}>
    <View style={[styles.barFill, { width: `${(score / maxScore) * 100}%`, backgroundColor: color }]} />
  </View>
);

export const CompetitorCard: React.FC<CompetitorCardProps> = ({
  competitors,
  title = 'AI Visibility Ranking',
}) => {
  const sorted = [...competitors].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...sorted.map((c) => c.score));
  const yourRank = sorted.findIndex((c) => c.isYou) + 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            You rank <Text style={styles.rankHighlight}>#{yourRank}</Text> of {sorted.length} in your category
          </Text>
        </View>
        <TouchableOpacity>
          <Svg width={18} height={18} viewBox="0 0 18 18">
            <Path d="M7 4L12 9L7 14" stroke={colors.textMuted} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {sorted.map((comp, index) => (
          <View
            key={comp.name}
            style={[styles.row, comp.isYou && styles.rowYou]}
          >
            <RankBadge rank={index + 1} isYou={comp.isYou} />
            <View style={styles.nameCol}>
              <Text style={[styles.name, comp.isYou && styles.nameYou]}>
                {comp.name}
                {comp.isYou && <Text style={styles.youBadge}> YOU</Text>}
              </Text>
              <BarFill
                score={comp.score}
                color={comp.isYou ? colors.primary : colors.textMuted + '40'}
                maxScore={maxScore}
              />
            </View>
            <MiniSparkline
              data={comp.trend}
              color={comp.isYou ? colors.primary : colors.textMuted}
              width={48}
              height={20}
            />
            <Text style={[styles.score, comp.isYou && { color: colors.primary }]}>
              {comp.score}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  rankHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  list: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 10,
  },
  rowYou: {
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeYou: {
    backgroundColor: colors.primary + '25',
  },
  rankText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  rankTextYou: {
    color: colors.primary,
  },
  nameCol: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  nameYou: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  youBadge: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  barContainer: {
    height: 3,
    backgroundColor: colors.surfaceHover,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  score: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
  },
});
