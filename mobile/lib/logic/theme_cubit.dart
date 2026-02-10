import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

enum AppThemeMode { system, light, dark }

class ThemeCubit extends Cubit<AppThemeMode> {
  ThemeCubit() : super(AppThemeMode.system);

  void toggleTheme() {
    switch (state) {
      case AppThemeMode.system:
        emit(AppThemeMode.light);
        break;
      case AppThemeMode.light:
        emit(AppThemeMode.dark);
        break;
      case AppThemeMode.dark:
        emit(AppThemeMode.system);
        break;
    }
  }

  void setTheme(AppThemeMode mode) => emit(mode);
  
  // Helper to convert to Flutter's ThemeMode
  ThemeMode get flutterThemeMode {
    switch (state) {
      case AppThemeMode.light: return ThemeMode.light;
      case AppThemeMode.dark: return ThemeMode.dark;
      case AppThemeMode.system: return ThemeMode.system;
    }
  }
  
  IconData get icon {
    switch (state) {
      case AppThemeMode.light: return Icons.wb_sunny;
      case AppThemeMode.dark: return Icons.nightlight_round;
      case AppThemeMode.system: return Icons.brightness_auto;
    }
  }
}
