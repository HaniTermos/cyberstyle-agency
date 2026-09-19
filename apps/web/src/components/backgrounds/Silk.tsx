'use client';

import React, { useRef, useEffect, useState } from 'react';

interface SilkProps {
  className?: string;
  speed?: number;
  color?: string;
  accentColor?: string;
}

export function Silk({
  className = '',
  speed = 0.8,
  color = '#05070A',
  accentColor = '#00F0FF',
}: SilkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (!mounted || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader for smooth fluid wave silk sheen
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
        
        float time = u_time * ${speed.toFixed(2)};
        
        // Fluid multi-octave wave distortion
        float d = length(uv);
        float wave1 = sin(uv.x * 2.2 + time * 0.7) * cos(uv.y * 1.8 + time * 0.5);
        float wave2 = sin(uv.x * 3.5 - time * 0.4 + wave1) * sin(uv.y * 3.0 + time * 0.6);
        float wave3 = cos((uv.x + uv.y) * 2.5 + time * 0.8 + wave2);
        
        float intensity = smoothstep(-0.4, 0.8, wave1 + wave2 * 0.5 + wave3 * 0.25);
        
        // Base Deep Obsidian -> Electric Blue sheen
        vec3 baseColor = vec3(0.02, 0.03, 0.05);
        vec3 accent = vec3(0.0, 0.94, 1.0);
        
        vec3 color = mix(baseColor, accent, intensity * 0.22);
        
        // Vignette falloff towards edges
        float vignette = smoothstep(1.8, 0.2, d);
        color *= vignette;
        
        gl_FragColor = vec4(color, 0.75);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    // Full screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;
    let startTime = performance.now();
    let lastRenderTime = 0;
    const TARGET_FPS = 36;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    function resize() {
      if (!canvas) return;
      // Clamp DPR to max 1.25 to prevent GPU stalls on 4K / Retina screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl?.viewport(0, 0, width, height);
      }
    }

    function render(now: number) {
      // Pause completely if canvas is scrolled offscreen or browser tab is hidden
      if (!isIntersecting || !isTabVisible) {
        animationFrameId = 0;
        return;
      }

      // Throttle rendering to TARGET_FPS to preserve GPU and CPU budget
      const elapsedSinceLast = now - lastRenderTime;
      if (elapsedSinceLast < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      lastRenderTime = now - (elapsedSinceLast % FRAME_INTERVAL);

      if (!gl || !program) return;
      resize();

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const elapsed = (now - startTime) / 1000;
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(resolutionLocation, canvas!.width, canvas!.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    function startLoop() {
      if (!animationFrameId && isIntersecting && isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    function stopLoop() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    }

    // 1. IntersectionObserver: pause rendering when scrolled out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isIntersecting = entry?.isIntersecting ?? false;
        if (isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // 2. Page Visibility API & bfcache lifecycle: pause when tab hidden or entering bfcache
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isIntersecting) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handlePageHide = () => {
      isTabVisible = false;
      stopLoop();
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isIntersecting) {
        startLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    // Start initial animation
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [mounted, prefersReducedMotion, speed, color, accentColor]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* SSR & Reduced Motion Dynamic CSS Gradient Fallback */}
      <div
        className="absolute inset-0 bg-radial-at-c from-[#00F0FF]/10 via-[#05070A]/80 to-[#000000] opacity-60 transition-opacity duration-1000"
        style={{ opacity: mounted && !prefersReducedMotion ? 0.3 : 1 }}
      />

      {/* WebGL Native Fluid Shader */}
      {mounted && !prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export default Silk;
