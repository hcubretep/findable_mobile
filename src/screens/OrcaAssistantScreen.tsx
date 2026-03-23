import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, G, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Types ---
interface Message {
  id: string;
  type: 'user' | 'orca' | 'metric-card' | 'action-card' | 'typing';
  text?: string;
  card?: MetricCard | ActionCard;
  timestamp: string;
}

interface MetricCard {
  kind: 'metric';
  label: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
  sparkData?: number[];
}

interface ActionCard {
  kind: 'action';
  title: string;
  description: string;
  impact: string;
  impactColor: string;
}

// --- Suggested Questions ---
const suggestions = [
  'Why did my score drop?',
  'How do I get cited on Claude?',
  'What should I focus on today?',
  'Show me my best performing content',
  'How am I doing vs competitors?',
  'What queries mention us most?',
];

// --- Simulated responses ---
const getOrcaResponse = (question: string): Message[] => {
  const q = question.toLowerCase();
  const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (q.includes('score') && (q.includes('drop') || q.includes('down') || q.includes('lower'))) {
    return [
      {
        id: `orca-${Date.now()}`,
        type: 'orca',
        text: "Your score dipped from 76 to 73 overnight. Here's what happened:",
        timestamp: ts,
      },
      {
        id: `orca-detail-${Date.now()}`,
        type: 'orca',
        text: '🔻 Claude removed you from 2 queries: "best AI monitoring tools" and "SEO platform comparison". This is likely because your /comparison page hasn\'t been updated in 3 weeks — Claude weights content freshness heavily.',
        timestamp: ts,
      },
      {
        id: `orca-action-${Date.now()}`,
        type: 'action-card',
        card: {
          kind: 'action',
          title: 'Update /comparison page',
          description: 'Add 2026 data and refresh competitor sections. This should recover your Claude citations within 48-72 hours.',
          impact: 'HIGH IMPACT',
          impactColor: colors.coral,
        },
        timestamp: ts,
      },
    ];
  }

  if (q.includes('claude') && (q.includes('cited') || q.includes('get') || q.includes('appear'))) {
    return [
      {
        id: `orca-${Date.now()}`,
        type: 'orca',
        text: 'Claude currently cites you in 8 responses daily. To increase that:',
        timestamp: ts,
      },
      {
        id: `orca-tips-${Date.now()}`,
        type: 'orca',
        text: '1️⃣ **Freshness matters most** — Claude re-crawls weekly. Update your top pages every 2 weeks.\n\n2️⃣ **Third-party signals** — Claude heavily weights G2 reviews and Reddit mentions. You have 23 G2 reviews vs Semrush\'s 4,800.\n\n3️⃣ **Structured data** — Your /features page is missing FAQ schema. Adding it could unlock citation in question-format queries.',
        timestamp: ts,
      },
      {
        id: `orca-metric-${Date.now()}`,
        type: 'metric-card',
        card: {
          kind: 'metric',
          label: 'Claude Citations',
          value: '8',
          change: '+3 this week',
          positive: true,
          color: colors.primary,
          sparkData: [3, 4, 5, 6, 5, 7, 8],
        },
        timestamp: ts,
      },
    ];
  }

  if (q.includes('focus') || q.includes('today') || q.includes('should')) {
    return [
      {
        id: `orca-${Date.now()}`,
        type: 'orca',
        text: "Based on your current data, here's your priority stack for today:",
        timestamp: ts,
      },
      {
        id: `orca-action1-${Date.now()}`,
        type: 'action-card',
        card: {
          kind: 'action',
          title: '1. Add schema markup to /pricing',
          description: 'AI crawlers can\'t parse your pricing tiers. This blocks citation in "pricing comparison" queries.',
          impact: 'QUICK WIN',
          impactColor: colors.teal,
        },
        timestamp: ts,
      },
      {
        id: `orca-action2-${Date.now()}`,
        type: 'action-card',
        card: {
          kind: 'action',
          title: '2. Publish FAQ: "How does findable track AI citations?"',
          description: 'This exact query gets asked 340 times/week on ChatGPT. You\'re not appearing yet.',
          impact: 'CITATION GAP',
          impactColor: colors.amber,
        },
        timestamp: ts,
      },
      {
        id: `orca-action3-${Date.now()}`,
        type: 'action-card',
        card: {
          kind: 'action',
          title: '3. Update comparison page (Semrush overtook you)',
          description: 'Your /vs/semrush page is 3 weeks stale. Semrush updated theirs yesterday.',
          impact: 'COMPETITOR',
          impactColor: colors.coral,
        },
        timestamp: ts,
      },
    ];
  }

  if (q.includes('best') && q.includes('content') || q.includes('performing')) {
    return [
      {
        id: `orca-${Date.now()}`,
        type: 'orca',
        text: "Here's your content ranked by AI citation frequency this week:",
        timestamp: ts,
      },
      {
        id: `orca-content-${Date.now()}`,
        type: 'orca',
        text: '🥇 /blog/ai-seo-guide — 14 citations (ChatGPT loves this)\n🥈 /pricing — 9 citations (mostly Claude)\n🥉 /vs/semrush — 7 citations (Perplexity)\n4️⃣ /features — 5 citations (Gemini)\n\nYour AI SEO guide is your star content. Consider creating more long-form guides in this style.',
        timestamp: ts,
      },
    ];
  }

  if (q.includes('competitor') || q.includes('vs') || q.includes('compared')) {
    return [
      {
        id: `orca-${Date.now()}`,
        type: 'orca',
        text: "Here's your competitive snapshot:",
        timestamp: ts,
      },
      {
        id: `orca-comp-${Date.now()}`,
        type: 'orca',
        text: '📊 You rank **#3 of 5** in AI visibility for your category:\n\n1. Semrush — 81 (+2 this week)\n2. Ahrefs — 77 (+1)\n3. **findable — 73** (+3) ← you\'re gaining fastest\n4. Moz — 62 (-1)\n5. SE Ranking — 58 (+1)\n\nAt your current growth rate, you\'ll overtake Ahrefs in ~2 weeks. 🐋',
        timestamp: ts,
      },
      {
        id: `orca-metric-${Date.now()}`,
        type: 'metric-card',
        card: {
          kind: 'metric',
          label: 'Your Visibility Score',
          value: '73',
          change: '+3 this week (fastest growth)',
          positive: true,
          color: colors.visibility,
          sparkData: [58, 61, 64, 67, 65, 70, 73],
        },
        timestamp: ts,
      },
    ];
  }

  if (q.includes('quer') || q.includes('mention')) {
    return [
      {
        id: `orca-${Date.now()}`,
        type: 'orca',
        text: 'Your top queries by AI mention frequency:',
        timestamp: ts,
      },
      {
        id: `orca-queries-${Date.now()}`,
        type: 'orca',
        text: '🔍 "best AI SEO tools" — 18 mentions (Position #2)\n🔍 "how to improve AI visibility" — 12 mentions (#1!)\n🔍 "findable vs semrush" — 8 mentions (#1) 🆕\n🔍 "AI search optimization tools" — 6 mentions (#4)\n🔍 "brand monitoring in AI chatbots" — 3 mentions (#6) 🆕\n\nTwo new queries this week! "findable vs semrush" is especially valuable — direct brand comparison queries have the highest conversion rate.',
        timestamp: ts,
      },
    ];
  }

  // Default response
  return [
    {
      id: `orca-${Date.now()}`,
      type: 'orca',
      text: `Great question! Based on your current data:\n\nYour overall AI Visibility Score is 73 (Moderate). You're cited 47 times across 4 AI platforms this week, with ChatGPT being your strongest channel (+23%).\n\nWant me to dig deeper into any specific area? Try asking about your score, competitors, content performance, or daily priorities.`,
      timestamp: ts,
    },
  ];
};

// --- Bubble Components ---
const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: 1, duration: 400, delay, easing: Easing.ease, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, easing: Easing.ease, useNativeDriver: true }),
        ])
      );
    animate(dot1, 0).start();
    animate(dot2, 150).start();
    animate(dot3, 300).start();
  }, []);

  return (
    <View style={styles.typingRow}>
      <OrcaSmallAvatar />
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[
              styles.typingDot,
              { opacity: dot, transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const OrcaSmallAvatar: React.FC = () => (
  <View style={styles.orcaSmallAvatar}>
    <Svg width={28} height={28} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="18" fill={colors.primary} />
      <G transform="translate(6, 6)">
        <Path d="M14,4 Q22,4 24,12 Q26,18 22,22 Q18,26 14,26 Q8,26 6,20 Q4,14 6,10 Q8,4 14,4 Z" fill="#0066CC" />
        <Path d="M10,16 Q10,12 14,12 Q18,12 20,16 Q20,22 16,24 Q12,24 10,20 Z" fill="#E8F4FD" />
        <Ellipse cx="18" cy="10" rx="3.5" ry="2.2" fill="#E8F4FD" />
        <Circle cx="18.5" cy="10" r="1.2" fill="#0066CC" />
        <Circle cx="19" cy="9.5" r="0.4" fill="#FFFFFF" />
      </G>
    </Svg>
  </View>
);

const OrcaBubble: React.FC<{ text: string }> = ({ text }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  // Simple markdown-ish rendering
  const renderText = (t: string) => {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Text key={i} style={styles.boldText}>{part.slice(2, -2)}</Text>;
      }
      return <Text key={i}>{part}</Text>;
    });
  };

  return (
    <Animated.View style={[styles.orcaMessageRow, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
      <OrcaSmallAvatar />
      <View style={styles.orcaBubble}>
        <Text style={styles.orcaBubbleText}>{renderText(text)}</Text>
      </View>
    </Animated.View>
  );
};

const UserBubble: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.userMessageRow}>
    <View style={styles.userBubble}>
      <Text style={styles.userBubbleText}>{text}</Text>
    </View>
  </View>
);

const MetricCardBubble: React.FC<{ card: MetricCard }> = ({ card }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.orcaMessageRow, { opacity: fadeIn }]}>
      <View style={{ width: 36 }} />
      <View style={[styles.metricCardBubble, { borderColor: card.color + '30' }]}>
        <View style={styles.metricCardHeader}>
          <View style={[styles.metricDot, { backgroundColor: card.color }]} />
          <Text style={styles.metricCardLabel}>{card.label}</Text>
        </View>
        <View style={styles.metricCardValueRow}>
          <Text style={[styles.metricCardValue, { color: card.color }]}>{card.value}</Text>
          {card.sparkData && (
            <Svg width={60} height={24}>
              <Path
                d={buildSparkPath(card.sparkData, 60, 24)}
                stroke={card.color}
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
              />
            </Svg>
          )}
        </View>
        <Text style={[styles.metricCardChange, { color: card.positive ? colors.teal : colors.coral }]}>
          {card.change}
        </Text>
      </View>
    </Animated.View>
  );
};

const ActionCardBubble: React.FC<{ card: ActionCard }> = ({ card }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.orcaMessageRow, { opacity: fadeIn }]}>
      <View style={{ width: 36 }} />
      <TouchableOpacity style={styles.actionCardBubble} activeOpacity={0.7}>
        <View style={styles.actionCardHeader}>
          <Text style={styles.actionCardTitle}>{card.title}</Text>
          <View style={[styles.impactBadge, { backgroundColor: card.impactColor + '15' }]}>
            <Text style={[styles.impactText, { color: card.impactColor }]}>{card.impact}</Text>
          </View>
        </View>
        <Text style={styles.actionCardDesc}>{card.description}</Text>
        <View style={styles.actionCardFooter}>
          <Text style={styles.actionCardCta}>Take action →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper: build sparkline SVG path
const buildSparkPath = (data: number[], w: number, h: number): string => {
  if (data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const p = 2;
  const stepX = (w - p * 2) / (data.length - 1);
  const points = data.map((v, i) => ({
    x: p + i * stepX,
    y: p + (1 - (v - min) / range) * (h - p * 2),
  }));
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cpx = (points[i].x + points[i + 1].x) / 2;
    path += ` C ${cpx} ${points[i].y}, ${cpx} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`;
  }
  return path;
};

// --- Main Screen ---
export const OrcaAssistantScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const welcomeSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(welcomeAnim, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
      Animated.timing(welcomeSlide, { toValue: 0, duration: 800, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const sendMessage = (text: string) => {
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text,
      timestamp: ts,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate typing delay then respond
    const typingDelay = 800 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      const responses = getOrcaResponse(text);

      // Stagger responses
      responses.forEach((msg, i) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
        }, i * 400);
      });
    }, typingDelay);
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Svg width={32} height={32} viewBox="0 0 40 40">
            <Circle cx="20" cy="20" r="18" fill={colors.primary} />
            <G transform="translate(6, 6)">
              <Path d="M14,4 Q22,4 24,12 Q26,18 22,22 Q18,26 14,26 Q8,26 6,20 Q4,14 6,10 Q8,4 14,4 Z" fill="#0066CC" />
              <Path d="M10,16 Q10,12 14,12 Q18,12 20,16 Q20,22 16,24 Q12,24 10,20 Z" fill="#E8F4FD" />
              <Ellipse cx="18" cy="10" rx="3.5" ry="2.2" fill="#E8F4FD" />
              <Circle cx="18.5" cy="10" r="1.2" fill="#0066CC" />
              <Circle cx="19" cy="9.5" r="0.4" fill="#FFFFFF" />
            </G>
          </Svg>
          <View>
            <Text style={styles.headerTitle}>Ask Orca</Text>
            <Text style={styles.headerSubtitle}>Your AI visibility assistant</Text>
          </View>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome state */}
        {messages.length === 0 && (
          <Animated.View style={[styles.welcomeContainer, { opacity: welcomeAnim, transform: [{ translateY: welcomeSlide }] }]}>
            {/* Large Orca */}
            <View style={styles.welcomeOrca}>
              <Svg width={80} height={80} viewBox="0 0 40 40">
                <Defs>
                  <LinearGradient id="orcaBg" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={colors.primary} />
                    <Stop offset="1" stopColor={colors.primaryDark} />
                  </LinearGradient>
                </Defs>
                <Circle cx="20" cy="20" r="18" fill="url(#orcaBg)" />
                <G transform="translate(6, 6)">
                  <Path d="M14,4 Q22,4 24,12 Q26,18 22,22 Q18,26 14,26 Q8,26 6,20 Q4,14 6,10 Q8,4 14,4 Z" fill="#0066CC" />
                  <Path d="M10,16 Q10,12 14,12 Q18,12 20,16 Q20,22 16,24 Q12,24 10,20 Z" fill="#E8F4FD" />
                  <Ellipse cx="18" cy="10" rx="3.5" ry="2.2" fill="#E8F4FD" />
                  <Circle cx="18.5" cy="10" r="1.2" fill="#0066CC" />
                  <Circle cx="19" cy="9.5" r="0.4" fill="#FFFFFF" />
                  <Path d="M14,4 Q15,0 17,2 Q16,4 16,6 Z" fill="#0066CC" />
                </G>
              </Svg>
            </View>

            <Text style={styles.welcomeTitle}>Hey there! I'm Orca 🐋</Text>
            <Text style={styles.welcomeSubtitle}>
              I know everything about your AI visibility data. Ask me anything — I'll give you answers, not dashboards.
            </Text>

            {/* Suggestions */}
            <View style={styles.suggestionsGrid}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestion(s)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => {
          if (msg.type === 'user') {
            return <UserBubble key={msg.id} text={msg.text!} />;
          }
          if (msg.type === 'orca') {
            return <OrcaBubble key={msg.id} text={msg.text!} />;
          }
          if (msg.type === 'metric-card' && msg.card?.kind === 'metric') {
            return <MetricCardBubble key={msg.id} card={msg.card as MetricCard} />;
          }
          if (msg.type === 'action-card' && msg.card?.kind === 'action') {
            return <ActionCardBubble key={msg.id} card={msg.card as ActionCard} />;
          }
          return null;
        })}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Inline suggestions after conversation started */}
        {messages.length > 0 && !isTyping && !showSuggestions && (
          <View style={styles.inlineSuggestions}>
            <Text style={styles.inlineSuggestionsLabel}>Ask more:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.inlineSuggestionsRow}>
                {suggestions.slice(0, 4).map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.inlineSuggestionChip}
                    onPress={() => handleSuggestion(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.inlineSuggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask Orca anything..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : {}]}
            onPress={handleSubmit}
            disabled={!inputText.trim()}
          >
            <Svg width={18} height={18} viewBox="0 0 18 18">
              <Path
                d="M3 9L15 3L9 15L8 10L3 9Z"
                fill={inputText.trim() ? colors.primary : colors.textMuted}
                stroke={inputText.trim() ? colors.primary : colors.textMuted}
                strokeWidth={1}
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.teal + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal,
  },
  onlineText: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: '700',
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Welcome
  welcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  welcomeOrca: {
    marginBottom: 20,
  },
  welcomeTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  suggestionChip: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  suggestionText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Bubbles
  orcaMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  orcaSmallAvatar: {
    width: 28,
    height: 28,
    marginTop: 4,
  },
  orcaBubble: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: SCREEN_WIDTH * 0.72,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orcaBubbleText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    borderTopRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: SCREEN_WIDTH * 0.72,
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },

  // Metric card
  metricCardBubble: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    maxWidth: SCREEN_WIDTH * 0.65,
    borderWidth: 1,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricCardLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metricCardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricCardValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  metricCardChange: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Action card
  actionCardBubble: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    maxWidth: SCREEN_WIDTH * 0.72,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  actionCardTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  impactBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  impactText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionCardDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  actionCardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  actionCardCta: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // Typing
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.textMuted,
  },

  // Inline suggestions
  inlineSuggestions: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inlineSuggestionsLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  inlineSuggestionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inlineSuggestionChip: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inlineSuggestionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },

  // Input bar
  inputBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    paddingVertical: 10,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary + '15',
  },
});
