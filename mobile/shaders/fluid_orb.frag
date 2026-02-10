
#include <flutter/runtime_effect.glsl>

uniform float uTime;
uniform vec2 uResolution;
uniform float uBrightness; // 0.0 = Dark Color, 1.0 = Light Color
uniform float uEnergy;     // 0.0 = Calm (Idle), 1.0 = Energetic (Listening)

out vec4 fragColor;

// --- Noise Functions ---
// Simplex 3D Noise by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
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
    vec2 fragCoord = FlutterFragCoord().xy;
    vec2 uv = fragCoord / uResolution;
    // Normalize coordinates: 0,0 is center, range -1..1
    vec2 p = (fragCoord - 0.5 * uResolution) / min(uResolution.x, uResolution.y) * 2.0;

    // --- LIQUID SHAPE (SDF) ---
    // Zero-G Liquid: A sphere distorted by low-frequency noise
    
    // Physics Parameters based on ENERGY (uEnergy)
    // uEnergy 0.0 (Calm): Slow, gentle wobble
    // uEnergy 1.0 (Active): Fast, turbulent wobble
    
    float speed = mix(0.5, 1.8, uEnergy); // Calm -> Fast
    float t = uTime * speed;
    
    float noiseFreq = mix(0.8, 1.4, uEnergy); // Low freq -> High freq
    float noiseAmp = mix(0.05, 0.15, uEnergy); // Low amp -> High amp
    
    // Signed Distance Function for the distorted sphere
    // d = length(p) - radius + noise
    // We want the surface where d = 0.
    // For rendering 2D slice of 3D blob, we assume z=0 roughly or raymarch.
    // Simpler hack for 2D flutter shader: 
    // We distort the radius `r` based on angle and time.
    
    // 3D Seed for noise
    // We map 2D pixel `p` to a curved surface approx
    float rBase = 0.8;
    
    // Function to get displacement at a point (3D)
    // We treat the 2D plane as a slice through the 3D noise field
    vec3 noiseP = vec3(p * noiseFreq, t);
    float displacement = snoise(noiseP) * noiseAmp;
    
    // Secondary noise for detail ONLY in High Energy
    if (uEnergy > 0.5) {
        displacement += snoise(noiseP * 2.0 + vec3(t)) * noiseAmp * 0.5 * (uEnergy - 0.5) * 2.0;
    }
    
    // Field value
    float dist = length(p) - (rBase + displacement);
    
    // Alpha/Edge Mask
    // smoothstep for anti-aliasing the edge
    float alpha = 1.0 - smoothstep(0.0, 0.02, dist);
    
    if (alpha <= 0.0) {
        fragColor = vec4(0.0);
        return;
    }
    
    // --- FLAT MATERIAL 3 COLOR ---
    // User wants "Material Design 3 colors (There are no gradients or degraded areas)"
    // The shape itself (SDF) provides interest. The color should be flat.
    
    // Use uBrightness for Color Mixing (Light vs Dark Theme)
    // M3 Colors (Neural Violet Theme)
    // Light: Primary #6750A4 -> vec3(0.4, 0.31, 0.64)
    // Dark: Primary #D0BCFF -> vec3(0.81, 0.73, 1.0)
    
    vec3 colLight = vec3(0.4, 0.31, 0.64); // Deep Violet (Primary)
    vec3 colDark = vec3(0.81, 0.73, 1.0);  // Soft Lilac (Primary Dark)
    
    // Mix the two flat colors based on uBrightness
    // uBrightness 1.0 = Light Mode -> colLight
    // uBrightness 0.0 = Dark Mode -> colDark
    vec3 baseColor = mix(colDark, colLight, uBrightness);
    
    // No Tonal Variation. Pure Color.
    vec3 finalColor = baseColor;
    
    // Antialiasing the shape edge
    // Alpha is already computed from SDF
    
    fragColor = vec4(finalColor, alpha);
}
