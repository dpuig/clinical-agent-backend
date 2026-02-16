import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { AmbientRecorderFAB } from '@/components/AmbientRecorderFAB';
import { DiagnosisStreamItem } from '@/components/DiagnosisStreamItem';
import { LiveWaveformContainer } from '@/components/LiveWaveformContainer';
import { TopAppBar } from '@/components/TopAppBar';
import { PatientDetailModal } from '@/components/PatientDetailModal';
import { ProfileModal } from '@/components/ProfileModal';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/src/theme/layout';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { useTheme } from '@/app/ctx';

// Mock Data
const MOCK_PATIENT = {
  name: 'Jane Doe',
  age: 45,
  gender: 'Female',
  history: ['Hypertension', 'Type 2 DM'],
  lastVisit: '12 Oct 2024',
};

const MOCK_VITALS = [
  { label: 'HR', value: '80 bpm', isAbnormal: false },
  { label: 'BP', value: '140/90', isAbnormal: true }, // Hypertensive
  { label: 'O2', value: '98%', isAbnormal: false },
  { label: 'Temp', value: '37.1°C', isAbnormal: false },
];

const MOCK_STREAM = [
  { id: '1', message: 'Patient reports persistent headaches for the past 3 days.', type: 'doctor' },
  { id: '2', message: 'Based on the history of hypertension, please check for visual disturbances or dizziness.', type: 'ai' },
  { id: '3', message: 'No visual issues, but slight dizziness when standing up.', type: 'doctor' },
] as const;

export default function ClinicalDashboard() {
  const { activeTheme } = useTheme();
  const theme = Colors[activeTheme];
  const [recorderState, setRecorderState] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const toggleRecording = () => {
    if (recorderState === 'idle') {
      setRecorderState('listening');
    } else if (recorderState === 'listening') {
      setRecorderState('processing');
      setTimeout(() => setRecorderState('idle'), 2000); // Simulate processing
    }
  };

  const renderStreamItem = ({ item }: { item: typeof MOCK_STREAM[number] }) => (
    <DiagnosisStreamItem message={item.message} type={item.type} />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <TopAppBar
        onMenuPress={() => setDetailsVisible(true)}
        onProfilePress={() => setProfileVisible(true)}
        title={MOCK_PATIENT.name}
      />

      <View style={styles.container}>
        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <Animated.View layout={LinearTransition}>
            {recorderState === 'idle' && (
              <Animated.View exiting={FadeOutUp} entering={FadeInUp} style={styles.greetingContainer}>
                <ThemedText type="displayMedium" style={{ textAlign: 'center', opacity: 0.8 }}>
                  How can I help you?
                </ThemedText>
                <ThemedText type="titleMedium" style={{ textAlign: 'center', opacity: 0.5, marginTop: 16 }}>
                  {MOCK_PATIENT.name}
                </ThemedText>
              </Animated.View>
            )}
          </Animated.View>

          <View style={styles.waveformContainer}>
            <LiveWaveformContainer isListening={recorderState === 'listening'} />
          </View>

          {recorderState !== 'idle' && (
            <Animated.View entering={FadeInUp.springify()} style={{ flex: 1, width: '100%' }}>
              <FlatList
                data={MOCK_STREAM}
                renderItem={renderStreamItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.streamList}
                style={{ flex: 1, width: '100%' }}
              />
            </Animated.View>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.controlsArea}>
          <AmbientRecorderFAB onPress={toggleRecording} state={recorderState} />
          <ThemedText style={{ marginTop: 16, color: theme.outline }}>
            {recorderState === 'idle' ? 'Tap to Consult' : recorderState === 'listening' ? 'Listening...' : 'Processing...'}
          </ThemedText>
        </View>
      </View>

      <PatientDetailModal
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        patient={MOCK_PATIENT}
        vitals={MOCK_VITALS}
      />

      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
  },
  greetingContainer: {
    marginTop: Spacing.large,
    marginBottom: Spacing.medium,
    minHeight: 80,
    justifyContent: 'center',
  },
  waveformContainer: {
    height: 80, // Slightly taller for simplified view
    width: '100%',
    marginBottom: Spacing.medium,
    justifyContent: 'center',
  },
  streamList: {
    paddingBottom: 20,
    width: '100%',
  },
  controlsArea: {
    alignItems: 'center',
    paddingBottom: Spacing.large * 2, // More breathing room at bottom
    paddingTop: Spacing.medium,
  }
});
