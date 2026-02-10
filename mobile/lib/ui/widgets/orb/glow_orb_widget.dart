import 'package:flutter/material.dart';
import 'package:glow_orb/glow_orb.dart';
// Wrapper for the external library GlowOrb
class OrbWidget extends StatelessWidget {
  final double size;
  final Color primaryColor;
  final Color secondaryColor;

  const OrbWidget({
    super.key,
    this.size = 200,
    this.primaryColor = const Color(0xFFFFE0B2), // Pale Peach
    this.secondaryColor = const Color(0xFFFFD54F), // Gold
  });

  @override
  Widget build(BuildContext context) {
    return GlowOrb(
      size: size,
      customColorScheme: [
        primaryColor,
        secondaryColor,
        Colors.white,
        Color(0xFFFFCCBC), // Deep Peach
      ],
      floatIntensity: 0.0, // Disable floating to keep it centered like previous orb? Or user wants movement?
      // "Internal movement to mimic a fluid in zero gravity" -> GlowOrb default animation handles this?
      // GlowOrb has "enableFloating", "enableColorShift", "enableLookAround".
      // Let's enable default animations but maybe faster/slower?
      // User said "internal colors... extremely soft and large... shifting internal light".
      // GlowOrb does this nicely.
      floatAnimationDuration: const Duration(seconds: 5),
    );
  }
}
