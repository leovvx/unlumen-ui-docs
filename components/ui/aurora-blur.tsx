"use client";
/* eslint-disable react/no-unknown-property */

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { cn } from "@workspace/ui/lib/utils";

export interface AuroraLayer {
  color: string;
  speed: number;
  intensity: number;
}

export interface SkyLayer {
  color: string;
  blend: number;
}

export interface AuroraBlurProps extends React.ComponentProps<"div"> {
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  auraMix?: number;
  skyOpacity?: number;
  speed?: number;
  layers?: AuroraLayer[];
  noiseScale?: number;
  movementX?: number;
  movementY?: number;
  verticalFade?: number;
  bloomIntensity?: number;
  skyLayers?: SkyLayer[];
  brightness?: number;
  saturation?: number;
  opacity?: number;
}

const DEFAULT_LAYERS: AuroraLayer[] = [
  { color: "#22d3ee", speed: 0.35, intensity: 0.7 },
  { color: "#3b82f6", speed: 0.18, intensity: 0.65 },
  { color: "#60a5fa", speed: 0.12, intensity: 0.4 },
  { color: "#1d4ed8", speed: 0.08, intensity: 0.22 },
];

const DEFAULT_SKY_LAYERS: SkyLayer[] = [
  { color: "#020617", blend: 0.52 },
  { color: "#0f172a", blend: 0.78 },
];

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_speed;
uniform vec3 u_layer1Color;
uniform float u_layer1Speed;
uniform float u_layer1Intensity;
uniform vec3 u_layer2Color;
uniform float u_layer2Speed;
uniform float u_layer2Intensity;
uniform vec3 u_layer3Color;
uniform float u_layer3Speed;
uniform float u_layer3Intensity;
uniform vec3 u_layer4Color;
uniform float u_layer4Speed;
uniform float u_layer4Intensity;
uniform float u_noiseScale;
uniform float u_movementX;
uniform float u_movementY;
uniform float u_verticalFade;
uniform float u_bloomIntensity;
uniform vec3 u_skyColor1;
uniform vec3 u_skyColor2;
uniform float u_skyBlend1;
uniform float u_skyBlend2;
uniform float u_skyOpacity;
uniform float u_auraMix;
uniform float u_brightness;
uniform float u_saturation;
uniform float u_opacity;
uniform vec3 u_backgroundColor;

float hashNoise(float n) { return fract(sin(n) * 43758.5453123); }

float noise2d(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hashNoise(i.x + hashNoise(i.y)), hashNoise(i.x + 1.0 + hashNoise(i.y)), u.x),
    mix(hashNoise(i.x + hashNoise(i.y + 1.0)), hashNoise(i.x + 1.0 + hashNoise(i.y + 1.0)), u.x),
    u.y
  );
}

vec3 aurora(vec2 uv, float layerSpeed, float intensity, vec3 color, float aspect) {
  float time = u_time * u_speed * layerSpeed;
  vec2 scaled = vec2(uv.x * aspect, uv.y) * u_noiseScale;
  vec2 point = scaled + time * vec2(u_movementX, u_movementY);
  float n = noise2d(point + noise2d(color.xy + point + time));
  float alpha = max(n - uv.y * u_verticalFade, 0.0);
  return color * alpha * intensity * u_bloomIntensity;
}

vec3 saturateColor(vec3 color, float saturation) {
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  return mix(vec3(gray), color, saturation);
}

void main() {
  vec2 uv = vUv;
  float aspect = u_resolution.x / u_resolution.y;

  vec3 baseColor = u_backgroundColor;
  vec3 auraColor = vec3(0.0);

  auraColor += aurora(uv, u_layer1Speed, u_layer1Intensity, u_layer1Color, aspect);
  auraColor += aurora(uv, u_layer2Speed, u_layer2Intensity, u_layer2Color, aspect);
  auraColor += aurora(uv, u_layer3Speed, u_layer3Intensity, u_layer3Color, aspect);
  auraColor += aurora(uv, u_layer4Speed, u_layer4Intensity, u_layer4Color, aspect);

  baseColor +=
    u_skyColor2 * (1.0 - smoothstep(u_skyBlend1, 1.0, uv.y)) * u_skyOpacity;
  baseColor +=
    u_skyColor1 * (1.0 - smoothstep(0.0, u_skyBlend2, uv.y)) * u_skyOpacity;

  vec3 clampedAura = clamp(auraColor, 0.0, 1.0);
  vec3 additiveComposite = baseColor + auraColor;
  vec3 screenComposite = 1.0 - (1.0 - baseColor) * (1.0 - clampedAura);
  vec3 color = mix(additiveComposite, screenComposite, clamp(u_auraMix, 0.0, 1.0));

  color = saturateColor(color, u_saturation) * u_brightness;
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, u_opacity);
}
`;

function hexToVec3(hex: string): [number, number, number] {
  const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!parsed) return [1, 1, 1];

  return [
    parseInt(parsed[1], 16) / 255,
    parseInt(parsed[2], 16) / 255,
    parseInt(parsed[3], 16) / 255,
  ];
}

function colorToVec3(color: string): [number, number, number] {
  if (color.startsWith("#")) return hexToVec3(color);
  if (typeof document === "undefined") return [1, 1, 1];

  const probe = document.createElement("span");
  probe.style.color = color;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  const parsed = resolved.match(/\d+(\.\d+)?/g);
  if (!parsed || parsed.length < 3) return [1, 1, 1];

  return [
    Number(parsed[0]) / 255,
    Number(parsed[1]) / 255,
    Number(parsed[2]) / 255,
  ];
}

interface SceneProps {
  backgroundColor: string;
  auraMix: number;
  skyOpacity: number;
  speed: number;
  layers: AuroraLayer[];
  noiseScale: number;
  movementX: number;
  movementY: number;
  verticalFade: number;
  bloomIntensity: number;
  skyLayers: SkyLayer[];
  brightness: number;
  saturation: number;
  opacity: number;
}

function Scene({
  backgroundColor,
  auraMix,
  skyOpacity,
  speed,
  layers,
  noiseScale,
  movementX,
  movementY,
  verticalFade,
  bloomIntensity,
  skyLayers,
  brightness,
  saturation,
  opacity,
}: SceneProps) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = React.useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_speed: { value: 1 },
      u_layer1Color: { value: new THREE.Vector3(0.13, 0.83, 0.93) },
      u_layer1Speed: { value: 0.35 },
      u_layer1Intensity: { value: 0.7 },
      u_layer2Color: { value: new THREE.Vector3(0.23, 0.51, 0.96) },
      u_layer2Speed: { value: 0.18 },
      u_layer2Intensity: { value: 0.65 },
      u_layer3Color: { value: new THREE.Vector3(0.38, 0.65, 0.98) },
      u_layer3Speed: { value: 0.12 },
      u_layer3Intensity: { value: 0.4 },
      u_layer4Color: { value: new THREE.Vector3(0.11, 0.31, 0.85) },
      u_layer4Speed: { value: 0.08 },
      u_layer4Intensity: { value: 0.22 },
      u_noiseScale: { value: 3.2 },
      u_movementX: { value: -1.4 },
      u_movementY: { value: -2.6 },
      u_verticalFade: { value: 0.5 },
      u_bloomIntensity: { value: 1.9 },
      u_skyColor1: { value: new THREE.Vector3(0.01, 0.02, 0.09) },
      u_skyColor2: { value: new THREE.Vector3(0.06, 0.09, 0.16) },
      u_skyBlend1: { value: 0.78 },
      u_skyBlend2: { value: 0.52 },
      u_skyOpacity: { value: 1 },
      u_auraMix: { value: 0 },
      u_brightness: { value: 0.92 },
      u_saturation: { value: 1.12 },
      u_opacity: { value: 1 },
      u_backgroundColor: { value: new THREE.Vector3(0, 0, 0) },
    }),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;
    const resolvedLayers = layers.length ? layers : DEFAULT_LAYERS;
    const resolvedSkyLayers = skyLayers.length ? skyLayers : DEFAULT_SKY_LAYERS;

    material.uniforms.u_time.value = state.clock.elapsedTime;
    material.uniforms.u_resolution.value.set(size.width, size.height);
    material.uniforms.u_speed.value = speed;

    material.uniforms.u_layer1Color.value.set(
      ...colorToVec3(resolvedLayers[0]?.color ?? DEFAULT_LAYERS[0].color),
    );
    material.uniforms.u_layer1Speed.value =
      resolvedLayers[0]?.speed ?? DEFAULT_LAYERS[0].speed;
    material.uniforms.u_layer1Intensity.value =
      resolvedLayers[0]?.intensity ?? DEFAULT_LAYERS[0].intensity;

    material.uniforms.u_layer2Color.value.set(
      ...colorToVec3(resolvedLayers[1]?.color ?? DEFAULT_LAYERS[1].color),
    );
    material.uniforms.u_layer2Speed.value =
      resolvedLayers[1]?.speed ?? DEFAULT_LAYERS[1].speed;
    material.uniforms.u_layer2Intensity.value =
      resolvedLayers[1]?.intensity ?? DEFAULT_LAYERS[1].intensity;

    material.uniforms.u_layer3Color.value.set(
      ...colorToVec3(resolvedLayers[2]?.color ?? DEFAULT_LAYERS[2].color),
    );
    material.uniforms.u_layer3Speed.value =
      resolvedLayers[2]?.speed ?? DEFAULT_LAYERS[2].speed;
    material.uniforms.u_layer3Intensity.value =
      resolvedLayers[2]?.intensity ?? DEFAULT_LAYERS[2].intensity;

    material.uniforms.u_layer4Color.value.set(
      ...colorToVec3(resolvedLayers[3]?.color ?? DEFAULT_LAYERS[3].color),
    );
    material.uniforms.u_layer4Speed.value =
      resolvedLayers[3]?.speed ?? DEFAULT_LAYERS[3].speed;
    material.uniforms.u_layer4Intensity.value =
      resolvedLayers[3]?.intensity ?? DEFAULT_LAYERS[3].intensity;

    material.uniforms.u_noiseScale.value = noiseScale;
    material.uniforms.u_movementX.value = movementX;
    material.uniforms.u_movementY.value = movementY;
    material.uniforms.u_verticalFade.value = verticalFade;
    material.uniforms.u_bloomIntensity.value = bloomIntensity;
    material.uniforms.u_skyColor1.value.set(
      ...colorToVec3(
        resolvedSkyLayers[0]?.color ?? DEFAULT_SKY_LAYERS[0].color,
      ),
    );
    material.uniforms.u_skyColor2.value.set(
      ...colorToVec3(
        resolvedSkyLayers[1]?.color ?? DEFAULT_SKY_LAYERS[1].color,
      ),
    );
    material.uniforms.u_skyBlend1.value =
      resolvedSkyLayers[1]?.blend ?? DEFAULT_SKY_LAYERS[1].blend;
    material.uniforms.u_skyBlend2.value =
      resolvedSkyLayers[0]?.blend ?? DEFAULT_SKY_LAYERS[0].blend;
    material.uniforms.u_skyOpacity.value = skyOpacity;
    material.uniforms.u_auraMix.value = auraMix;
    material.uniforms.u_brightness.value = brightness;
    material.uniforms.u_saturation.value = saturation;
    material.uniforms.u_opacity.value = opacity;
    material.uniforms.u_backgroundColor.value.set(
      ...colorToVec3(backgroundColor),
    );
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        transparent
        uniforms={uniforms}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

export function AuroraBlur({
  width = "100%",
  height = "100%",
  backgroundColor = "var(--surface)",
  auraMix = 0,
  skyOpacity = 1,
  className,
  children,
  speed = 1.1,
  layers = DEFAULT_LAYERS,
  noiseScale = 3.2,
  movementX = -1.4,
  movementY = -2.6,
  verticalFade = 0.5,
  bloomIntensity = 1.9,
  skyLayers = DEFAULT_SKY_LAYERS,
  brightness = 0.92,
  saturation = 1.12,
  opacity = 1,
  style,
  ...props
}: AuroraBlurProps) {
  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ ...style, width: resolvedWidth, height: resolvedHeight }}
      {...props}
    >
      <Canvas
        camera={{
          bottom: -1,
          left: -1,
          position: [0, 0, 1],
          right: 1,
          top: 1,
          zoom: 1,
        }}
        className="pointer-events-none absolute inset-0 h-full w-full"
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        orthographic
      >
        <Scene
          backgroundColor={backgroundColor}
          auraMix={auraMix}
          bloomIntensity={bloomIntensity}
          brightness={brightness}
          layers={layers}
          movementX={movementX}
          movementY={movementY}
          noiseScale={noiseScale}
          opacity={opacity}
          saturation={saturation}
          skyOpacity={skyOpacity}
          skyLayers={skyLayers}
          speed={speed}
          verticalFade={verticalFade}
        />
      </Canvas>

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  );
}
