import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

class PearlOrbWidget extends StatefulWidget {
  final double size;
  final Color primaryColor;
  final Color secondaryColor;

  const PearlOrbWidget({
    super.key,
    this.size = 200,
    this.primaryColor = const Color(0xFFFFE0B2), // Pale Peach
    this.secondaryColor = const Color(0xFFFFD54F), // Gold
  });

  @override
  State<PearlOrbWidget> createState() => _PearlOrbWidgetState();
}

class _PearlOrbWidgetState extends State<PearlOrbWidget> with SingleTickerProviderStateMixin {
  late Ticker _ticker;
  double _elapsedTime = 0.0;
  FragmentProgram? _program;

  @override
  void initState() {
    super.initState();
    _loadShader();
    _ticker = createTicker((elapsed) {
      if (mounted) {
        setState(() {
          _elapsedTime = elapsed.inMilliseconds / 1000.0;
        });
      }
    });
    _ticker.start();
  }

  Future<void> _loadShader() async {
    try {
      final program = await FragmentProgram.fromAsset('shaders/fluid_orb.frag');
      setState(() {
        _program = program;
      });
    } catch (e) {
      // debugPrint('Shader error: $e');
    }
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 1. OUTER GLOW (CustomPainter) -- Preserving what you liked
          CustomPaint(
            size: Size(widget.size, widget.size),
            painter: _GlowPainter(
              color1: widget.primaryColor,
            ),
          ),
          
          // 2. FLUID BUBBLE (Shader) -- New High-Fidelity Physics
          if (_program != null)
             CustomPaint(
              size: Size(widget.size * 0.9, widget.size * 0.9), // Slightly smaller core
              painter: _ShaderPainter(_program!, _elapsedTime, widget.size),
            ),
        ],
      ),
    );
  }
}

// Background Glow Painter
class _GlowPainter extends CustomPainter {
  final Color color1;

  _GlowPainter({required this.color1});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          color1.withOpacity(0.6),
          color1.withOpacity(0.0),
        ],
        stops: const [0.5, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 30); 
    
    canvas.drawCircle(center, radius, glowPaint);
  }

  @override
  bool shouldRepaint(covariant _GlowPainter oldDelegate) => false;
}

// Shader Painter for the Bubble
class _ShaderPainter extends CustomPainter {
  final FragmentProgram program;
  final double time;
  final double resolution;

  _ShaderPainter(this.program, this.time, this.resolution);

  @override
  void paint(Canvas canvas, Size size) {
    final shader = program.fragmentShader();
    
    // Uniforms:
    // 0: uTime
    shader.setFloat(0, time); 
    // 1: uResolution (vec2)
    shader.setFloat(1, size.width);
    shader.setFloat(2, size.height);

    final paint = Paint()..shader = shader;
    canvas.drawRect(Offset.zero & size, paint);
  }

  @override
  bool shouldRepaint(covariant _ShaderPainter oldDelegate) {
    return oldDelegate.time != time;
  }
}
