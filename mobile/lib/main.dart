import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/theme/app_theme.dart';
import 'logic/audio_bloc.dart';
import 'logic/theme_cubit.dart';
import 'ui/screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Enforce portrait mode for now
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const ClinicalAgentApp());
}

class ClinicalAgentApp extends StatelessWidget {
  const ClinicalAgentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => AudioBloc()),
        BlocProvider(create: (context) => ThemeCubit()),
      ],
      child: BlocBuilder<ThemeCubit, AppThemeMode>(
        builder: (context, themeMode) {
          return BlocBuilder<AudioBloc, AudioState>(
            builder: (context, audioState) {
              final isListening = audioState is AudioRecording || audioState is AudioConnecting;
              
              // effectiveThemeMode: If Listening, Force Dark. Else User Pref.
              final effectiveThemeMode = isListening ? ThemeMode.dark : context.read<ThemeCubit>().flutterThemeMode;
              
              return MaterialApp(
                title: 'Clinical Agent',
                debugShowCheckedModeBanner: false,
                themeMode: effectiveThemeMode,
                theme: AppTheme.lightTheme,
                darkTheme: AppTheme.darkTheme,
                home: const HomeScreen(),
              );
            },
          );
        },
      ),
    );
  }
}
