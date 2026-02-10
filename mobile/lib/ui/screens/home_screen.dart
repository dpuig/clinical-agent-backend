import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_colors.dart';
import '../../logic/audio_bloc.dart';
import '../../logic/theme_cubit.dart';
import '../widgets/orb/orb_widget.dart';
import '../widgets/cards/glass_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Auto-connect on start
    context.read<AudioBloc>().add(ConnectAudio());
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final colorScheme = Theme.of(context).colorScheme;
    final textPrimary = isDark ? AppColors.textPrimary : Colors.black;
    final textSecondary = isDark ? AppColors.textSecondary : Colors.grey[600]!;

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient (Dark) or Solid (Light)
          Container(
            decoration: BoxDecoration(
              gradient: isDark ? AppColors.backgroundGradient : null,
              color: isDark ? null : colorScheme.background,
            ),
          ),
          
          // Central Orb
          Center(
            child: BlocBuilder<AudioBloc, AudioState>(
              builder: (context, state) {
                double size = 350;
                double energy = 0.0;
                
                if (state is AudioRecording) {
                  // Pulse outcome based on amplitude
                  size = 350 + (state.amplitude * 50); 
                  energy = 1.0; // Aggressive Physics
                } else if (state is AudioConnecting) {
                  energy = 0.5; // Transition Physics
                }
                
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 100),
                  width: size,
                  height: size,
                  child: OrbWidget(
                    size: 350,
                    energy: energy,
                  ), 
                );
              },
            ),
          ),
          
          // Foreground UI
          SafeArea(
            child: BlocBuilder<AudioBloc, AudioState>(
              builder: (context, state) {
                final isListening = state is AudioRecording || state is AudioConnecting;
                // Transition UI Elements
                return Column(
                  children: [
                    const SizedBox(height: 20),
                    // Greeting & Top Bar (Only in Idle)
                    AnimatedOpacity(
                      duration: const Duration(milliseconds: 300),
                      opacity: isListening ? 0.0 : 1.0,
                      child: isListening ? const SizedBox.shrink() : Column(
                        children: [
                          // Top Bar with Theme Toggle
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                // Theme Toggle
                                IconButton(
                                  icon: Icon(
                                    context.watch<ThemeCubit>().icon,
                                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                                  ),
                                  onPressed: () => context.read<ThemeCubit>().toggleTheme(),
                                  tooltip: 'Toggle Theme',
                                ),
                              ],
                            ),
                          ),
                          
                          Text(
                            'Good Morning, Dr. Jay.',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              fontWeight: FontWeight.w400,
                              color: Theme.of(context).colorScheme.onSurface,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 8),
                          // Security Badge / Subtext
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.lock_outline, size: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
                              const SizedBox(width: 6),
                              Text(
                                'HIPAA Secure Environment',
                                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    
                    // Transcription (Only in Listening/Thinking)
                    if (isListening)
                      Expanded(
                        child: Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 32),
                            child: Text(
                              state is AudioRecording ? "Listening to clinical dictation..." : "Encrypting & Uploading...",
                              textAlign: TextAlign.center,
                              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                color: Colors.white, // Always white on dark
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      )
                    else 
                      const Spacer(),

                    // Orb Area (Center) stays same
                    
                    // Suggestion Chips (Idle) - Clinical Actions
                    if (!isListening) ...[
                      const Spacer(),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          children: [
                            _SuggestionChip(
                              icon: Icons.medical_services_outlined,
                              label: 'Patient Intake', 
                              onTap: () {},
                              lightMode: !isDark,
                            ),
                            const SizedBox(width: 12),
                            _SuggestionChip(
                              icon: Icons.note_alt_outlined,
                              label: 'SOAP Note',
                              onTap: () {},
                              lightMode: !isDark,
                            ),
                            const SizedBox(width: 12),
                            _SuggestionChip(
                              icon: Icons.search,
                              label: 'Search Protocols',
                              onTap: () {},
                              lightMode: !isDark,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 40),
                    ],

                    // Bottom Bar / Mic
                    Padding(
                      padding: const EdgeInsets.only(bottom: 40),
                      child: GlassCard(
                         width: 80,
                         height: 80,
                         lightMode: !isDark,
                         onTap: () {
                           if (isListening) {
                             context.read<AudioBloc>().add(StopRecording());
                           } else {
                             context.read<AudioBloc>().add(StartRecording());
                           }
                         },
                         child: Center(
                           child: Icon(
                             isListening ? Icons.stop : Icons.mic,
                             color: isListening ? Colors.red : (isDark ? Colors.white : Colors.black),
                             size: 32,
                           ),
                         ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _SuggestionChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool lightMode;

  const _SuggestionChip({
    required this.icon,
    required this.label,
    required this.onTap,
    required this.lightMode,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: lightMode ? Colors.white : Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(30),
          border: Border.all(
            color: lightMode ? Colors.grey.withOpacity(0.2) : Colors.white.withOpacity(0.1),
          ),
          boxShadow: lightMode ? [
             BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
          ] : null,
        ),
        child: Row(
          children: [
            Icon(icon, size: 18, color: lightMode ? Colors.black87 : Colors.white70),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: lightMode ? Colors.black87 : Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
