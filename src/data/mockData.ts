// 7-day trend data for sparklines
export const trends = {
  visibility: [58, 61, 64, 67, 65, 70, 73],
  sentiment: [78, 76, 80, 79, 83, 81, 82],
  citations: [32, 35, 38, 41, 39, 44, 47],
  crawlerHealth: [100, 100, 96, 100, 100, 100, 100],
  coreVitals: [1.4, 1.3, 1.2, 1.3, 1.2, 1.2, 1.2],
};

// AI platform mention data (last 7 days)
export const platformTrends = {
  chatgpt: [6, 8, 7, 10, 9, 11, 12],
  claude: [3, 4, 5, 6, 5, 7, 8],
  gemini: [2, 2, 3, 3, 4, 4, 5],
  perplexity: [4, 3, 3, 4, 3, 3, 3],
};

// Competitor comparison data
export const competitors = [
  { name: 'findable', score: 73, trend: [58, 61, 64, 67, 65, 70, 73], isYou: true },
  { name: 'Semrush', score: 81, trend: [79, 78, 80, 79, 81, 80, 81], isYou: false },
  { name: 'Ahrefs', score: 77, trend: [72, 74, 73, 75, 76, 76, 77], isYou: false },
  { name: 'Moz', score: 62, trend: [65, 64, 63, 64, 62, 63, 62], isYou: false },
  { name: 'SE Ranking', score: 58, trend: [50, 52, 54, 55, 56, 57, 58], isYou: false },
];

// Weekly summary
export const weeklySummary = {
  newCitations: 28,
  citationsChange: '+12',
  newMentions: 47,
  mentionsChange: '+23%',
  topQuery: 'best AI SEO tools 2026',
  topPlatform: 'ChatGPT',
  visibilityChange: '+8%',
  sentimentChange: '+3',
};
