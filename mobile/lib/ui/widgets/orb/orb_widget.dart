import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

class OrbWidget extends StatefulWidget {
  final double size;
  final double energy;

  const OrbWidget({
    super.key,
    this.size = 200,
    this.energy = 0.0,
  });

  @override
  State<OrbWidget> createState() => _OrbWidgetState();
}

class _OrbWidgetState extends State<OrbWidget> with SingleTickerProviderStateMixin {
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
          // 1. OUTER GLOW REMOVED
          // The user requested "without the light yellow border".
          // The background glow was creating this effect.
          // Removed for strict flat M3 aesthetic.
          
          // 2. FLUID BUBBLE (Shader) -- High-Fidelity Physics
          if (_program != null)
             TweenAnimationBuilder<double>(
              tween: Tween<double>(
                 // Animate Theme Change (Color)
                end: Theme.of(context).brightness == Brightness.light ? 1.0 : 0.0,
              ),
              duration: const Duration(milliseconds: 1500), // Slow morph (1.5s)
              curve: Curves.easeInOutCubic,
              builder: (context, animatedBrightness, child) {
                // Nested Tween for Energy (Physics)
                return TweenAnimationBuilder<double>(
                  tween: Tween<double>(end: widget.energy),
                  duration: const Duration(milliseconds: 800), // Faster response for energy
                  curve: Curves.easeInOut,
                  builder: (context, animatedEnergy, child) {
                    return CustomPaint(
                      size: Size(widget.size * 0.9, widget.size * 0.9), // Slightly smaller core
                      painter: _ShaderPainter(
                        _program!, 
                        _elapsedTime, 
                        widget.size, 
                        animatedBrightness,
                        animatedEnergy,
                      ),
                    );
                  },
                );
              },
            ),
        ],
      ),
    );
  }
}


// 1. OUTER GLOW REMOVED
// The user requested "without the light yellow border".
// The background glow was creating this effect.
// Removed for strict flat M3 aesthetic.
// _GlowPainter class removed as it is now unused.

// Shader Painter for the Bubble
class _ShaderPainter extends CustomPainter {
  final FragmentProgram program;
  final double time;
  final double resolution;
  final double brightness; // 0.0 = Dark, 1.0 = Light
  final double energy;

  _ShaderPainter(this.program, this.time, this.resolution, this.brightness, this.energy);

  @override
  void paint(Canvas canvas, Size size) {
    // Pass time and resolution to shader
    final shader = program.fragmentShader();
    
    // Uniforms:
    // 0: uTime
    shader.setFloat(0, time); 
    // 1: uResolution (vec2)
    shader.setFloat(1, size.width);
    shader.setFloat(2, size.height);
    // 3: uBrightness
    shader.setFloat(3, brightness);
    // 4: uEnergy
    shader.setFloat(4, energy); // New Uniform

    final paint = Paint()..shader = shader;
    canvas.drawRect(Offset.zero & size, paint);
  }

  @override
  bool shouldRepaint(covariant _ShaderPainter oldDelegate) {
    return oldDelegate.time != time || oldDelegate.brightness != brightness;
  }
}
