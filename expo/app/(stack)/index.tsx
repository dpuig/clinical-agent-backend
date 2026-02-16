import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme, StatusBar, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, LayoutAnimationConfig, LinearTransition } from 'react-native-reanimated';

import { Orb } from '@/components/Orb';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/Colors';

import { useTheme } from '@/app/ctx';

import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { Platform, Alert, FlatList, Modal, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';
import { Toast } from '@/components/Toast';

interface ClinicalImpression {
  id: string; // or number, handled as generic for now
  description: string;
  count: number; // Placeholder if needed
  raw_fhir: any;
}

export default function HomeScreen() {
  const { setThemeMode, activeTheme } = useTheme();
  const navigation = useNavigation();
  const isDark = activeTheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [impressions, setImpressions] = useState<any[]>([]); // Use appropriate type

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Fetch impressions on mount
  useEffect(() => {
    fetchImpressions();
  }, []);

  const fetchImpressions = async () => {
    // For physical devices, we MUST use the computer's LAN IP.
    // 10.0.2.2 only works for Android Emulator.
    // localhost only works for iOS Simulator.
    // Current Host IP: 192.168.1.209
    const apiUrl = 'http://192.168.1.209:8080/impressions';
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched impressions:', data);
        setImpressions(data || []);
      } else {
        console.log('Failed to fetch impressions:', response.status);
      }
    } catch (error) {
      console.log('Error fetching impressions:', error);
    }
  };

  // Audio Recording Logic
  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        const resp = await requestPermission();
        if (resp.status !== 'granted') {
          Alert.alert("Permission", "Audio permission is required.");
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions: any = {
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4, // Android doesn't support raw PCM recording easily via Expo
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      };

      // Force PCM for iOS to match Google STT LINEAR16
      if (Platform.OS === 'ios') {
        // 0x6c70636d is kAudioFormatLinearPCM
        // However, Expo uses string/enum.
        // Let's use the explicit structure.
        recordingOptions.ios.outputFormat = Audio.IOSOutputFormat.LINEARPCM;
      }

      const { recording } = await Audio.Recording.createAsync(recordingOptions);

      setRecording(recording);
      setIsListening(true);
      setTranscript(''); // Clear transcript on new recording
    } catch (err) {
      console.error('Failed to start recording', err);
      showToast("Failed to start recording", "error");
    }
  };

  const stopRecordingAndUpload = async () => {
    if (!recording) return;

    setIsListening(false);
    setIsProcessing(true); // Start processing state

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined); // Use undefined instead of null

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      if (uri) {
        uploadAudio(uri);
      } else {
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsProcessing(false);
    }
  };

  const uploadAudio = async (uri: string) => {
    // For physical devices, we MUST use the computer's LAN IP.
    // 10.0.2.2 only works for Android Emulator.
    // localhost only works for iOS Simulator.
    // Current Host IP: 192.168.1.209
    const apiUrl = 'http://192.168.1.209:8080/upload-audio';

    try {
      const uploadResult = await uploadAsync(apiUrl, uri, {
        httpMethod: 'POST',
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: 'audio',
      });

      if (uploadResult.status === 200) {
        const responseData = JSON.parse(uploadResult.body);
        console.log('Upload success:', responseData);

        const tx = responseData.transcript || "No speech detected.";
        setTranscript(tx);

        // Refresh impressions to show new count if saved
        fetchImpressions();

        showToast("Audio processed successfully", "success");
      } else {
        console.error('Upload failed', uploadResult);
        showToast("Transcription upload failed", "error");
      }
    } catch (error) {
      console.error('Upload error', error);
      showToast("Network error during upload", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle Listener
  const toggleListening = () => {
    if (isListening) {
      stopRecordingAndUpload();
    } else {
      startRecording();
    }
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
        <Toast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onDismiss={() => setToastVisible(false)}
          isDark={isDark}
        />

        <View style={styles.content}>
          {/* Center Orb Area - Render FIRST to be background */}
          <View style={styles.orbContainer}>
            <Orb
              style={{ width: 350, height: 350 }}
              isListening={isListening}
            />

            {isListening && (
              <Animated.View entering={FadeIn.duration(500)} style={styles.transcriptionContainer}>
                <Text style={[styles.transcriptionText, { color: theme.text }]}>
                  {transcript ? transcript : "Listening to clinical dictation..."}
                </Text>
              </Animated.View>
            )}
            {!isListening && isProcessing && (
              <Animated.View entering={FadeIn.duration(500)} style={styles.transcriptionContainer}>
                <Text style={[styles.transcriptionText, { color: theme.text, fontSize: 18, opacity: 0.8 }]}>
                  Processing audio...
                </Text>
              </Animated.View>
            )}
            {!isListening && !isProcessing && transcript && (
              <Animated.View entering={FadeIn.duration(500)} style={styles.transcriptionContainer}>
                <Text style={[styles.transcriptionText, { color: theme.text }]}>
                  {transcript}
                </Text>
              </Animated.View>
            )}
          </View>

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

          {/* Bottom Area */}
          <View style={styles.bottomContainer}>
            {/* Chips - Hide when listening */}
            {!isListening && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContainer}>
                <SuggestionChip icon="history" label={`History (${impressions.length})`} isDark={isDark} onPress={fetchImpressions} />
                <SuggestionChip icon="note-add" label="New Note" isDark={isDark} onPress={() => { }} filled />
                <SuggestionChip icon="summarize" label="Summarize" isDark={isDark} onPress={() => { }} />
              </ScrollView>
            )}

            <View style={{ height: 40 }} />

            {/* Mic Button */}
            <GlassCard
              width={80}
              height={80}
              onPress={isProcessing ? () => { } : toggleListening}
              style={[styles.micButton, isProcessing && { opacity: 0.5 }]}
            >
              <MaterialIcons
                name={isListening ? "stop" : (isProcessing ? "hourglass-empty" : "mic")}
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

function SuggestionChip({ icon, label, isDark, onPress, filled }: { icon: keyof typeof MaterialIcons.glyphMap, label: string, isDark: boolean, onPress: () => void, filled?: boolean }) {
  const bg = filled
    ? (isDark ? '#D0BCFF' : '#6750A4')
    : (isDark ? 'rgba(255,255,255,0.05)' : '#FFF');

  const fg = filled
    ? (isDark ? '#381E72' : '#FFF')
    : (isDark ? '#FFF' : '#000');

  const border = filled
    ? 'transparent'
    : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
        },
        !isDark && !filled && styles.chipShadow
      ]}
    >
      <MaterialIcons name={icon} size={18} color={filled ? fg : (isDark ? 'rgba(255,255,255,0.7)' : '#000')} />
      <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
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
    // zIndex removed to rely on render order (first child = background)
  },
  transcriptionContainer: {
    // Position below Orb (350px height / 2 = 175px radius) + Margin
    // Center of screen is 50%.
    position: 'absolute',
    top: '50%',
    marginTop: 140, // Reduced from 180 to 140 to clear bottom buttons
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
    zIndex: 10, // Ensure it's above other elements if they overlap
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
  chipsScroll: {
    maxHeight: 60,
    marginBottom: 20,
  },
  chipsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    alignItems: 'center',
  },
  // chipsRow removed in favor of ScrollView styles
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
