import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final double width;
  final double height;
  final VoidCallback? onTap;
  final bool lightMode;

  const GlassCard({
    super.key,
    required this.child,
    this.width = double.infinity,
    this.height = 100,
    this.onTap,
    this.lightMode = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: lightMode ? Colors.grey.withOpacity(0.2) : AppColors.cardBorder,
            width: 1,
          ),
          color: lightMode ? Colors.white.withOpacity(0.6) : null,
          gradient: lightMode ? null : LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.white.withOpacity(0.15),
              Colors.white.withOpacity(0.05),
            ],
          ),
          boxShadow: lightMode ? [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ] : null,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}
