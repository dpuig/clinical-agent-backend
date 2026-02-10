import { Canvas, Fill, Shader, Skia, Uniforms } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';

const ORB_SHADER = Skia.RuntimeEffect.Make(`
uniform vec3 uColor;
uniform float uTime;
uniform float uRadius;
uniform float uEnergy;
uniform vec2 uResolution;

// Simple hash function for noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D Noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion for smoke/clouds
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

vec4 main(vec2 pos) {
  vec2 center = uResolution / 2.0;
  vec2 p = pos - center;
  float d = length(p);
  float angle = atan(p.y, p.x);
  float t = uTime;

  // 1. SHAPE DISTORTION (Wobble)
  float amp = mix(0.1, 1.0, uEnergy);
  
  // Use noise for shape distortion instead of simple sines for more "organic" feel?
  // Let's stick to sines for shape stability, but mix them up.
  float wave = (sin(angle * 3.0 + t * 1.0) + sin(angle * 6.0 - t * 2.0)) * 5.0 * amp;
  
  // Breathing
  float breath = sin(t * 1.5) * 3.0 * (1.0 - uEnergy * 0.5);
  float r = uRadius + wave + breath;
  
  // Soft edge mask
  float dist = d - r;
  float alphaMask = 1.0 - smoothstep(0.0, 2.0, dist);
  
  if (alphaMask <= 0.0) return vec4(0.0); // Optimization
  
  // 2. INTERNAL MAGIC (Caustics/Smoke)
  // We map the position to UVs modified by time and distortion
  vec2 uv = p / uRadius;
  
  // Marble Swirl: Slower, larger waves
  // Distort UVs based on angle/radius
  vec2 warpedUV = uv + vec2(sin(t * 0.1 + uv.y * 1.5), cos(t * 0.05 + uv.x * 1.5)) * 0.3;
  
  // Generate smoke/cloud pattern
  // Lower frequency fbm for "marble" look
  float cloud = fbm(warpedUV * 1.5 + t * 0.1);
  
  // Caustics: Slower, larger interference
  // Grid fix: Use different frequencies for x and y to avoid perfect grid
  float caustic = sin(uv.x * 3.0 + t * 0.2) * sin(uv.y * 4.0 - t * 0.15) * 0.5 + 0.5;
  
  // 3. LIGHTING (3D Sphere)
  float dist_norm = min(1.0, d / r);
  float z = sqrt(1.0 - dist_norm * dist_norm);
  vec3 normal = normalize(vec3(p.x, p.y, z * 100.0));
  vec3 lightDir = normalize(vec3(-0.5, -0.5, 1.0));
  float diff = max(0.0, dot(normal, lightDir));
  
  // Highlight (Specular)
  float spec = pow(diff, 4.0) * 0.4;
  
  // Rim Light (Fresnel)
  float fresnel = pow(1.0 - z, 2.5);
  
  // 4. COLOR MIXING
  vec3 base = uColor;
  // Add "Magic" secondary color (Cyan/Pink shift) based on cloud density
  vec3 magicColor = vec3(0.4, 0.8, 1.0); // Cyan-ish glow
  vec3 internalColor = mix(base, magicColor, cloud * 0.5 * uEnergy); // More magic when energetic
  
  // Add caustic lines?
  internalColor += vec3(caustic * 0.1);
  
  // Final composition
  // Base + Specular + Rim + Internal Glow
  vec3 finalCol = internalColor * 0.8 + vec3(spec) + (magicColor * fresnel * 0.8);
  
  // Transparency:
  // Edges opaque (Fresnel), center semi-transparent but filled with smoke
  float opacity = 0.6 + fresnel * 0.4 + cloud * 0.2;
  opacity = clamp(opacity * alphaMask, 0.0, 1.0);
  
  return vec4(finalCol * opacity, opacity);
}
`)!;

import { useTheme } from '@/app/ctx';

interface OrbProps {
  style?: ViewStyle;
  isListening?: boolean;
}

export function Orb({ style, isListening = false }: OrbProps) {
  const time = useSharedValue(0);
  const { activeTheme } = useTheme();

  // Convert Hex to RGB [0-1]
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    time.value = withRepeat(
      withTiming(2 * Math.PI * 10, { // Long duration for continuous feel
        duration: 20000,
        easing: Easing.linear
      }),
      -1
    );
  }, []);

  // Flutter Colors: Light #6750A4, Dark #D0BCFF
  // We used Colors.light.tint which is #6750A4. Correct.
  // We used Colors.dark.tint which is #D0BCFF. Correct.

  const lightColor = hexToRgb('#6750A4');
  const darkColor = hexToRgb('#D0BCFF');

  const radius = useDerivedValue(() => {
    // Base radius 130 (matches screenshot size approx) -> 150 when listening
    return withTiming(isListening ? 150 : 130, { duration: 1000, easing: Easing.inOut(Easing.quad) });
  }, [isListening]);

  const energy = useDerivedValue(() => {
    // 0.0 for idle (Circle), 1.0 for listening (Blob)
    return withTiming(isListening ? 1.0 : 0.0, { duration: 1000, easing: Easing.inOut(Easing.quad) });
  }, [isListening]);

  const color = useDerivedValue(() => {
    // Animate color transition could be done here but simple switch covers 99%
    return activeTheme === 'dark' ? darkColor : lightColor;
  }, [activeTheme]);

  const uniforms = useDerivedValue(() => {
    return {
      uTime: time.value,
      uRadius: radius.value,
      uEnergy: energy.value,
      uColor: color.value,
      uResolution: [350, 350],
    };
  });

  return (
    <Canvas style={[styles.canvas, style]}>
      <Fill>
        <Shader source={ORB_SHADER} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: 350,
    height: 350,
  },
});
