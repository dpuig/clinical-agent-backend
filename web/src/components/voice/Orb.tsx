'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// --- Shader Definition ---
// Adapted from the mobile Skia shader to standard GLSL for Three.js

const OrbMaterial = shaderMaterial(
	{
		uTime: 0,
		uColor: new THREE.Color(0.2, 0.6, 1.0),
		uEnergy: 0.0,
	},
	// Vertex Shader
	`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uEnergy;

    // Simplex 3D Noise 
    // (Standard implementation)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      i = mod289(i);
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      
      // Displacement
      float noiseVal = snoise(position * 2.0 + uTime * 0.5);
      float displacement = noiseVal * (0.1 + uEnergy * 0.3);
      
      vec3 newPosition = position + normal * displacement;
      vPosition = newPosition;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
	// Fragment Shader
	`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uEnergy;

    // Simple FBM for clouds
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    // 2D Noise for texture
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        // Normalizing
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vPosition);
        
        // Base Color
        vec3 color = uColor;
        
        // Internal "Cloud" movement
        vec2 uv = vUv * 3.0; // Scale UV
        float clouds = fbm(uv + uTime * 0.2);
        
        // Mix internal color
        vec3 magicColor = vec3(0.1, 0.8, 0.9); // Cyan glow
        color = mix(color, magicColor, clouds * uEnergy);

        // Fresnel (Rim Light)
        float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
        color += vec3(1.0) * fresnel * 0.8;

        // Opacity
        float opacity = 0.8 + fresnel * 0.2;
        
        gl_FragColor = vec4(color, opacity);
    }
  `
);

extend({ OrbMaterial });

// --- React Comp ---

function OrbMesh({ isListening }: { isListening: boolean }) {
	const meshRef = useRef<THREE.Mesh>(null);
	const materialRef = useRef<THREE.ShaderMaterial>(null);

	useFrame((state, delta) => {
		if (materialRef.current) {
			materialRef.current.uTime += delta;
			// Smoothly interpolate energy
			const targetEnergy = isListening ? 1.0 : 0.0;
			materialRef.current.uEnergy = THREE.MathUtils.lerp(
				materialRef.current.uEnergy,
				targetEnergy,
				delta * 2
			);
		}
		if (meshRef.current) {
			meshRef.current.rotation.y += delta * 0.1;
		}
	});

	return (
		<Sphere ref={meshRef} args={[1, 128, 128]} scale={2.5}>
			{/* @ts-ignore */}
			<orbMaterial
				ref={materialRef}
				transparent
				uColor={new THREE.Color('#4FD8EB')} // Bio-Digital Primary Light
			/>
		</Sphere>
	);
}

export default function Orb({ isListening = false }: { isListening?: boolean }) {
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 2]}>
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} />
				<OrbMesh isListening={isListening} />
			</Canvas>
		</div>
	);
}
