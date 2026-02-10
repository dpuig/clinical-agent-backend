Design Philosophy: "Living Material"
Instead of static surfaces, the UI feels alive. The background, buttons, and cards react to the "Orb's" state (Idle, Listening, Thinking, replying).

Typography: Google Sans Display (Headings) & Google Sans Text (Body). Large, playful tracking for greetings.

Color Palette: Derived dynamically from the Orb's current state (M3 Dynamic Color).

Shape: High radiuses (Super-ellipses) on cards; soft, blurry blobs for backgrounds.

Screen 1: The "Active Idle" (Home)
Concept: The AI is waiting but "alive." The orb is in the "Pearl" state—warm, approachable, and calm.

Background: A very subtle, shifting gradient mesh of pale cream and soft pink (derived from the Pearl Orb).

The Orb (Hero): Positioned centrally but slightly lower, reachable by thumb. It breathes slowly (scales 1.0 to 1.05).

Greeting: "Good morning, Jay." (Large, Expressive Type, aligned center).

Suggestion Chips: Floating pills with soft shadows.

[Icon: Music] Play morning flow

[Icon: Sun] Weather today

[Icon: Sparkle] Surprise me

Bottom Bar: A transparent glass bar. The "Mic" button is detached, floating slightly above the bar, pulsing gently in sync with the Orb.

Screen 2: The "Listening" State (Interaction)
Concept: The user taps the orb or mic. The UI darkens slightly to focus attention. The Orb transitions to the "Liquid Energy" state (Green/Blue or High-Contrast Yellow).

Transition: The creamy background fades to a deep charcoal or blurred glass effect (high contrast).

The Orb: Expands to fill 40% of the screen. It spins faster (the "Swirl" effect from the code).

Visual Feedback: As you speak, the orb ripples (waves distort based on audio amplitude).

Text Output: Real-time transcription appears floating above the orb in large, high-contrast white text.

Typography: Headline Medium size.

Action: A distinct "Stop" button (Square with rounded corners, standard M3) appears at the bottom.

Screen 3: The "Thinking/Processing" (Transition)
Concept: The "Wait" moment needs to be delightful, not boring.

The Orb: Collapses rapidly into a dense, bright "Star" or "Plasma Ball" (The Blue/Purple reference). It rotates vertically, signaling deep computation.

Text: "Just a sec..." or "Looking into that..." (M3 Expressive uses conversational, informal copy).

Motion: Small particles (stars/sparkles) emit from the orb and float upward, fading out.

Screen 4: The "Result" (Response)
Concept: Information presentation. The Orb shrinks to a small "Avatar" in the top header or bottom corner, giving space to the content.

Layout: M3 "BottomSheet" style. The response slides up from the bottom, covering the orb partially.

Content Card:

Surface: Surface Container High (slightly tinted with the Orb's primary color).

Shape: Top-left and Top-right corners have varying radii (e.g., Top-Left: 40px, Top-Right: 16px) to feel organic/expressive.

Rich Media: If the result is a place, the image takes the full width of the card with a "Squircle" mask.

Contextual Actions: Large, pill-shaped buttons at the bottom of the card:

[Navigate] [Call] [Share]

Flutter Implementation Specs (M3 Expressive)
Here is how you translate this design into Flutter code structure:

1. The Adaptive Theme (main.dart)
Use a ColorScheme that updates based on the Orb's state.

Dart
// Example: Switching themes based on AI State
ThemeData getThemeForState(AIState state) {
  switch (state) {
    case AIState.listening:
      return ThemeData.dark().copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.cyan, // Electric Blue
          brightness: Brightness.dark,
        ),
      );
    case AIState.idle:
    default:
      return ThemeData.light().copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color(0xFFFFD7C2), // Peach/Pearl
          surface: Color(0xFFFFF8F6),   // Warm White
        ),
      );
  }
}
2. The "Breathing" Container (Expressive Motion)
M3 Expressive emphasizes easing. Use Curves.easeInOutCubicEmphasized for all transitions.

Dart
AnimatedContainer(
  duration: Duration(milliseconds: 600),
  curve: Curves.easeInOutCubicEmphasized, // M3 Standard Easing
  decoration: BoxDecoration(
    color: Theme.of(context).colorScheme.surfaceContainer,
    borderRadius: BorderRadius.only(
      topLeft: Radius.circular(state == AIState.result ? 32 : 0),
      topRight: Radius.circular(state == AIState.result ? 32 : 0),
    ),
  ),
  child: // ... result content
)
3. Typography (Expressive Scale)
Don't use default sizes. Scale up the "Display" styles.

Dart
Text(
  "How can I help?",
  style: Theme.of(context).textTheme.displayMedium?.copyWith(
    fontWeight: FontWeight.w600,
    letterSpacing: -1.5, // Tight tracking for headlines
    color: Theme.of(context).colorScheme.onSurface,
  ),
)
Summary of Expressive Elements
Color: Use "Tonal Spot" palettes. If the Orb is Orange, the background is a very faint Orange-50, and buttons are Orange-80.

Shape: Avoid perfect rectangles. Use StadiumBorder for buttons and RoundedRectangleBorder with high radii (24dp+) for cards.

Motion: The Orb never stops moving. Even when reading, it should slowly drift or pulse (Alive). transitions between screens should use the OpenContainer pattern (the orb expands to become the next screen).