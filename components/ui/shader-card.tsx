"use client";

import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";

import { cn } from "@/lib/cn";

export interface ShaderCardProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: string;
  speed?: number;
  className?: string;
  fragmentShader?: string;
  autoPlay?: boolean;
  color?: string;
  positionX?: number;
  positionY?: number;
  scale?: number;
  effectRadius?: number;
  effectBoost?: number;
  edgeMin?: number;
  edgeMax?: number;
  falloffPower?: number;
  noiseScale?: number;
  driftX?: number;
  widthFactor?: number;
  widthFactorBottom?: number;
  widthFactorTop?: number;
  waveAmount?: number;
  branchIntensity?: number;
  verticalExtent?: number;
  horizontalExtent?: number;
  blur?: number;
  opacity?: number;
  children?: ReactNode;
}

export default function ShaderCard({
  width = 400,
  height = 500,
  borderRadius = "12px",
  speed = 1,
  className = "",
  fragmentShader,
  autoPlay = true,
  color = "#FF9FFC",
  positionX = 0,
  positionY = 0.1,
  scale = 3,
  effectRadius = 0.9,
  effectBoost = 0.5,
  edgeMin = 0,
  edgeMax = 0.5,
  falloffPower = 2,
  noiseScale = 1.5,
  driftX = 0,
  widthFactor = 0.5,
  widthFactorBottom,
  widthFactorTop,
  waveAmount = 0.5,
  branchIntensity = 0.5,
  verticalExtent = 1.5,
  horizontalExtent = 1.5,
  blur = 0,
  opacity = 1,
  children,
}: ShaderCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(!autoPlay);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : { r: 0, g: 1, b: 1 };
    };

    const rgb = hexToRgb(color);

    const rect = container.getBoundingClientRect();
    const actualWidth = rect.width;
    const actualHeight = rect.height;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(actualWidth, actualHeight, false);
    renderer.setPixelRatio(pixelRatio);

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const bufferWidth = actualWidth * pixelRatio;
    const bufferHeight = actualHeight * pixelRatio;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(bufferWidth, bufferHeight, 1) },
      uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
      uPositionX: { value: positionX },
      uPositionY: { value: positionY },
      uScale: { value: scale },
      uEffectRadius: { value: effectRadius },
      uEffectBoost: { value: effectBoost },
      uEdgeMin: { value: edgeMin },
      uEdgeMax: { value: edgeMax },
      uFalloffPower: { value: falloffPower },
      uNoiseScale: { value: noiseScale },
      uDriftX: { value: driftX },
      uWidthFactorBottom: { value: widthFactorBottom ?? widthFactor },
      uWidthFactorTop: { value: widthFactorTop ?? widthFactor },
      uWaveAmount: { value: waveAmount },
      uBranchIntensity: { value: branchIntensity },
      uVerticalExtent: { value: verticalExtent },
      uHorizontalExtent: { value: horizontalExtent },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const defaultFragmentShader = `
      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec3 uColor;
      uniform float uPositionX;
      uniform float uPositionY;
      uniform float uScale;
      uniform float uEffectRadius;
      uniform float uEffectBoost;
      uniform float uEdgeMin;
      uniform float uEdgeMax;
      uniform float uFalloffPower;
      uniform float uNoiseScale;
      uniform float uDriftX;
      uniform float uWidthFactorBottom;
      uniform float uWidthFactorTop;
      uniform float uWaveAmount;
      uniform float uBranchIntensity;
      uniform float uVerticalExtent;
      uniform float uHorizontalExtent;

      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float simplex3d(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));

        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);

        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;

        vec4 w, d;

        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);

        w = max(0.6 - w, 0.0);

        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);

        w *= w;
        w *= w;
        d *= w;

        return dot(d, vec4(52.0));
      }

      const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
      const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
      const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);

      float simplex3d_fractal(vec3 m) {
        return   0.5333333*simplex3d(m*rot1)
          +0.2666667*simplex3d(2.0*m*rot2)
          +0.1333333*simplex3d(4.0*m*rot3)
          +0.0666667*simplex3d(8.0*m);
      }

      #define NIGHTSPEEDBONUS 1.25
      #define SHAPE 0
      #define BREATHWILDNESS 1
      #define PI 3.14159265359

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        float time = 28.22 + NIGHTSPEEDBONUS * iTime;
        float bignessScale = 1.0 / uNoiseScale;

        vec2 uv = (fragCoord.xy / iResolution.xy) * 2.0 - 1.0;
        float aspect = iResolution.x / iResolution.y;
        uv.x *= aspect;

        float effectiveScale = max(uScale, 0.5);
        uv = uv / effectiveScale;

        float xOffset = mix(-0.8, 0.8, uPositionX);
        uv.x -= xOffset;

        float yOffset = mix(-0.3, 0.8, uPositionY);
        uv.y -= yOffset;

        uv.y *= uVerticalExtent;
        uv.x *= uHorizontalExtent;

        vec2 p = (uv / aspect + 1.0) * 0.5 * iResolution.y / iResolution.y;
        p.x *= aspect;

        vec2 positionFromCenter = uv;
        positionFromCenter /= uEffectRadius;
        float positionFromBottom = 0.5 * (positionFromCenter.y + 1.0);
        float localWidthFactor = mix(uWidthFactorBottom, uWidthFactorTop, clamp(positionFromBottom, 0.0, 1.0));
        positionFromCenter.x /= max(localWidthFactor, 0.001);

        vec2 waveOffset = vec2(0.0);
        waveOffset.x += positionFromBottom * sin(4.0 * positionFromCenter.y - 4.0 * time);
        waveOffset.x += 0.1 * positionFromBottom * sin(4.0 * positionFromCenter.x - 1.561 * time);

        waveOffset.x += uBranchIntensity * 0.15 * sin(8.0 * positionFromCenter.y + time * 2.0);
        waveOffset.x += uBranchIntensity * 0.1 * sin(12.0 * positionFromCenter.y - time * 1.5);
        waveOffset.y += uBranchIntensity * 0.08 * sin(6.0 * positionFromCenter.x + time * 1.8);

        positionFromCenter += uWaveAmount * waveOffset;

        if (SHAPE == 0) {
          positionFromCenter.x += positionFromCenter.x / (1.0 - (positionFromCenter.y));
        } else if (SHAPE == 1) {
          positionFromCenter.x += positionFromCenter.x * positionFromBottom;
        } else if (SHAPE == 2) {
          positionFromCenter.x += sign(positionFromCenter.x) * positionFromBottom;
        }

        float effectMask = clamp(1.0 - length(positionFromCenter), 0.0, 1.0);
        effectMask = 1.0 - pow(1.0 - effectMask, uFalloffPower);

        vec3 p3 = bignessScale * 0.25 * vec3(p.x + time * uDriftX, p.y, 0.0) + vec3(0.0, -time * 0.1, time * 0.025);
        float noise = simplex3d(p3 * 32.0);

        noise += 0.3 * simplex3d(p3 * 64.0 + vec3(time * 0.05, time * 0.03, 0.0));
        noise += 0.15 * simplex3d(p3 * 128.0 - vec3(time * 0.08, 0.0, time * 0.04));

        noise = 0.5 + 0.5 * noise;

        vec3 finalColor = vec3(0.0);
        float finalAlpha = 0.0;

        float value = effectMask * noise;
        value += uEffectBoost * effectMask;

        if (BREATHWILDNESS == 1) {
          float edge = mix(uEdgeMin, uEdgeMax, pow(0.5 * (positionFromCenter.y + 1.0), 1.2));
          float edgedValue = clamp(value - edge, 0.0, 1.0);
          float steppedValue = smoothstep(edge, edge + 0.1, value);
          float highlight = 1.0 - edgedValue;
          float repeatedValue = highlight;

          p3 = bignessScale * 0.1 * vec3(p.x + time * uDriftX, p.y, 0.0) + vec3(0.0, -time * 0.01, time * 0.025);
          noise = simplex3d(p3 * 32.0);
          noise = 0.5 + 0.5 * noise;
          repeatedValue = mix(repeatedValue, noise, 0.65);

          repeatedValue = 0.5 * sin(6.0 * PI * (1.0 - pow(1.0 - repeatedValue, 1.8)) - 0.5 * PI) + 0.5;
          float steppedLines = smoothstep(0.95, 1.0, pow(repeatedValue, 8.0));
          steppedLines = mix(steppedLines, 0.0, 0.8 - noise);
          highlight = max(steppedLines, highlight);

          highlight = pow(highlight, 2.0);

          vec3 effectHighlightColor = mix(uColor * 0.8, uColor * 1.5, p.y);

          float whiteFlash = sin(time * 3.0);
          whiteFlash = pow(whiteFlash, 4.0);
          effectHighlightColor += vec3(0.3, 0.2, 0.2) * whiteFlash;

          vec3 effectBodyColor = mix(uColor * 0.7, uColor * 1.0, p.y);

          finalColor = effectHighlightColor * (steppedValue * highlight);
          finalColor += effectBodyColor * steppedValue;

          float brightness = dot(finalColor, vec3(0.299, 0.587, 0.114));
          float alphaBoost = smoothstep(0.0, 0.3, brightness);
          finalAlpha = steppedValue * mix(0.4, 0.95, alphaBoost);
        }

        fragColor = vec4(finalColor, finalAlpha);
      }

      void main() {
        vec4 colorOut = vec4(0.0);
        mainImage(colorOut, gl_FragCoord.xy);
        gl_FragColor = colorOut;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: fragmentShader || defaultFragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    startTimeRef.current = performance.now();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      if (!isPausedRef.current) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        uniforms.iTime.value = elapsed * speed;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      const newWidth = newRect.width;
      const newHeight = newRect.height;

      renderer.setSize(newWidth, newHeight, false);

      const newBufferWidth = newWidth * pixelRatio;
      const newBufferHeight = newHeight * pixelRatio;
      uniforms.iResolution.value.set(newBufferWidth, newBufferHeight, 1.0);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    width,
    height,
    speed,
    fragmentShader,
    autoPlay,
    color,
    positionX,
    positionY,
    scale,
    effectRadius,
    effectBoost,
    edgeMin,
    edgeMax,
    falloffPower,
    noiseScale,
    driftX,
    widthFactor,
    widthFactorBottom,
    widthFactorTop,
    waveAmount,
    branchIntensity,
    verticalExtent,
    horizontalExtent,
    blur,
    opacity,
  ]);

  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn("relative overflow-hidden bg-card rounded-xl", className)}
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        ...(borderRadius !== "12px" && { borderRadius }),
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          opacity,
        }}
      />

      {children ? (
        <div className="relative z-10 h-full w-full flex flex-col">
          {children}
        </div>
      ) : null}
    </div>
  );
}
