import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';


export interface UseAudioRecorderReturn {
	isRecording: boolean;
	recordingUri: string | null;
	startRecording: () => Promise<void>;
	stopRecording: () => Promise<string | null>;
	permissionResponse: Audio.PermissionResponse | null;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingUri, setRecordingUri] = useState<string | null>(null);
	const [permissionResponse, requestPermission] = Audio.usePermissions();

	const startRecording = useCallback(async () => {
		try {
			if (permissionResponse?.status !== 'granted') {
				const resp = await requestPermission();
				if (resp.status !== 'granted') {
					console.warn('Audio permission not granted');
					return;
				}
			}

			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			const { recording } = await Audio.Recording.createAsync(
				Audio.RecordingOptionsPresets.HIGH_QUALITY
			);

			setRecording(recording);
			setIsRecording(true);
			setRecordingUri(null);
		} catch (err) {
			console.error('Failed to start recording', err);
		}
	}, [permissionResponse, requestPermission]);

	const stopRecording = useCallback(async () => {
		if (!recording) return null;

		try {
			await recording.stopAndUnloadAsync();
			const uri = recording.getURI();
			setRecording(null);
			setIsRecording(false);
			setRecordingUri(uri);

			// Reset audio mode
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
			});

			return uri;
		} catch (err) {
			console.error('Failed to stop recording', err);
			return null;
		}
	}, [recording]);

	return {
		isRecording,
		recordingUri,
		startRecording,
		stopRecording,
		permissionResponse,
	};
}
