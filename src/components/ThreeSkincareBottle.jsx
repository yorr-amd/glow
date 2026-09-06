import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * 🌸 3D Interactive Skincare Serum Bottle with Smooth Animated Liquid Filling
 * Procedural Luxury 3D Glass Serum Bottle with real-time glowing liquid, internal bubbles, and 360° drag rotation
 */
export default function ThreeSkincareBottle({ progress = 0, mode = 'sore' }) {
  const { t } = useLanguage();
  const mountRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const progressRef = useRef(progress);

  // Keep progressRef in sync with prop without re-mounting the Three.js scene
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Smooth numeric counter animation for percentage display
  const [displayPercent, setDisplayPercent] = useState(progress);
  useEffect(() => {
    const target = Math.round(progress);
    const timer = setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev === target) {
          clearInterval(timer);
          return target;
        }
        const diff = target - prev;
        const delta = Math.abs(diff) <= 2 ? diff : Math.round(diff * 0.25) || (diff > 0 ? 1 : -1);
        return prev + delta;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [progress]);

  // Vibrant Theme Colors & Translated Labels
  const getThemePalette = () => {
    switch (mode) {
      case 'pagi':
        return { liquid: 0xF59E0B, glow: 0xFBBF24, label: t('bottle.morningLabel', '☀️ Morning Glow Serum') };
      case 'siang':
        return { liquid: 0x0284C7, glow: 0x38BDF8, label: t('bottle.afternoonLabel', '🌤️ Hydrating Mist') };
      case 'sore':
        return { liquid: 0xE11D48, glow: 0xFB7185, label: t('bottle.eveningLabel', '🌇 Rose Glow Essence') };
      case 'malam':
      default:
        return { liquid: 0x7C3AED, glow: 0xC084FC, label: t('bottle.nightLabel', '🌙 Night Repair Elixir') };
    }
  };

  const palette = getThemePalette();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const width = container.clientWidth || 170;
    const height = 210;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // Renderer (Lightweight & optimized for mobile GPU)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(palette.glow, 2.0);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // ── 3D Bottle Group ──
    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    // 1. Outer Glass Bottle Body (Optimized standard glass for mobile smoothness)
    const glassGeometry = new THREE.CylinderGeometry(1.2, 1.2, 3.4, isMobile ? 20 : 32);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.15,
    });
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.position.y = 0;
    bottleGroup.add(glassMesh);

    // Glass Base Bottom
    const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.position.y = -1.75;
    bottleGroup.add(baseMesh);

    // 2. Liquid Inside (Smooth procedural filling from bottom)
    const maxLiquidH = 3.15;
    const liquidGeometry = new THREE.CylinderGeometry(1.1, 1.1, maxLiquidH, 32);
    // Translate geometry pivot so bottom is at local y = 0
    liquidGeometry.translate(0, maxLiquidH / 2, 0);

    const initialRatio = Math.max(0.04, Math.min(progressRef.current / 100, 1));
    let currentLiquidRatio = initialRatio;

    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: palette.liquid,
      emissive: palette.glow,
      emissiveIntensity: 0.35 + initialRatio * 0.35,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15,
      metalness: 0.1,
    });
    const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidMesh.position.y = -1.6; // base of inner bottle
    liquidMesh.scale.set(1, initialRatio, 1);
    bottleGroup.add(liquidMesh);

    // 3. Floating Bubbles inside liquid
    const bubbleCount = 14;
    const bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      const bGeom = new THREE.SphereGeometry(0.05 + Math.random() * 0.05, 8, 8);
      const bMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
      });
      const bMesh = new THREE.Mesh(bGeom, bMat);
      bMesh.position.set(
        (Math.random() - 0.5) * 1.3,
        -1.5 + Math.random() * Math.max(0.4, maxLiquidH * initialRatio),
        (Math.random() - 0.5) * 1.3
      );
      bottleGroup.add(bMesh);
      bubbles.push({ mesh: bMesh, speed: 0.008 + Math.random() * 0.015, initialX: bMesh.position.x });
    }

    // 4. Gold Collar & Dropper Cap
    const neckGeometry = new THREE.CylinderGeometry(0.7, 0.8, 0.45, 32);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xE5C158,
      emissive: 0x855D10,
      emissiveIntensity: 0.2,
      metalness: 0.95,
      roughness: 0.15,
    });
    const neckMesh = new THREE.Mesh(neckGeometry, goldMaterial);
    neckMesh.position.y = 1.9;
    bottleGroup.add(neckMesh);

    // Glossy White Pipette Body
    const capGeometry = new THREE.CylinderGeometry(0.58, 0.58, 0.85, 32);
    const whiteCapMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.1,
    });
    const capMesh = new THREE.Mesh(capGeometry, whiteCapMaterial);
    capMesh.position.y = 2.5;
    bottleGroup.add(capMesh);

    // Soft Pink Rubber Dropper Bulb
    const dropperGeometry = new THREE.SphereGeometry(0.38, 16, 16);
    dropperGeometry.scale(1, 1.35, 1);
    const dropperMaterial = new THREE.MeshStandardMaterial({
      color: 0xF472B6,
      emissive: 0x9D174D,
      emissiveIntensity: 0.15,
      roughness: 0.4,
    });
    const dropperMesh = new THREE.Mesh(dropperGeometry, dropperMaterial);
    dropperMesh.position.y = 3.1;
    bottleGroup.add(dropperMesh);

    // Orbiting Sparkle Dust
    const ringCount = 24;
    const ringGeom = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      ringPositions[i * 3] = Math.cos(angle) * 1.8;
      ringPositions[i * 3 + 1] = Math.sin(angle * 3) * 0.5;
      ringPositions[i * 3 + 2] = Math.sin(angle) * 1.8;
    }
    ringGeom.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
    const ringMat = new THREE.PointsMaterial({
      size: 0.18,
      color: palette.glow,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const sparkleRing = new THREE.Points(ringGeom, ringMat);
    bottleGroup.add(sparkleRing);

    // ── Mouse & Touch Drag Rotation Controls ──
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      bottleGroup.rotation.y += deltaX * 0.018;
      bottleGroup.rotation.x += deltaY * 0.012;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile touch events
    const onTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || !e.touches || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      bottleGroup.rotation.y += deltaX * 0.018;
      bottleGroup.rotation.x += deltaY * 0.012;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Viewport Visibility Observer (Pause offscreen animation to preserve mobile GPU)
    let isVisible = true;
    let observer = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new window.IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return; // Skip calculation when offscreen!

      const elapsed = clock.getElapsedTime();

      // Smooth lerp animated liquid level filling up or down!
      const targetRatio = Math.max(0.04, Math.min(progressRef.current / 100, 1));
      currentLiquidRatio += (targetRatio - currentLiquidRatio) * 0.08;
      liquidMesh.scale.y = currentLiquidRatio;
      liquidMaterial.emissiveIntensity = 0.3 + currentLiquidRatio * 0.45;

      const currentLiquidTop = -1.6 + maxLiquidH * currentLiquidRatio;

      // Gentle floating & auto slow-spin if not dragging
      if (!isDragging) {
        bottleGroup.rotation.y += 0.01;
        bottleGroup.position.y = Math.sin(elapsed * 2) * 0.15;
      }

      // Animate bubbles rising dynamically within current liquid level
      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y > currentLiquidTop - 0.05) {
          b.mesh.position.y = -1.55;
          b.mesh.position.x = (Math.random() - 0.5) * 1.3;
        }
        b.mesh.visible = currentLiquidRatio > 0.08;
      });

      sparkleRing.rotation.y = -elapsed * 0.9;
      sparkleRing.rotation.z = Math.sin(elapsed * 1.5) * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
    };
  }, [mode]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-gradient-to-b from-white/90 via-white/80 to-pink-50/60 backdrop-blur-md border border-pink-200/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center select-none overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none blur-2xl -z-10"
        style={{
          background: `radial-gradient(circle at center, #${palette.glow.toString(16)}, transparent 70%)`
        }}
      />

      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D06885] flex items-center gap-1">
          <Sparkles size={12} className="text-pink-500 animate-pulse" /> {palette.label}
        </span>
        <span className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5 bg-white/70 px-2 py-0.5 rounded-full border border-pink-100">
          <RotateCw size={10} /> {t('bottle.dragTip', 'Drag / Touch 360°')}
        </span>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full flex justify-center cursor-grab active:cursor-grabbing my-1"
        style={{ height: '210px' }}
      />

      {/* Progress Footer */}
      <div className="w-full text-center mt-1 pt-2 border-t border-pink-100/60">
        <div className="flex items-center justify-center gap-1.5">
          {progress >= 100 && <CheckCircle2 size={15} className="text-green-500 animate-scale-in" />}
          <p className="font-display font-bold text-sm text-[#3D1F2A]">
            {displayPercent}% {t('bottle.liquidTitle', 'Skincare Liquid')}
          </p>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">
          {progress >= 100
            ? t('bottle.fullDone', '🎉 Botol terisi penuh! Kulit kamu glowing maksimal!')
            : t('bottle.fillingUp', 'Isi botol naik setiap produk dicentang ✨')}
        </p>
      </div>
    </div>
  );
}
