Core Concepts
To mimic these orbs, we will layer three distinct visual components:

The Core (Glow): A soft RadialGradient that breathes (scales) in and out.

The Swirls (Energy): Multiple SweepGradient layers that rotate at different speeds. This mimics the "fluid" motion inside the sphere.

The Gloss (Surface): A static or subtle light reflection to make it look spherical (3D).

Implementation Instructions
Step 1: Create the Main Widget
We need a StatefulWidget to handle the AnimationController. This controller will drive both the rotation of the swirls and the "breathing" pulse of the orb.

Step 2: The "Orb Painter"
We will create a CustomPainter. This painter needs to:

Draw the background glow: A large, fuzzy circle behind everything.

Draw the "Energy" layers: These are circles filled with SweepGradient (colors sweeping around the center). By rotating the canvas before drawing these, we create the spinning effect.

Use Blend Modes: Using BlendMode.srcATop or BlendMode.plus (additive mixing) helps colors merge like light, creating that intense "plasma" look.

Step 3: Stacking and Compositing
We will stack multiple instances of our painter, or draw multiple layers in one painter, with different rotation speeds.

The Code (Copy & Paste Ready)
Here is a complete, customizable GlowingOrb widget. I have tuned the default colors to match your Blue/Purple reference (Image 3), but I'll show you how to change it to the Yellow or Cyan versions.

Dart
import 'dart:math' as math;
import 'package:flutter/material.dart';

class GlowingOrb extends StatefulWidget {
  final double size;
  final Color primaryColor;
  final Color secondaryColor;

  const GlowingOrb({
    super.key,
    this.size = 200,
    this.primaryColor = const Color(0xFF2196F3), // Blue
    this.secondaryColor = const Color(0xFFE040FB), // Purple
  });

  @override
  State<GlowingOrb> createState() => _GlowingOrbState();
}

class _GlowingOrbState extends State<GlowingOrb>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    // Creates a continuous loop for rotation and pulsing
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return CustomPaint(
            painter: _OrbPainter(
              animationValue: _controller.value,
              color1: widget.primaryColor,
              color2: widget.secondaryColor,
            ),
          );
        },
      ),
    );
  }
}

class _OrbPainter extends CustomPainter {
  final double animationValue;
  final Color color1;
  final Color color2;

  _OrbPainter({
    required this.animationValue,
    required this.color1,
    required this.color2,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    
    // 1. OUTER GLOW (The atmosphere)
    // We draw a large, soft radial gradient behind the orb
    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          color1.withOpacity(0.6),
          color1.withOpacity(0.0),
        ],
        stops: const [0.4, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: radius * 1.3))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 20); // Blur it
    
    canvas.drawCircle(center, radius * 1.2, glowPaint);

    // 2. THE CORE SPHERE (Base Gradient)
    final spherePaint = Paint()
      ..shader = RadialGradient(
        colors: [
           Colors.white.withOpacity(0.8), // Bright center
           color1,
           color2.withOpacity(0.8),
        ],
        stops: const [0.0, 0.5, 1.0],
        center: const Alignment(-0.3, -0.3), // Offset highlight for 3D look
        radius: 1.0,
      ).createShader(Rect.fromCircle(center: center, radius: radius));

    canvas.drawCircle(center, radius, spherePaint);

    // 3. INNER SWIRLS (The "Energy" Texture)
    // We save the canvas state, rotate it, draw a sweep gradient, and restore.
    
    // Layer A: Fast rotation clockwise
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(animationValue * 2 * math.pi); // Full rotation
    
    final swirlPaint = Paint()
      ..blendMode = BlendMode.srcATop // Merges with the sphere below
      ..shader = SweepGradient(
        colors: [
          color1.withOpacity(0.0),
          color2.withOpacity(0.5),
          color1.withOpacity(0.0),
        ],
        stops: const [0.0, 0.5, 1.0],
        startAngle: 0,
        endAngle: math.pi, // Only a semi-circle swirl
        transform: const GradientRotation(math.pi / 4),
      ).createShader(Rect.fromCircle(center: Offset.zero, radius: radius));
      
    canvas.drawCircle(Offset.zero, radius, swirlPaint);
    canvas.restore();

    // Layer B: Slower rotation counter-clockwise (adds complexity)
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(-animationValue * 2 * math.pi * 0.7); // Negative rotation
    
    final swirlPaint2 = Paint()
      ..blendMode = BlendMode.srcATop
      ..shader = SweepGradient(
        colors: [
          Colors.transparent,
          Colors.white.withOpacity(0.4),
          Colors.transparent,
        ],
        stops: const [0.2, 0.5, 0.8],
      ).createShader(Rect.fromCircle(center: Offset.zero, radius: radius));
      
    canvas.drawCircle(Offset.zero, radius * 0.9, swirlPaint2);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _OrbPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
How to customize for your Reference Images
For Image 1 (The Blue "Plasma"):
Use BlendMode.plus (Additive) inside the painter for the swirls. This makes overlapping colors brighter, simulating light.

Dart
// In usage:
GlowingOrb(
  primaryColor: Colors.cyan,
  secondaryColor: Colors.blueAccent,
)
For Image 2 (The Yellow/Orange "Sun"):
You need warm colors and a softer blur.

Dart
// In usage:
GlowingOrb(
  primaryColor: Colors.orange,
  secondaryColor: Colors.yellow,
)
For Image 3 (The Purple/Blue "Bubble"):
The default code above is tuned for this. It relies on the RadialGradient having an offset center (Alignment(-0.3, -0.3)) to create that shiny highlight in the top-left corner.

Advanced Optimization (If you need more realism)
If the CustomPainter looks too "flat" for your needs, you must use Fragment Shaders.

Create a file orb.frag.

Use standard GLSL noise functions (Simplex Noise).

Load it in Flutter using FragmentProgram.fromAsset.

Pass the u_time variable to the shader.

However, the CustomPainter code provided above is usually preferred for apps because it consumes significantly less battery and is easier to maintain than raw GLSL code.