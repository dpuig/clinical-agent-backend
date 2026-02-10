import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme, StatusBar, SafeAreaView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, LayoutAnimationConfig, LinearTransition } from 'react-native-reanimated';

import { Orb } from '@/components/Orb';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/Colors';

import { useTheme } from '@/app/ctx';

import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const { setThemeMode, activeTheme } = useTheme();
  const navigation = useNavigation();
  const isDark = activeTheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [isListening, setIsListening] = useState(false);

  // Listen state toggle
  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Background Layer */}
      {isDark ? (
        <LinearGradient
          colors={['#0B0E14', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />
      )}

      <SafeAreaView style={styles.safeArea}>

        <View style={styles.content}>

          {/* Header - Hides when listening */}
          {!isListening && (
            <Animated.View exiting={FadeOut.duration(300)} entering={FadeIn.duration(300)} style={styles.headerContainer}>
              {/* Theme Toggle & Top Bar could go here */}
              <View style={styles.topBar}>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                  <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={24} color={theme.icon} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.greeting, { color: theme.text }]}>
                Good Morning, Dr.{'\n'}Jay.
              </Text>

              <View style={styles.securityBadge}>
                <MaterialIcons name="lock-outline" size={14} color={theme.outline} />
                <Text style={[styles.securityText, { color: theme.outline }]}>HIPAA Secure Environment</Text>
              </View>
            </Animated.View>
          )}

          {/* Center Orb Area */}
          <View style={styles.orbContainer}>
            <Orb
              style={{ width: 350, height: 350 }}
              isListening={isListening}
            />

            {/* Transcription / Status Text */}
            {isListening && (
              <Animated.View entering={FadeIn.duration(500)} style={styles.transcriptionContainer}>
                <Text style={[styles.transcriptionText, { color: theme.text }]}>
                  Listening to clinical dictation...
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Bottom Area */}
          <View style={styles.bottomContainer}>
            {/* Chips - Hide when listening */}
            {!isListening && (
              <Animated.View exiting={FadeOut.duration(300)} entering={FadeIn.duration(300)} style={styles.chipsRow}>
                <SuggestionChip icon="medical-services" label="Patient Intake" isDark={isDark} onPress={() => { }} />
                <SuggestionChip icon="note-alt" label="SOAP Note" isDark={isDark} onPress={() => { }} />
                <SuggestionChip icon="search" label="Search" isDark={isDark} onPress={() => { }} />
              </Animated.View>
            )}

            <View style={{ height: 40 }} />

            {/* Mic Button */}
            <GlassCard
              width={80}
              height={80}
              onPress={toggleListening}
              style={styles.micButton}
            >
              <MaterialIcons
                name={isListening ? "stop" : "mic"}
                size={32}
                color={isListening ? '#ef4444' : (isDark ? '#FFF' : '#000')}
              />
            </GlassCard>

            <View style={{ height: 20 }} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SuggestionChip({ icon, label, isDark, onPress }: { icon: keyof typeof MaterialIcons.glyphMap, label: string, isDark: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
        },
        !isDark && styles.chipShadow
      ]}
    >
      <MaterialIcons name={icon} size={18} color={isDark ? 'rgba(255,255,255,0.7)' : '#000'} />
      <Text style={[styles.chipText, { color: isDark ? '#FFF' : '#000' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', // Header top, Orb center, Bottom bottom
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },
  topBar: {
    height: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  greeting: {
    fontSize: 45, // Material Display Medium
    lineHeight: 52,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
    fontFamily: 'Inter_400Regular', // Explicitly use Inter
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  orbContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Behind text
  },
  transcriptionContainer: {
    // Position below Orb (350px height / 2 = 175px radius) + Margin
    // Center of screen is 50%.
    position: 'absolute',
    top: '50%',
    marginTop: 220, // 175px (half orb) + 45px buffer
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  transcriptionText: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
  },
  chipShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  micButton: {
    // GlassCard handles size
  }
});
