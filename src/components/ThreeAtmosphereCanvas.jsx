import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 🌸 Cece Yori 3D Celestial Atmosphere Canvas (Three.js)
 * 4-Phase Dynamic 3D Celestial Visuals:
 * - Pagi (05:00-10:59): 3D Glowing Morning Sun with rotating rays & solar flares
 * - Siang (11:00-14:59): 3D Midday Sun + Procedural 3D Fluffy Clouds drifting
 * - Sore (15:00-18:59): 3D Sunset (Matahari Terbenam) dipping into rose-gold dusk horizon
 * - Malam (19:00-04:59): 3D Glowing Crescent Moon + Twinkling 3D Starfield & Shooting Stars
 */
export default function ThreeAtmosphereCanvas({ mode = 'sore' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 340;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 40;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const animatedItems = [];
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // ─────────────────────────────────────────────
    // ☀️ 1. PAGI: 3D Glowing Morning Sun & Rays
    // ─────────────────────────────────────────────
    if (mode === 'pagi') {
      const sunGroup = new THREE.Group();
      sunGroup.position.set(18, 5, 0);
      masterGroup.add(sunGroup);

      // Sun Core Sphere
      const sunCoreGeom = new THREE.SphereGeometry(6.5, 32, 32);
      const sunCoreMat = new THREE.MeshBasicMaterial({
        color: 0xFFF3B0,
      });
      const sunCore = new THREE.Mesh(sunCoreGeom, sunCoreMat);
      sunGroup.add(sunCore);

      // Glowing Aura Outer Layer
      const glowGeom = new THREE.SphereGeometry(8.2, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xFFA726,
        transparent: true,
        opacity: 0.45,
      });
      const sunGlow = new THREE.Mesh(glowGeom, glowMat);
      sunGroup.add(sunGlow);

      // Rotating Geometric Sunburst Rays
      const rayGroup = new THREE.Group();
      sunGroup.add(rayGroup);

      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const rayGeom = new THREE.ConeGeometry(0.85, 9.5, 4);
        rayGeom.translate(0, 9.5, 0);
        const rayMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xFFD54F : 0xFFB74D,
          transparent: true,
          opacity: 0.75,
        });
        const ray = new THREE.Mesh(rayGeom, rayMat);
        ray.rotation.z = angle;
        rayGroup.add(ray);
      }

      // Golden Solar Flares & Sparkle Dust
      const flareCount = 65;
      const flarePositions = new Float32Array(flareCount * 3);
      for (let i = 0; i < flareCount; i++) {
        flarePositions[i * 3] = (Math.random() - 0.5) * 80;
        flarePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        flarePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      const flareGeom = new THREE.BufferGeometry();
      flareGeom.setAttribute('position', new THREE.BufferAttribute(flarePositions, 3));
      const flareMat = new THREE.PointsMaterial({
        size: 2.4,
        color: 0xFFEE58,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const flarePoints = new THREE.Points(flareGeom, flareMat);
      masterGroup.add(flarePoints);

      animatedItems.push({
        update: (time) => {
          rayGroup.rotation.z = time * 0.15;
          const pulse = 1 + Math.sin(time * 2) * 0.04;
          sunGlow.scale.set(pulse, pulse, pulse);
          flarePoints.rotation.y = time * 0.02;
        }
      });
    }

    // ─────────────────────────────────────────────
    // 🌤️ 2. SIANG: 3D Sun + Drifting Fluffy Clouds
    // ─────────────────────────────────────────────
    else if (mode === 'siang') {
      // 1. High Midday Sun in upper right
      const sunGeom = new THREE.SphereGeometry(5.2, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFEB3B });
      const sunMesh = new THREE.Mesh(sunGeom, sunMat);
      sunMesh.position.set(22, 10, -5);
      masterGroup.add(sunMesh);

      const sunCoronaGeom = new THREE.SphereGeometry(7.0, 32, 32);
      const sunCoronaMat = new THREE.MeshBasicMaterial({
        color: 0x38BDF8,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const sunCorona = new THREE.Mesh(sunCoronaGeom, sunCoronaMat);
      sunMesh.add(sunCorona);

      // 2. Procedural 3D Fluffy Clouds
      const cloudGroup = new THREE.Group();
      masterGroup.add(cloudGroup);

      const clouds = [];
      const createCloud = (startX, startY, startZ, scale = 1.0) => {
        const cGroup = new THREE.Group();
        cGroup.position.set(startX, startY, startZ);

        const cloudMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.8,
          metalness: 0.1,
          transparent: true,
          opacity: 0.88,
        });

        // Combine multiple overlapping spheres to form a fluffy cloud puff
        const puffs = [
          { x: 0, y: 0, z: 0, r: 2.8 },
          { x: -2.2, y: -0.4, z: 0.3, r: 2.2 },
          { x: 2.2, y: -0.5, z: -0.2, r: 2.3 },
          { x: -1.2, y: 1.1, z: -0.4, r: 1.9 },
          { x: 1.1, y: 1.0, z: 0.4, r: 2.0 },
          { x: 3.4, y: -0.8, z: 0.1, r: 1.6 },
        ];

        puffs.forEach((p) => {
          const puffGeom = new THREE.SphereGeometry(p.r * scale, 16, 16);
          const puffMesh = new THREE.Mesh(puffGeom, cloudMat);
          puffMesh.position.set(p.x * scale, p.y * scale, p.z * scale);
          cGroup.add(puffMesh);
        });

        cloudGroup.add(cGroup);
        return {
          group: cGroup,
          speed: 0.025 + Math.random() * 0.02,
          initY: startY,
        };
      };

      // Create 5 clouds floating at various depths
      clouds.push(createCloud(-35, 6, 2, 1.1));
      clouds.push(createCloud(-15, -4, 5, 0.9));
      clouds.push(createCloud(5, 8, -2, 1.2));
      clouds.push(createCloud(25, -2, 4, 1.0));
      clouds.push(createCloud(-45, 1, -4, 0.8));

      // Sky light particles
      const skyDustCount = 45;
      const dustPos = new Float32Array(skyDustCount * 3);
      for (let i = 0; i < skyDustCount; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * 80;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      const dustGeom = new THREE.BufferGeometry();
      dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
      const dustMat = new THREE.PointsMaterial({
        size: 1.8,
        color: 0xE0F2FE,
        transparent: true,
        opacity: 0.7,
      });
      const skyDust = new THREE.Points(dustGeom, dustMat);
      masterGroup.add(skyDust);

      // Light source for soft 3D cloud shading
      const light = new THREE.DirectionalLight(0xFFFFFF, 2.0);
      light.position.set(20, 20, 20);
      scene.add(light);
      const ambLight = new THREE.AmbientLight(0xBAE6FD, 1.2);
      scene.add(ambLight);

      animatedItems.push({
        update: (time) => {
          sunCorona.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
          clouds.forEach((c) => {
            c.group.position.x += c.speed;
            c.group.position.y = c.initY + Math.sin(time + c.group.position.x * 0.1) * 0.5;
            if (c.group.position.x > 45) {
              c.group.position.x = -45;
            }
          });
          skyDust.rotation.y = time * 0.01;
        }
      });
    }

    // ─────────────────────────────────────────────
    // 🌇 3. SORE: 3D Sunset (Matahari Terbenam)
    // ─────────────────────────────────────────────
    else if (mode === 'sore') {
      const sunsetGroup = new THREE.Group();
      sunsetGroup.position.set(16, -4, 0);
      masterGroup.add(sunsetGroup);

      // Large Glowing Sunset Sun dipping below horizon
      const sunGeom = new THREE.SphereGeometry(7.5, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xFF5722 });
      const sunMesh = new THREE.Mesh(sunGeom, sunMat);
      sunsetGroup.add(sunMesh);

      // Warm Rose-Orange Outer Halo
      const haloGeom = new THREE.SphereGeometry(9.8, 32, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xF43F5E,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeom, haloMat);
      sunsetGroup.add(haloMesh);

      // Horizontal Dusk Light Wave Rays (Atmospheric horizon glow)
      const rayGroup = new THREE.Group();
      sunsetGroup.add(rayGroup);

      for (let i = 0; i < 7; i++) {
        const barGeom = new THREE.BoxGeometry(45 + i * 5, 0.4 + i * 0.15, 0.2);
        const barMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xFDA4AF : 0xFB923C,
          transparent: true,
          opacity: 0.45 - i * 0.05,
        });
        const barMesh = new THREE.Mesh(barGeom, barMat);
        barMesh.position.set(0, -3 + i * 0.9, i * 0.2);
        rayGroup.add(barMesh);
      }

      // Warm Dusk Embers & Rose Petals Floating
      const emberCount = 50;
      const emberPos = new Float32Array(emberCount * 3);
      for (let i = 0; i < emberCount; i++) {
        emberPos[i * 3] = (Math.random() - 0.5) * 80;
        emberPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        emberPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      const emberGeom = new THREE.BufferGeometry();
      emberGeom.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
      const emberMat = new THREE.PointsMaterial({
        size: 2.2,
        color: 0xFECDD3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const emberPoints = new THREE.Points(emberGeom, emberMat);
      masterGroup.add(emberPoints);

      animatedItems.push({
        update: (time) => {
          // Slow dip and warm pulsation
          sunMesh.position.y = Math.sin(time * 0.5) * 0.8;
          const pulse = 1 + Math.sin(time * 1.8) * 0.05;
          haloMesh.scale.set(pulse, pulse, pulse);
          emberPoints.rotation.y = time * 0.015;
          rayGroup.position.y = Math.sin(time * 0.5) * 0.5;
        }
      });
    }

    // ─────────────────────────────────────────────
    // 🌙 4. MALAM: 3D Crescent Moon + Stars & Shooting Stars
    // ─────────────────────────────────────────────
    else {
      // 1. 3D Glowing Crescent Moon
      const moonGroup = new THREE.Group();
      moonGroup.position.set(18, 5, 0);
      masterGroup.add(moonGroup);

      // Create Crescent Shape using 2 overlapping spheres (Main Moon Sphere - Inner Subtractive Shadow)
      const moonGeom = new THREE.SphereGeometry(6.0, 32, 32);
      const moonMat = new THREE.MeshStandardMaterial({
        color: 0xEDE9FE,
        emissive: 0xC4B5FD,
        emissiveIntensity: 0.35,
        roughness: 0.5,
        metalness: 0.1,
      });
      const moonMesh = new THREE.Mesh(moonGeom, moonMat);
      moonGroup.add(moonMesh);

      // Crescent Shadow cutout sphere (Dark purple-violet matching night sky)
      const shadowGeom = new THREE.SphereGeometry(5.8, 32, 32);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x2A1B4E, // Blends seamlessly into dark night backdrop
      });
      const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
      shadowMesh.position.set(-2.8, 1.2, 1.2);
      moonGroup.add(shadowMesh);

      // Moon Soft Violet Glow Halo
      const moonHaloGeom = new THREE.SphereGeometry(7.5, 32, 32);
      const moonHaloMat = new THREE.MeshBasicMaterial({
        color: 0xA78BFA,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const moonHalo = new THREE.Mesh(moonHaloGeom, moonHaloMat);
      moonGroup.add(moonHalo);

      // 2. 120+ Twinkling 3D Starfield
      const starCount = 120;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      const colWhite = new THREE.Color(0xFFFFFF);
      const colLilac = new THREE.Color(0xC4B5FD);
      const colPink = new THREE.Color(0xF472B6);

      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 90;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        const pickedCol = i % 3 === 0 ? colWhite : i % 3 === 1 ? colLilac : colPink;
        starColors[i * 3] = pickedCol.r;
        starColors[i * 3 + 1] = pickedCol.g;
        starColors[i * 3 + 2] = pickedCol.b;
      }

      const starGeom = new THREE.BufferGeometry();
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

      const starMat = new THREE.PointsMaterial({
        size: 2.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const starField = new THREE.Points(starGeom, starMat);
      masterGroup.add(starField);

      // 3. Periodic Shooting Star
      const shootGeom = new THREE.CylinderGeometry(0.1, 0.4, 6.0, 8);
      shootGeom.rotateZ(Math.PI / 4);
      const shootMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.0,
      });
      const shootMesh = new THREE.Mesh(shootGeom, shootMat);
      masterGroup.add(shootMesh);

      let shootTime = 0;

      animatedItems.push({
        update: (time) => {
          // Gentle Moon floating & halo breath
          moonGroup.position.y = 5 + Math.sin(time * 0.8) * 0.6;
          moonGroup.rotation.z = Math.sin(time * 0.5) * 0.05;
          moonHalo.scale.setScalar(1 + Math.sin(time * 2) * 0.04);
          starField.rotation.y = time * 0.008;

          // Shooting star cycle every 5 seconds
          shootTime += 0.016;
          if (shootTime > 5.0) {
            shootTime = 0;
            shootMesh.position.set(-25 + Math.random() * 20, 15 + Math.random() * 10, 5);
          }

          if (shootTime < 1.0) {
            shootMesh.position.x += 0.8;
            shootMesh.position.y -= 0.6;
            shootMat.opacity = Math.sin(shootTime * Math.PI) * 0.9;
          } else {
            shootMat.opacity = 0;
          }
        }
      });
    }

    // 4. Mouse Parallax Reaction
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / width - 0.5) * 2;
      mouse.targetY = -(clientY / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 6. Main Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      masterGroup.rotation.y = mouse.x * 0.12;
      masterGroup.rotation.x = -mouse.y * 0.08;

      // Run dynamic updates
      animatedItems.forEach((item) => item.update(elapsed));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[1] overflow-hidden opacity-95 transition-opacity duration-700"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
