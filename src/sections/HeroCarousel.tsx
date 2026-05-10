import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const IMAGE_PATHS = [
  '/images/img-hero-1.jpg',
  '/images/img-hero-2.jpg',
  '/images/img-hero-3.jpg',
  '/images/img-hero-4.jpg',
  '/images/img-hero-5.jpg',
  '/images/img-hero-6.jpg',
  '/images/img-hero-7.jpg',
  '/images/img-hero-8.jpg',
  '/images/img-hero-9.jpg',
];

interface Config {
  rows: number;
  planesPerRow: number;
  planeWidth: number;
  planeHeight: number;
  gap: number;
  radius: number;
  speed: number;
  waveAmplitude: number;
  waveFrequency: number;
  tiltStrength: number;
}

const CONFIG: Config = {
  rows: 3,
  planesPerRow: 12,
  planeWidth: 1.8,
  planeHeight: 1.2,
  gap: 0.1,
  radius: 6.5,
  speed: 0.25,
  waveAmplitude: 0.6,
  waveFrequency: 1.8,
  tiltStrength: 0.35,
};

function isMobileDevice(container: HTMLElement): boolean {
  return container.clientWidth < 768;
}

function getResponsiveConfig(container: HTMLElement): Config {
  if (isMobileDevice(container)) {
    return {
      ...CONFIG,
      planesPerRow: 8,
      radius: 5,
      planeWidth: 1.4,
    };
  }
  return CONFIG;
}

export default function HeroCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!container || !canvas || !overlay) return;

    const config = getResponsiveConfig(container);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0C0A09');

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.1,
      100
    );
    camera.position.set(0, 0, 8); // Moved camera back from 5 to 8
    camera.lookAt(0, 0, 0);

    // Load textures
    const loader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];
    let loadedCount = 0;

    const planes: THREE.Mesh[][] = [[], [], []];
    let animationId: number;
    let scrollVelocity = 0;
    let currentSpeed = 0;
    const targetSpeed = config.speed;
    let isVisible = true;

    function updateWave(
      plane: THREE.Mesh,
      index: number,
      rowIndex: number,
      time: number
    ) {
      const positionAttribute = plane.geometry.attributes.position;
      const originalPositions = plane.userData.originalPositions as Float32Array;
      if (!originalPositions || !positionAttribute) return;

      const wavePhase = rowIndex * Math.PI * 0.4 + index * 0.3;

      for (let i = 0; i < positionAttribute.count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        const waveX =
          Math.sin(time * config.waveFrequency + wavePhase + oy * 2.0) *
          config.waveAmplitude;
        const waveY =
          Math.cos(
            time * config.waveFrequency * 0.8 + wavePhase + ox * 1.5
          ) *
          (config.waveAmplitude * 0.6);
        const waveZ =
          Math.sin(
            time * config.waveFrequency * 1.2 + wavePhase + ox * 0.5
          ) *
          (config.waveAmplitude * 0.3);

        positionAttribute.setXYZ(i, ox + waveX, oy + waveY, oz + waveZ);
      }
      positionAttribute.needsUpdate = true;
      plane.geometry.computeVertexNormals();
    }

    function createPlanes() {
      const geometry = new THREE.PlaneGeometry(
        config.planeWidth,
        config.planeHeight,
        32,
        32
      );

      for (let row = 0; row < config.rows; row++) {
        for (let i = 0; i < config.planesPerRow; i++) {
          const texIndex = i % textures.length;
          const material = new THREE.MeshBasicMaterial({
            map: textures[texIndex] || null,
            side: THREE.DoubleSide,
          });

          const mesh = new THREE.Mesh(geometry.clone(), material);

          // Store original positions
          const posAttr = mesh.geometry.attributes.position;
          const origPositions = new Float32Array(posAttr.count * 3);
          for (let v = 0; v < posAttr.count; v++) {
            origPositions[v * 3] = posAttr.getX(v);
            origPositions[v * 3 + 1] = posAttr.getY(v);
            origPositions[v * 3 + 2] = posAttr.getZ(v);
          }
          mesh.userData.originalPositions = origPositions;

          // Cylindrical layout
          const angle =
            (i / (config.planesPerRow - 1)) * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * config.radius;
          const y = (row - 1) * (config.planeHeight + config.gap);

          mesh.position.set(
            x,
            y,
            Math.sin(angle) * config.radius * 0.5
          );
          mesh.rotation.y = -angle + Math.PI / 2;

          scene.add(mesh);
          planes[row].push(mesh);
        }
      }
    }

    function updateCarousel(delta: number, time: number) {
      scrollVelocity *= 0.95;
      scrollVelocity = Math.max(-2, Math.min(2, scrollVelocity));

      const effectiveSpeed = config.speed + scrollVelocity * 0.5;

      planes.forEach((row, rowIndex) => {
        row.forEach((plane, index) => {
          plane.position.x += effectiveSpeed * delta * 60;

          if (plane.position.x > config.radius + 2) {
            plane.position.x -=
              (config.planeWidth + config.gap) * config.planesPerRow;
          }

          updateWave(plane, index, rowIndex, time);
        });
      });

      // Brightness flash
      const brightness = 1.2 + Math.abs(scrollVelocity) * 4;
      if (overlay) overlay.style.filter = `brightness(${brightness})`;
    }

    // Load all textures then create planes
    IMAGE_PATHS.forEach((path) => {
      loader.load(
        path,
        (texture: THREE.Texture) => {
          texture.flipY = false; // Fix for WebGL 2 texture upload
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          textures.push(texture);
          loadedCount++;
          if (loadedCount === IMAGE_PATHS.length) {
            createPlanes();
            startAnimation();
            triggerTitleEntrance();
          }
        },
        undefined,
        (err) => {
          console.error(`Error loading texture: ${path}`, err);
          loadedCount++; // Increment anyway to proceed
          if (loadedCount === IMAGE_PATHS.length) {
            createPlanes();
            startAnimation();
            triggerTitleEntrance();
          }
        }
      );
    });

    function triggerTitleEntrance() {
      if (titleRef.current) {
        const children = titleRef.current.children;
        setTimeout(() => {
          (children[0] as HTMLElement).style.opacity = '1';
          (children[0] as HTMLElement).style.transform = 'translateY(0)';
        }, 1000);
        setTimeout(() => {
          (children[1] as HTMLElement).style.opacity = '1';
          (children[1] as HTMLElement).style.transform = 'translateY(0)';
        }, 1300);
        setTimeout(() => {
          (children[2] as HTMLElement).style.opacity = '1';
          (children[2] as HTMLElement).style.transform = 'translateY(0)';
        }, 1600);
      }
    }

    let lastTime = 0;
    function animate(timeMs: number) {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const time = timeMs * 0.001;
      const delta = lastTime ? (timeMs - lastTime) / 1000 : 0.016;
      lastTime = timeMs;

      // Ramp up speed on load
      if (currentSpeed < targetSpeed) {
        currentSpeed += (targetSpeed - currentSpeed) * 0.02;
      }

      updateCarousel(delta, time);
      renderer.render(scene, camera);
    }

    function startAnimation() {
      lastTime = 0;
      animationId = requestAnimationFrame(animate);
    }

    // Wheel handler
    function onWheel(event: WheelEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        scrollVelocity += event.deltaY * 0.005;

        // Only prevent default if velocity is low (don't block navigation)
        if (Math.abs(scrollVelocity) < 0.5) {
          // Allow normal scroll
        }
      }
    }

    container.addEventListener('wheel', onWheel, { passive: true });

    // Visibility observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();
      observer.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#0C0A09',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Gradient overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          background:
            'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(12,10,9,0.6) 0%, transparent 100%)',
          filter: 'brightness(1.2)',
          transition: 'filter 0.1s ease-out',
          pointerEvents: 'none',
        }}
      />

      {/* Hero text */}
      <div
        ref={titleRef}
        style={{
          position: 'absolute',
          bottom: '12vh',
          left: '5vw',
          zIndex: 3,
          maxWidth: '700px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 400,
            color: '#F5F0EB',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
            margin: 0,
          }}
        >
          <span style={{ fontWeight: 400 }}>Incredible</span>{' '}
          <span style={{ fontWeight: 600 }}>India</span>
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(16px, 1.5vw, 20px)',
            fontWeight: 400,
            color: 'rgba(245,240,235,0.8)',
            letterSpacing: '0.02em',
            marginTop: '16px',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
          }}
        >
          A Journey Through Timeless Wonders
        </p>
        <a
          href="#destinations"
          style={{
            display: 'inline-block',
            marginTop: '40px',
            padding: '14px 36px',
            border: '1px solid rgba(245,240,235,0.4)',
            borderRadius: '50px',
            color: '#F5F0EB',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.4s ease',
            opacity: 0,
            transform: 'translateY(30px)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = '#D4A03C';
            el.style.color = '#1C1917';
            el.style.borderColor = '#D4A03C';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = 'transparent';
            el.style.color = '#F5F0EB';
            el.style.borderColor = 'rgba(245,240,235,0.4)';
          }}
        >
          Begin Your Journey
        </a>
      </div>
    </div>
  );
}
