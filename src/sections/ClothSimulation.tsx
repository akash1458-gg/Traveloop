import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const GRID_SIZE = 40;

const PHYSICS_VERTEX_SHADER = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const PHYSICS_FRAGMENT_SHADER = `
  precision highp float;
  uniform sampler2D u_physics;
  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform vec2 u_pointerDelta;
  uniform float u_speed;
  uniform float u_vertexWidth;
  varying vec2 v_uv;

  float encode(float v) {
    return (v + 20.0) / 40.0;
  }

  float decode(float v) {
    return v * 40.0 - 20.0;
  }

  void main() {
    vec2 texel = 1.0 / u_resolution;
    vec2 uv = v_uv;
    vec4 raw = texture2D(u_physics, uv);

    float x = decode(raw.x);
    float y = decode(raw.y);
    float vx = decode(raw.z);
    float vy = decode(raw.w);

    float x0 = decode(texture2D(u_physics, uv + vec2(-texel.x, 0)).x);
    float x1 = decode(texture2D(u_physics, uv + vec2(texel.x, 0)).x);
    float y0 = decode(texture2D(u_physics, uv + vec2(0, -texel.y)).y);
    float y1 = decode(texture2D(u_physics, uv + vec2(0, texel.y)).y);

    float fx = (x0 + x1 - 2.0 * x) * 0.25;
    float fy = (y0 + y1 - 2.0 * y) * 0.25;

    fy -= 0.00005 * u_speed;

    float dx = uv.x - u_pointer.x;
    float dy = uv.y - u_pointer.y;
    float d = sqrt(dx * dx + dy * dy);
    float p = max(0.0, 1.0 - d / (5.0 * u_vertexWidth));
    p = p * p * (3.0 - 2.0 * p);

    if (length(u_pointerDelta) > 0.0) {
      fx += p * (u_pointerDelta.x - vx) * 0.9;
      fy += p * (u_pointerDelta.y - vy) * 0.9;
    }

    vx = (vx + fx) * 0.998;
    vy = (vy + fy) * 0.998;

    x += vx * u_speed;
    y += vy * u_speed;

    float gx = sin(uv.x * 3.14159) * 0.0005 * u_speed;
    float gy = cos(uv.y * 3.14159) * 0.0005 * u_speed;
    x += gx;
    y += gy;

    x = clamp(x, -20.0, 20.0);
    y = clamp(y, -20.0, 20.0);

    gl_FragColor = vec4(encode(x), encode(y), encode(vx), encode(vy));
  }
`;

const DISPLAY_VERTEX_SHADER = `
  uniform sampler2D u_texture;
  uniform float u_textureResolution;
  uniform float u_cssWidth;
  uniform float u_cssHeight;
  uniform float u_textureWidth;
  uniform float u_textureHeight;
  varying vec2 v_uv;

  void main() {
    vec2 pixel = vec2(
      mod(gl_InstanceID, int(u_textureResolution)),
      float(gl_InstanceID) / u_textureResolution
    );
    vec2 p = pixel / u_textureResolution;
    vec4 t = texture2D(u_texture, p);

    float x_offset = t.x * 40.0 - 20.0;
    float y_offset = t.y * 40.0 - 20.0;

    vec2 aspect = vec2(u_textureWidth / u_cssWidth, u_textureHeight / u_cssHeight);
    vec2 transformed = position.xy * aspect + vec2(x_offset, y_offset);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 0.0, 1.0);
    v_uv = uv;
  }
`;

const DISPLAY_FRAGMENT_SHADER = `
  precision highp float;
  uniform sampler2D u_clothTexture;
  varying vec2 v_uv;

  void main() {
    gl_FragColor = texture2D(u_clothTexture, v_uv);
  }
`;

export default function ClothSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let animationId: number;
    let isActive = false;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const canvasWidth = container.clientWidth || 800;
    const canvasHeight = canvasWidth * 1.36; // ~660:900 aspect
    renderer.setSize(canvasWidth, canvasHeight);

    // Physics scene
    const physicsScene = new THREE.Scene();
    const physicsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const physicsGeometry = new THREE.PlaneGeometry(2, 2);

    // Ping-pong render targets
    let rt0 = new THREE.WebGLRenderTarget(GRID_SIZE, GRID_SIZE, {
      type: THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
    });
    let rt1 = rt0.clone();
    let activeRT = rt0;
    let inactiveRT = rt1;

    // Initialize physics data (rest state)
    const initData = new Float32Array(GRID_SIZE * GRID_SIZE * 4);
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      initData[i * 4] = 0.5; // x = 0 (encoded)
      initData[i * 4 + 1] = 0.5; // y = 0 (encoded)
      initData[i * 4 + 2] = 0.5; // vx = 0 (encoded)
      initData[i * 4 + 3] = 0.5; // vy = 0 (encoded)
    }
    const initTexture = new THREE.DataTexture(
      initData,
      GRID_SIZE,
      GRID_SIZE,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    initTexture.flipY = false;
    initTexture.needsUpdate = true;

    // Physics material
    const physicsMaterial = new THREE.ShaderMaterial({
      vertexShader: PHYSICS_VERTEX_SHADER,
      fragmentShader: PHYSICS_FRAGMENT_SHADER,
      uniforms: {
        u_physics: { value: initTexture },
        u_resolution: { value: new THREE.Vector2(GRID_SIZE, GRID_SIZE) },
        u_pointer: { value: new THREE.Vector2(-10, -10) },
        u_pointerDelta: { value: new THREE.Vector2(0, 0) },
        u_speed: { value: 1.0 },
        u_vertexWidth: { value: 1.0 / GRID_SIZE },
      },
    });
    const physicsMesh = new THREE.Mesh(physicsGeometry, physicsMaterial);
    physicsScene.add(physicsMesh);

    // Display scene
    const displayScene = new THREE.Scene();
    const displayCamera = new THREE.OrthographicCamera(
      -canvasWidth / 2,
      canvasWidth / 2,
      canvasHeight / 2,
      -canvasHeight / 2,
      -1,
      1
    );

    // Load cloth texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/images/img-cloth-texture.jpg',
      (clothTexture: THREE.Texture) => {
        clothTexture.flipY = false;
        const subdivisions = isMobileDevice(container) ? 30 : GRID_SIZE;

        const displayMaterial = new THREE.ShaderMaterial({
          vertexShader: DISPLAY_VERTEX_SHADER,
          fragmentShader: DISPLAY_FRAGMENT_SHADER,
          uniforms: {
            u_texture: { value: activeRT.texture },
            u_textureResolution: { value: subdivisions },
            u_cssWidth: { value: canvasWidth },
            u_cssHeight: { value: canvasHeight },
            u_textureWidth: { value: (clothTexture.image as HTMLImageElement).width },
            u_textureHeight: { value: (clothTexture.image as HTMLImageElement).height },
            u_clothTexture: { value: clothTexture },
          },
          side: THREE.DoubleSide,
        });

        const planeGeo = new THREE.PlaneGeometry(
          canvasWidth,
          canvasHeight,
          1,
          1
        );
        const instancedGeo = new THREE.InstancedBufferGeometry();
        instancedGeo.index = planeGeo.index;
        instancedGeo.attributes = planeGeo.attributes;
        instancedGeo.instanceCount = subdivisions * subdivisions;

        const displayMesh = new THREE.Mesh(instancedGeo, displayMaterial);
        displayScene.add(displayMesh);

        isActive = true;
        lastTime = 0;
        animate(0);
      },
      undefined,
      (err) => {
        console.error('Error loading cloth texture', err);
        isActive = true; // Still try to animate (will be black but better than crash)
        animate(0);
      }
    );

    // Mouse tracking
    let lastPointer = { x: -10, y: -10 };
    let pointerTimer: ReturnType<typeof setTimeout> | null = null;

    function getPointerPos(e: PointerEvent): { x: number; y: number } {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
    }

    function onPointerMove(e: PointerEvent) {
      const pos = getPointerPos(e);
      const deltaX = (pos.x - lastPointer.x) * 5.0;
      const deltaY = (pos.y - lastPointer.y) * 5.0;

      physicsMaterial.uniforms.u_pointer.value.set(pos.x, pos.y);
      physicsMaterial.uniforms.u_pointerDelta.value.set(deltaX, deltaY);

      lastPointer = pos;

      if (pointerTimer) clearTimeout(pointerTimer);
      pointerTimer = setTimeout(() => {
        physicsMaterial.uniforms.u_pointerDelta.value.set(0, 0);
      }, 100);
    }

    function onPointerDown(e: PointerEvent) {
      const pos = getPointerPos(e);
      lastPointer = pos;
      physicsMaterial.uniforms.u_pointer.value.set(pos.x, pos.y);
    }

    function onPointerUp() {
      physicsMaterial.uniforms.u_pointer.value.set(-10, -10);
      physicsMaterial.uniforms.u_pointerDelta.value.set(0, 0);
    }

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    let lastTime = 0;

    function animate(time: number) {
      animationId = requestAnimationFrame(animate);

      if (!isActive || !isVisible) return;

      const now = time;
      const delta = lastTime ? (now - lastTime) / 16.6667 : 1.0;
      lastTime = now;

      physicsMaterial.uniforms.u_speed.value = delta;
      physicsMaterial.uniforms.u_physics.value = activeRT.texture;

      // Physics pass
      renderer.setRenderTarget(inactiveRT);
      renderer.render(physicsScene, physicsCamera);
      renderer.setRenderTarget(null);

      // Swap
      const temp = activeRT;
      activeRT = inactiveRT;
      inactiveRT = temp;

      // Display pass
      if (displayScene.children[0]) {
        const mat = (displayScene.children[0] as THREE.Mesh)
          .material as THREE.ShaderMaterial;
        mat.uniforms.u_texture.value = activeRT.texture;
      }
      renderer.render(displayScene, displayCamera);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = w * 1.36;
      renderer.setSize(w, h);
      displayCamera.left = -w / 2;
      displayCamera.right = w / 2;
      displayCamera.top = h / 2;
      displayCamera.bottom = -h / 2;
      displayCamera.updateProjectionMatrix();

      if (displayScene.children[0]) {
        const mat = (displayScene.children[0] as THREE.Mesh)
          .material as THREE.ShaderMaterial;
        if (mat.uniforms.u_cssWidth) mat.uniforms.u_cssWidth.value = w;
        if (mat.uniforms.u_cssHeight) mat.uniforms.u_cssHeight.value = h;
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
      resizeObserver.disconnect();
      observer.disconnect();
      renderer.dispose();
      rt0.dispose();
      rt1.dispose();
      initTexture.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, [isVisible]);

  return (
    <section
      id="cloth"
      ref={containerRef}
      style={{
        background: '#F5F0EB',
        padding: '140px 5vw 120px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          gap: '5%',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Left - Cloth Canvas */}
        <div
          ref={canvasContainerRef}
          style={{
            flex: '1 1 55%',
            minWidth: '300px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '600px',
          }}
        >
          <div
            style={{
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(28,25,23,0.15)',
              cursor: 'grab',
            }}
          />
        </div>

        {/* Right - Text */}
        <div
          style={{
            flex: '1 1 38%',
            minWidth: '280px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            <img 
              src="/cultural_motif.png" 
              alt="Cultural Motif" 
              style={{ width: '60px', height: '60px', objectFit: 'contain', opacity: 0.8 }} 
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#D4A03C',
              }}
            >
              INTERACTIVE
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 400,
              color: '#1C1917',
              lineHeight: 1.15,
              letterSpacing: '0.02em',
              margin: 0,
            }}
          >
            Touch the Fabric
            <br />
            of India
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '18px',
              color: '#44403C',
              lineHeight: 1.7,
              marginTop: '24px',
              maxWidth: '460px',
            }}
          >
            Drag across the cloth to feel the texture of India's landscapes.
            From the golden dunes of Rajasthan to the emerald backwaters of
            Kerala, every fold reveals a new destination. Release and watch the
            fabric settle back into place — like the gentle rhythm of travel
            itself.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: '40px' }}>
            {[
              'Drag across to ripple the fabric',
              'Release to see it spring back',
              'Every pixel is physically simulated',
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  borderLeft: '1px solid #D4A03C',
                  paddingLeft: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    color: '#78716C',
                    lineHeight: 2.0,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#destinations"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '40px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: '#E85D3F',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const arrow = e.currentTarget.querySelector('.arrow') as HTMLElement;
              if (arrow) arrow.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              const arrow = e.currentTarget.querySelector('.arrow') as HTMLElement;
              if (arrow) arrow.style.transform = 'translateX(0)';
            }}
          >
            Explore Destinations{' '}
            <span className="arrow" style={{ transition: 'transform 0.3s ease' }}>
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function isMobileDevice(container: HTMLElement): boolean {
  return container.clientWidth < 768;
}
