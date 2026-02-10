Implementation Plan: AI Assistant Interface (Flutter)1. Project OverviewThis document outlines the technical specification and implementation strategy for a high-fidelity, futuristic AI Assistant interface in Flutter. The design features a central, fluid "Living Orb" (simulating a voice assistant), glassmorphic UI elements, and complex lighting effects.Target Platform: Mobile (iOS & Android)Core Technology: Flutter (Dart)Key Libraries: flutter_shaders (optional but recommended for easier shader management), vector_math.2. Design System & Tokens2.1 Color Palette (Dark Theme)The application uses a deep, rich dark mode to enhance the luminosity of the orb and UI elements.Token NameValue (Hex/RGBA)UsageAppColors.backgroundRadialGradient(#0B0E14, #000000)Main screen background. Deep blue-black to pure black.AppColors.orbCore#31E1F7 (Cyan)Core glowing color of the orb.AppColors.orbAccent1#A06AF9 (Purple)Secondary swirl color.AppColors.orbAccent2#FF9D00 (Amber)Highlight/Warmth accents.AppColors.cardSurfaceColor.fromRGBO(255, 255, 255, 0.05)Glassmorphic card background.AppColors.cardBorderColor.fromRGBO(255, 255, 255, 0.12)Subtle 1px border for definition.AppColors.textPrimary#FFFFFFHeadings and active text.AppColors.textSecondary#8E8E93Subtitles and inactive states.AppColors.actionActive#31E1F7Active icons or toggles (e.g., Light ON).2.2 TypographyFont Family: Inter or SF Pro Display (Platform adaptive).H1 (Greeting): Size: 28sp, Weight: w400 (Regular).H2 (Status): Size: 22sp, Weight: w500 (Medium).Body (Cards): Size: 14sp, Weight: w400.Label (Micro): Size: 12sp, Weight: w500, Uppercase (optional).2.3 Spacing & LayoutScreen Padding: 24.0 (Horizontal).Card Radius: 24.0 (RoundedRect).Grid Spacing: 12.0 (Between cards).3. Core Component: The Living Orb (Shader Implementation)The "Orb" is not a static image or a simple video; it is a procedural shader rendered on a standard Flutter Canvas. This ensures fluid movement at 60/120 FPS.3.1 Shader Strategy (GLSL)You will write a Fragment Shader (.frag) that uses Simplex Noise or fBm (Fractal Brownian Motion) to create the "liquid gas" effect.Concept Snippet (GLSL):OpenGL Shading Language// orb.frag
#include <flutter/runtime_effect.glsl>

uniform float uTime;
uniform vec2 uResolution;

out vec4 fragColor;

// [Insert Noise Function Here - e.g., Simplex 3D]

void main() {
    vec2 uv = FlutterFragCoord().xy / uResolution;
    
    // Create a radial gradient mask to keep it spherical
    float dist = distance(uv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.45, dist);

    // Generate noise based on time
    float n = noise(vec3(uv * 3.0, uTime * 0.5)); 
    
    // Mix colors based on noise value
    vec3 color = mix(vec3(0.19, 0.88, 0.96), vec3(0.62, 0.41, 0.97), n);
    
    fragColor = vec4(color, alpha);
}
3.2 Flutter Widget (OrbWidget)Widget: CustomPainter wrapped in a RepaintBoundary (critical for performance).Controller: A Ticker or AnimationController that passes the elapsedTime to the shader every frame.Optimization: Ensure the shader compilation is cached (warm-up) during app startup to prevent initial stutter.4. UI Component: Glassmorphic CardsThe bottom cards (Lights, Thermostat, Security) utilize a specific stack to achieve the frosted look.4.1 Widget Tree StructureDartContainer(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(24),
    border: Border.all(
      color: Colors.white.withOpacity(0.12), // Thin border
      width: 1,
    ),
    // Gradient for subtle surface shine
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        Colors.white.withOpacity(0.15),
        Colors.white.withOpacity(0.05),
      ],
    ),
  ),
  child: ClipRRect(
    borderRadius: BorderRadius.circular(24),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20), // Heavy blur
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.lightbulb_outline, color: AppColors.actionActive),
            Spacer(),
            Text("Living Room\nLights", style: AppTextStyles.cardTitle),
            Text("ON, 80%", style: AppTextStyles.cardSubtitle),
          ],
        ),
      ),
    ),
  ),
)
5. Animation Plan5.1 Idle State (The Orb)Movement: The internal noise texture translates slowly.Breathing: A subtle ScaleTransition (Scale 0.95 -> 1.05) over 4 seconds (Curves.easeInOutSine).5.2 Listening State (User Interaction)Trigger: User taps the microphone or says a wake word.Effect:Orb scale increases to 1.15.Shader uTime speed multiplier increases (swirls faster).Glow intensity (surrounding BoxShadow) increases.5.3 Page EntryStaggered Animation:Orb fades in + scales up (0ms - 600ms).Text fades in (400ms - 800ms).Cards slide up from bottom + fade in (600ms - 1000ms), staggered by 100ms each.6. Implementation Architecture6.1 Folder StructurePlaintextlib/
├── main.dart
├── core/
│   ├── theme/          # AppColors, TextStyles
│   └── constants/      # Strings, Asset Paths
├── ui/
│   ├── widgets/
│   │   ├── orb/        # OrbWidget, OrbPainter, Shader loading logic
│   │   ├── cards/      # GlassCard, ControlGrid
│   │   └── bottom_bar/ # InputField, MicButton
│   └── screens/
│       └── home_screen.dart
└── shaders/
    └── fluid_orb.frag  # The GLSL code
6.2 Dependencies (pubspec.yaml)YAMLdependencies:
  flutter:
    sdk: flutter
  # State management (Choose one)
  flutter_bloc: ^8.1.0 
  # For vector math in shaders
  vector_math: ^2.1.4
  # Icons (if using specific sets)
  cupertino_icons: ^1.0.6

flutter:
  shaders:
    - shaders/fluid_orb.frag
7. Performance ChecklistRepaintBoundary: Strictly wrap the OrbWidget in a RepaintBoundary. The shader redraws every frame; you do NOT want the text or glass cards to repaint unnecessarily.const Constructors: Use const for all text styles, icons, and static layout widgets to reduce garbage collection.Blur Radius: High blur values (>20) in BackdropFilter can be expensive on older Android devices. Test thoroughly and consider reducing sigma on low-end devices.Shader Warm-up: Implement a splash screen that pre-compiles the shader to avoid the "first-frame jank" when the orb appears.