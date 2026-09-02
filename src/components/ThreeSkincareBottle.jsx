import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, CheckCircle2 } from 'lucide-react';

/**
 * 🌸 Cece Yori 3D Interactive Skincare Serum Bottle
 * Procedural Luxury 3D Glass Serum Bottle with real-time glowing liquid, internal bubbles, and 360° drag rotation
 */
export default function ThreeSkincareBottle({ progress = 0, mode = 'sore' }) {
  const mountRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Vibrant Theme Colors
  const getThemePalette = () => {
    switch (mode) {
      case 'pagi':
        return { liquid: 0xF59E0B, glow: 0xFBBF24, label: '☀️ Morning Glow Serum' };
      case 'siang':
        return { liquid: 0x0284C7, glow: 0x38BDF8, label: '🌤️ Hydrating Mist' };
      case 'sore':
        return { liquid: 0xE11D48, glow: 0xFB7185, label: '🌇 Rose Glow Essence' };
      case 'malam':
      default:
        return { liquid: 0x7C3AED, glow: 0xC084FC, label: '🌙 Night Repair Elixir' };
    }
  };

  const palette = getThemePalette();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 170;
    const height = 210;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    // 1. Outer Glass Bottle Body (Luxury thick crystal glass)
    const glassGeometry = new THREE.CylinderGeometry(1.2, 1.2, 3.4, 32);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
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

    // 2. Liquid Inside (Vibrant, colorful & glowing with progress!)
    const liquidRatio = Math.max(0.06, Math.min(progress / 100, 1));
    const maxLiquidH = 3.15;
    const liquidHeight = maxLiquidH * liquidRatio;
    const liquidGeometry = new THREE.CylinderGeometry(1.1, 1.1, liquidHeight, 32);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: palette.liquid,
      emissive: palette.glow,
      emissiveIntensity: 0.35 + (progress / 100) * 0.35,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15,
      metalness: 0.1,
    });
    const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidMesh.position.y = -1.6 + liquidHeight / 2;
    bottleGroup.add(liquidMesh);

    // 3. Floating Bubbles inside liquid
    const bubbleCount = 12;
    const bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      const bGeom = new THREE.SphereGeometry(0.06 + Math.random() * 0.05, 8, 8);
      const bMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
      });
      const bMesh = new THREE.Mesh(bGeom, bMat);
      bMesh.position.set(
        (Math.random() - 0.5) * 1.5,
        -1.5 + Math.random() * Math.max(0.5, liquidHeight),
        (Math.random() - 0.5) * 1.5
      );
      bottleGroup.add(bMesh);
      bubbles.push({ mesh: bMesh, speed: 0.01 + Math.random() * 0.015, initialX: bMesh.position.x });
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

    // ── Mouse Drag Rotation Controls ──
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

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating & auto slow-spin if not dragging
      if (!isDragging) {
        bottleGroup.rotation.y += 0.01;
        bottleGroup.position.y = Math.sin(elapsed * 2) * 0.15;
      }

      // Animate bubbles rising
      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y > -1.5 + liquidHeight) {
          b.mesh.position.y = -1.5;
        }
      });

      sparkleRing.rotation.y = -elapsed * 0.9;
      sparkleRing.rotation.z = Math.sin(elapsed * 1.5) * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
    };
  }, [progress, mode]);

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
          <RotateCw size={10} /> Drag 360°
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
          {progress >= 100 && <CheckCircle2 size={15} className="text-green-500" />}
          <p className="font-display font-bold text-sm text-[#3D1F2A]">
            {Math.round(progress)}% Skincare Liquid
          </p>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">
          {progress >= 100 ? '🎉 Botol terisi penuh! Kulit kamu glowing maksimal!' : 'Isi botol naik setiap produk dicentang ✨'}
        </p>
      </div>
    </div>
  );
}
