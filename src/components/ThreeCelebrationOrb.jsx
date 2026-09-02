import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Crown, Award, Flame, Star, Zap } from 'lucide-react';

const STORAGE_VIBES_KEY = 'ceceyori_glow_vibes_count';

// 🔮 Fun Affirmations & Beauty Fortunes
const BEAUTY_FORTUNES = [
  'Aura kecantikan Cece hari ini 1000% dewy & mempesona! 💖',
  'Pori-pori wajahmu berterima kasih karena dirawat dengan penuh cinta 🌸',
  'Level glowing kamu sudah melampaui standar bidadari! ✨',
  'Kulit kenyal, sehat, dan bebas jerawat siap menemanimu besok 💆‍♀️',
  'Kamu adalah versi tercantik dari dirimu hari ini 👑',
  'Energi positif dan skincare rutin bikin kamu awet muda selamanya! 🍓',
  'Skincare bukan sekadar rutinitas, tapi bentuk self-love terbaikmu 🥰',
  'Aroma serum dan ketelatenanmu membuahkan glass skin sempurna! 💎',
  'Kecantikan alami Cece makin bersinar terang benderang 🌟',
  'Selamat! Kamu resmi menyandang gelar Ratu Skincare No. 1 🦄',
];

export default function ThreeCelebrationOrb({ streak = 1, mode = 'sore' }) {
  const mountRef = useRef(null);
  const orbMeshRef = useRef(null);
  const wireMeshRef = useRef(null);
  const burstParticlesRef = useRef([]);

  // Load saved vibes from localStorage (Default 334 if already clicked!)
  const [vibes, setVibes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_VIBES_KEY);
    return saved !== null ? parseInt(saved, 10) : 334;
  });

  const [currentFortune, setCurrentFortune] = useState(BEAUTY_FORTUNES[0]);
  const [floatingIcons, setFloatingIcons] = useState([]);
  const [isPulsing, setIsPulsing] = useState(false);

  // Calculate Level & Title
  const getLevelInfo = (count) => {
    if (count >= 1000) return { level: 8, title: 'Immortal Glow Deity 🌌', color: 'from-amber-500 to-rose-500', icon: Crown };
    if (count >= 500) return { level: 7, title: 'Cosmic Glass Skin 💎', color: 'from-purple-600 to-pink-600', icon: Star };
    if (count >= 334) return { level: 6, title: 'Transcendent Empress 🦄', color: 'from-pink-500 to-purple-600', icon: Award };
    if (count >= 200) return { level: 5, title: 'Glass Skin Goddess 👑', color: 'from-rose-500 to-amber-500', icon: Flame };
    if (count >= 100) return { level: 4, title: 'Dewy Princess 🌸', color: 'from-pink-500 to-rose-400', icon: Sparkles };
    if (count >= 50) return { level: 3, title: 'Radiant Glow Queen ✨', color: 'from-violet-500 to-pink-500', icon: Heart };
    if (count >= 20) return { level: 2, title: 'Rose Quartz Aura 🌷', color: 'from-sky-500 to-purple-500', icon: Zap };
    return { level: 1, title: 'Baby Glow Starter 🌱', color: 'from-emerald-500 to-teal-500', icon: Sparkles };
  };

  const levelInfo = getLevelInfo(vibes);
  const LevelIcon = levelInfo.icon;

  const getThemeHex = () => {
    switch (mode) {
      case 'pagi': return 0xF59E0B;
      case 'siang': return 0x0EA5E9;
      case 'sore': return 0xD06885;
      case 'malam': default: return 0x8B5CF6;
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_VIBES_KEY, vibes.toString());
  }, [vibes]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 170;
    const height = 155;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(getThemeHex(), 4.0, 25);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 6, 5);
    scene.add(dirLight);

    // ── 3D Crystal Gemstone Orb ──
    const group = new THREE.Group();
    scene.add(group);

    const orbGeometry = new THREE.IcosahedronGeometry(1.35, 2);
    const orbMaterial = new THREE.MeshPhysicalMaterial({
      color: getThemeHex(),
      emissive: getThemeHex(),
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.25,
      transmission: 0.75,
      ior: 1.65,
      transparent: true,
      opacity: 0.9,
    });
    const orbMesh = new THREE.Mesh(orbGeometry, orbMaterial);
    group.add(orbMesh);
    orbMeshRef.current = orbMesh;

    // Outer Wireframe Crystal Cage
    const wireGeometry = new THREE.IcosahedronGeometry(1.55, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    group.add(wireMesh);
    wireMeshRef.current = wireMesh;

    // Orbital Particle Dust Ring
    const partCount = 40;
    const partGeom = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      const theta = (i / partCount) * Math.PI * 2;
      partPos[i * 3] = Math.cos(theta) * 2.3;
      partPos[i * 3 + 1] = Math.sin(theta * 3) * 0.4;
      partPos[i * 3 + 2] = Math.sin(theta) * 2.3;
    }
    partGeom.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const orbitalPoints = new THREE.Points(partGeom, partMat);
    group.add(orbitalPoints);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let speedMultiplier = 1.0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth decay of spin speed multiplier
      if (speedMultiplier > 1.0) {
        speedMultiplier -= 0.02;
      }

      orbMesh.rotation.x += 0.008 * speedMultiplier;
      orbMesh.rotation.y += 0.012 * speedMultiplier;

      wireMesh.rotation.x -= 0.006 * speedMultiplier;
      wireMesh.rotation.y -= 0.01 * speedMultiplier;

      orbitalPoints.rotation.y = t * 0.9 * speedMultiplier;
      orbitalPoints.rotation.z = Math.sin(t * 1.5) * 0.35;

      // Pulsating breath
      const scale = 1 + Math.sin(t * 2.5) * 0.06;
      group.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
    };
  }, [mode, streak]);

  // 🌟 Click Handler: Tap to Level Up & Release Fortune
  const handleOrbClick = (e) => {
    const nextCount = vibes + 1;
    setVibes(nextCount);
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);

    // 1. Pick a random sweet beauty fortune
    const randomFortune = BEAUTY_FORTUNES[Math.floor(Math.random() * BEAUTY_FORTUNES.length)];
    setCurrentFortune(randomFortune);

    // 2. Spawn floating heart/star animation
    const id = Date.now() + Math.random();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFloatingIcons((prev) => [...prev, { id, x, y, icon: Math.random() > 0.5 ? '💖' : '✨' }]);
    setTimeout(() => {
      setFloatingIcons((prev) => prev.filter((item) => item.id !== id));
    }, 1000);

    // 3. Milestone Confetti Explosions!
    if (nextCount === 334 || nextCount % 50 === 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E08AA4', '#9B4B62', '#D4AF37', '#A78BFA'],
      });
    }
  };

  return (
    <div
      onClick={handleOrbClick}
      className={`relative bg-gradient-to-b from-white/95 via-pink-50/40 to-purple-50/50 backdrop-blur-md border border-pink-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center cursor-pointer select-none overflow-hidden active:scale-98 ${isPulsing ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
    >
      {/* Floating particles onClick */}
      {floatingIcons.map((item) => (
        <span
          key={item.id}
          className="absolute text-base pointer-events-none animate-float-up z-20"
          style={{ left: `${item.x}px`, top: `${item.y}px` }}
        >
          {item.icon}
        </span>
      ))}

      {/* Header Level Badge */}
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1">
          <Sparkles size={11} className="text-purple-500 animate-spin" style={{ animationDuration: '6s' }} /> 3D Glow Crystal
        </span>
        <span className="text-[9px] text-white font-bold bg-gradient-to-r from-pink-500 to-purple-600 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <LevelIcon size={10} /> Lv.{levelInfo.level}
        </span>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full flex justify-center my-1" style={{ height: '145px' }} />

      {/* Title & Vibes Count */}
      <div className="w-full text-center mt-1">
        <p className="font-display font-bold text-xs text-[#3D1F2A] flex items-center justify-center gap-1">
          {levelInfo.title}
        </p>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          <span className="text-xs font-mono font-bold text-purple-600">
            {vibes.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Glow Energy</span>
        </div>
      </div>

      {/* Sweet Daily Fortune Card */}
      <div className="w-full mt-2 p-2 bg-white/80 rounded-xl border border-pink-100/80 shadow-xs text-center">
        <p className="text-[10px] text-rose-700 font-medium leading-relaxed italic">
          "{currentFortune}"
        </p>
        <span className="text-[8px] text-slate-400 mt-1 block">
          👆 Tap kristal untuk ramalan glowing baru & partikel cinta!
        </span>
      </div>
    </div>
  );
}
