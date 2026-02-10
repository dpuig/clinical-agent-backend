import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:record/record.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

// Events
abstract class AudioEvent {}

class ConnectAudio extends AudioEvent {}
class StartRecording extends AudioEvent {}
class StopRecording extends AudioEvent {}
class DisconnectAudio extends AudioEvent {}

// States
abstract class AudioState {}

class AudioInitial extends AudioState {}
class AudioConnecting extends AudioState {}
class AudioConnected extends AudioState {
  final String statusMetadata;
  AudioConnected(this.statusMetadata);
}
class AudioRecording extends AudioState {
  final double amplitude; // For visualizer
  AudioRecording(this.amplitude);
}
class AudioError extends AudioState {
  final String message;
  AudioError(this.message);
}

class AudioBloc extends Bloc<AudioEvent, AudioState> {
  WebSocketChannel? _channel;
  final AudioRecorder _audioRecorder = AudioRecorder();
  StreamSubscription? _recordSubscription;
  StreamSubscription? _socketSubscription;

  // Configuration
  static const String wsUrl = 'ws://127.0.0.1:8080/ws/audio'; // Use 10.0.2.2 for Android Emulator

  AudioBloc() : super(AudioInitial()) {
    on<ConnectAudio>(_onConnect);
    on<StartRecording>(_onStartRecording);
    on<StopRecording>(_onStopRecording);
    on<DisconnectAudio>(_onDisconnect);
  }

  Future<void> _onConnect(ConnectAudio event, Emitter<AudioState> emit) async {
    emit(AudioConnecting());
    try {
      // Connect to WebSocket
      // Note: Adjust localhost for emulator/device if needed
      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));
      
      _socketSubscription = _channel!.stream.listen((message) {
        // Handle incoming messages (e.g., transcripts)
        // debugPrint('WS Message: $message');
      }, onError: (error) {
        add(DisconnectAudio()); // Or emit error
      }, onDone: () {
        add(DisconnectAudio());
      });

      emit(AudioConnected("Ready"));
    } catch (e) {
      emit(AudioError("Connection failed: $e"));
    }
  }

  Future<void> _onStartRecording(StartRecording event, Emitter<AudioState> emit) async {
    if (_channel == null) return;
    
    try {
      if (await _audioRecorder.hasPermission()) {
        final stream = await _audioRecorder.startStream(const RecordConfig(
          encoder: AudioEncoder.pcm16bits,
          sampleRate: 16000,
          numChannels: 1,
        ));

        _recordSubscription = stream.listen((data) {
          _channel?.sink.add(data);
          // Calculate dummy amplitude for now or parse PCM
          // emit(AudioRecording(amplitude)); 
        });
        
        emit(AudioRecording(0.5));
      } else {
        emit(AudioError("Microphone permission denied"));
      }
    } catch (e) {
      emit(AudioError("Recording failed: $e"));
    }
  }

  Future<void> _onStopRecording(StopRecording event, Emitter<AudioState> emit) async {
    await _audioRecorder.stop();
    _recordSubscription?.cancel();
    _recordSubscription = null;
    
    // Send EOF to close stream cleanly
    _channel?.sink.add("EOF");
    
    emit(AudioConnected("Processing..."));
  }

  Future<void> _onDisconnect(DisconnectAudio event, Emitter<AudioState> emit) async {
    await _audioRecorder.stop();
    _recordSubscription?.cancel();
    _socketSubscription?.cancel();
    _channel?.sink.close(status.normalClosure);
    _channel = null;
    emit(AudioInitial());
  }

  @override
  Future<void> close() {
    _audioRecorder.dispose();
    _recordSubscription?.cancel();
    _socketSubscription?.cancel();
    _channel?.sink.close();
    return super.close();
  }
}
