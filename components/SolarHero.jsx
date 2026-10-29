'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from './ThemeProvider';

function getVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// Approximate solar position for London (51.5N) in mid-August — ignores
// equation of time / atmospheric refraction, close enough for the study.
function sunAngles(hourDecimal) {
  const lat = THREE.MathUtils.degToRad(51.5);
  const dayOfYear = 227; // ~Aug 15
  const decl = THREE.MathUtils.degToRad(23.45) * Math.sin(THREE.MathUtils.degToRad((360 / 365) * (284 + dayOfYear)));
  const H = THREE.MathUtils.degToRad(15 * (hourDecimal - 12));
  const sinAlt = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(H);
  const alt = Math.asin(Math.min(1, Math.max(-1, sinAlt)));
  let cosAz = (Math.sin(decl) - Math.sin(lat) * Math.sin(alt)) / (Math.cos(lat) * Math.cos(alt));
  cosAz = Math.min(1, Math.max(-1, cosAz));
  let az = Math.acos(cosAz);
  if (H > 0) az = Math.PI * 2 - az;
  return { alt, az };
}

export default function SolarHero() {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const readoutRef = useRef(null);
  const refreshColorsRef = useRef(() => {});
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas.parentElement;
    const slider = sliderRef.current;
    const readout = readoutRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const VIEW = 4.2;
    let camera;

    const FILL_COLOR = new THREE.Color('#8C8C8C');

    const group = new THREE.Group();
    scene.add(group);

    const groundGeo = new THREE.PlaneGeometry(48, 48);
    const groundMat = new THREE.MeshStandardMaterial({ color: FILL_COLOR, roughness: 1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);

    const grid = new THREE.GridHelper(
      48, 48,
      new THREE.Color(getVar('--line', '#D8D5CE')),
      new THREE.Color(getVar('--line', '#D8D5CE'))
    );
    grid.position.y = 0.005;
    grid.material.transparent = true;
    grid.material.opacity = 0.7;
    group.add(grid);

    const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
    const cubeMat = new THREE.MeshStandardMaterial({ color: FILL_COLOR, roughness: 0.9 });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.y = 1;
    cube.castShadow = true;
    cube.receiveShadow = true;
    group.add(cube);

    const cubeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(cubeGeo),
      new THREE.LineBasicMaterial({ color: new THREE.Color(getVar('--ink', '#15171B')) })
    );
    cubeEdges.position.y = 1;
    group.add(cubeEdges);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff2df, 1.15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 30;
    sun.shadow.bias = -0.0008;
    sun.target = cube;
    scene.add(sun, sun.target);

    const sunMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFDD21') })
    );
    scene.add(sunMarker);

    function resize() {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      if (!camera) {
        camera = new THREE.OrthographicCamera(-VIEW * aspect, VIEW * aspect, VIEW, -VIEW, 0.1, 100);
        camera.position.set(9, 9, 9);
        camera.lookAt(0, 0, 0);
      } else {
        camera.left = -VIEW * aspect;
        camera.right = VIEW * aspect;
        camera.top = VIEW;
        camera.bottom = -VIEW;
        camera.updateProjectionMatrix();
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function applySun(hourDecimal) {
      const { alt, az } = sunAngles(hourDecimal);
      // North = -X (back-left in this axo view), East = -Z, matching a UK sun path
      const dirX = -Math.cos(az) * Math.cos(alt);
      const dirY = Math.sin(alt);
      const dirZ = -Math.sin(az) * Math.cos(alt);
      const dist = 14;
      sun.position.set(dirX * dist, dirY * dist, dirZ * dist);
      sunMarker.position.set(dirX * 6.5, dirY * 6.5 + 1, dirZ * 6.5);

      const h = Math.floor(hourDecimal);
      const m = Math.round((hourDecimal - h) * 60);
      const hh = String(h).padStart(2, '0'), mm = String(m).padStart(2, '0');
      if (readout) readout.textContent = `${hh}:${mm} · ALT ${Math.round(THREE.MathUtils.radToDeg(alt))}°`;
    }

    const CYCLE_MS = 90000;
    let autoplayActive = !reduced;
    let idleResumeTimer = null;
    let cycleStart = performance.now() - ((parseFloat(slider.value) - 8) / 9) * CYCLE_MS;

    function pauseAutoplay() {
      autoplayActive = false;
      clearTimeout(idleResumeTimer);
    }
    function scheduleResume() {
      clearTimeout(idleResumeTimer);
      if (reduced) return;
      idleResumeTimer = setTimeout(() => {
        autoplayActive = true;
        cycleStart = performance.now() - ((parseFloat(slider.value) - 8) / 9) * CYCLE_MS;
      }, 2000);
    }
    function onInput() {
      applySun(parseFloat(slider.value));
      pauseAutoplay();
      scheduleResume();
    }

    slider.addEventListener('pointerdown', pauseAutoplay);
    slider.addEventListener('focus', pauseAutoplay);
    slider.addEventListener('input', onInput);
    slider.addEventListener('pointerup', scheduleResume);
    slider.addEventListener('blur', scheduleResume);
    applySun(parseFloat(slider.value));

    if (!reduced) {
      gsap.from(group.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 1.1, ease: 'power3.out' });
      gsap.from(cubeMat, { opacity: 0, duration: 1.2, ease: 'power2.out' });
    }

    let rafId;
    function animate() {
      if (autoplayActive) {
        const elapsed = (performance.now() - cycleStart) % CYCLE_MS;
        const hour = 8 + (elapsed / CYCLE_MS) * 9;
        slider.value = hour;
        applySun(hour);
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    function refreshSceneColors() {
      cubeEdges.material.color.set(new THREE.Color(getVar('--ink', '#15171B')));
      grid.material.color.set(new THREE.Color(getVar('--line', '#D8D5CE')));
    }
    refreshColorsRef.current = refreshSceneColors;

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(idleResumeTimer);
      window.removeEventListener('resize', resize);
      slider.removeEventListener('pointerdown', pauseAutoplay);
      slider.removeEventListener('focus', pauseAutoplay);
      slider.removeEventListener('input', onInput);
      slider.removeEventListener('pointerup', scheduleResume);
      slider.removeEventListener('blur', scheduleResume);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    refreshColorsRef.current();
  }, [theme]);

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-canvas-wrap">
          <canvas ref={canvasRef} id="hero-canvas" />
          <span className="plate tl">FIG. 01 — SOLAR STUDY</span>
          <span className="plate tr" ref={readoutRef} id="sun-readout">13:00 · ALT 52°</span>
          <div className="sun-control">
            <input
              ref={sliderRef}
              type="range"
              id="sun-slider"
              min="8"
              max="17"
              step="0.1"
              defaultValue="12.5"
              aria-label="Time of day"
            />
            <div className="sun-control-times">
              <span>8am</span><span>11am</span><span>2pm</span><span>5pm</span>
            </div>
          </div>
        </div>
        <div className="hero-text">
          <h1>Creative technologist, working in real time.</h1>
          <p>
            I design and build realtime, web and architectural visualisation work — moving between
            Unreal Engine, WebXR and V-Ray depending on what the project needs. Currently focused on
            realtime art, prototyping and animation in UE, alongside web-based 3D.
          </p>
        </div>
      </div>
    </section>
  );
}
