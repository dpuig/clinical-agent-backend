import 'package:flutter/material.dart';

class AppColors {
  // Background
  static const Color backgroundStart = Color(0xFF0B0E14);
  static const Color backgroundEnd = Color(0xFF000000);
  
  static const RadialGradient backgroundGradient = RadialGradient(
    center: Alignment.center,
    radius: 1.5,
    colors: [backgroundStart, backgroundEnd],
  );

  // Orb Colors
  static const Color orbCore = Color(0xFF31E1F7);    // Cyan
  static const Color orbAccent1 = Color(0xFFA06AF9); // Purple
  static const Color orbAccent2 = Color(0xFFFF9D00); // Amber

  // Glassmorphism
  static Color cardSurface = Colors.white.withOpacity(0.05);
  static Color cardBorder = Colors.white.withOpacity(0.12);

  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF8E8E93);

  // Actions
  static const Color actionActive = Color(0xFF31E1F7);
}
