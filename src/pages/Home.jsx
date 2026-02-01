import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { calculateBrandHealth, calculatePillarScore } from '@/lib/utils';
import { calculateTreeState } from '@/lib/visualizers';
import { generatePDFReport } from '@/lib/pdfGenerator';
import { ArrowRight, CheckCircle2, Circle, Download, Eye, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SECTIONS } from '@/lib/constants';

const Home = () => {
  const store = useStore((state) => state);
  const health = useMemo(() => calculateBrandHealth(store?.ratings || {}), [store?.ratings]);
  const brandLevel = store?.brandLevel || null;
  const navigate = useNavigate();
  const ladderContainerRef = useRef(null);
  const ladderSceneRef = useRef(null);
  const ladderRendererRef = useRef(null);
  const ladderControlsRef = useRef(null);
  const ladderMeshesRef = useRef([]);
  const ladderRaycasterRef = useRef(new THREE.Raycaster());
  const ladderMouseRef = useRef(new THREE.Vector2());
  const ladderHoverRef = useRef(null);
  const ladderBurstsRef = useRef([]);
  const ladderAnimationRef = useRef(null);
  const prevCompletedRef = useRef(0);
  const stepsRef = useRef([]);
  const activeIndexRef = useRef(0);
  const treeGroupRef = useRef(null);
  const canopyRefs = useRef([]);
  const fruitGroupsRef = useRef([]);
  const keyLightRef = useRef(null);

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Superbrand': return 'text-purple-600 bg-purple-100';
      case 'Star': return 'text-indigo-600 bg-indigo-100';
      case 'Sprout': return 'text-green-600 bg-green-100';
      default: return 'text-orange-600 bg-orange-100';
    }
  };

  const displayScore = brandLevel?.score ?? health?.overallScore ?? 0;
  const displayTier = brandLevel?.level ?? health?.tier ?? 'Seed';

  const answers = store?.answers || {};
  const ratings = store?.ratings || {};
  const visualState = useMemo(() => calculateTreeState(store || {}), [store?.answers, store?.ratings, store?.brandLevel]);
  const activationInsight = useMemo(
    () => calculatePillarScore('brand_activation', answers, ratings, displayTier),
    [answers, ratings, displayTier]
  );
  const securityInsight = useMemo(
    () => calculatePillarScore('security_trust', answers, ratings, displayTier),
    [answers, ratings, displayTier]
  );

  const pillarLabels = {
    brand_core: 'Brand Core',
    visual_identity: 'Visual Identity',
    product_experience: 'Product Experience',
    market_plan: 'Market Plan',
    technology: 'Technology',
    brand_activation: 'Brand Activation',
    team_branding: 'Team Branding',
    security_trust: 'Security & Trust'
  };

  const isAnswered = (question) => {
    if (question.type === 'rating') {
      return !!ratings[question.id];
    }
    const value = answers[question.id];
    if (typeof value === 'string') return value.trim() !== '';
    return !!value;
  };

  const steps = useMemo(() => (
    Object.entries(SECTIONS).map(([pillarKey, questions]) => {
      const answeredCount = questions.filter(isAnswered).length;
      const completion = questions.length ? answeredCount / questions.length : 0;
      return {
        id: pillarKey,
        title: pillarLabels[pillarKey] || pillarKey,
        description: 'Complete this pillar to grow the tree.',
        tab: pillarKey,
        tier: questions[0]?.tier || 'Seed',
        completed: completion >= 0.8
      };
    })
  ), [answers, ratings]);

  const currentIndex = Math.max(0, steps.findIndex((step) => !step.completed));
  const activeIndex = currentIndex === -1 ? steps.length - 1 : currentIndex;
  const progressPercent = Math.round(((steps.filter((step) => step.completed).length) / steps.length) * 100);

  const goToStep = (step, status) => {
    if (status === 'pending') return;
    navigate(`/questionnaire?tab=${step.tab}`);
  };

  useEffect(() => {
    stepsRef.current = steps;
    activeIndexRef.current = activeIndex;
  }, [steps, activeIndex]);

  useEffect(() => {
    const container = ladderContainerRef.current;
    if (!container) return;

    const createLabelSprite = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = 40;
      canvas.width = 512;
      canvas.height = 128;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'rgba(15, 23, 42, 0.7)';
      context.beginPath();
      context.roundRect(16, 16, canvas.width - 32, canvas.height - 32, 32);
      context.fill();
      context.fillStyle = '#f8fafc';
      context.font = `600 ${fontSize}px Inter, sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2 + 4);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(2.4, 0.55, 1);
      return sprite;
    };

    const initScene = () => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(visualState.environment.skyColor);
      scene.fog = new THREE.Fog(visualState.environment.skyColor, 8, 22);
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 320;

      const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 60);
      camera.position.set(7.2, 6.2, 9.4);
      camera.lookAt(0, 2, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.minDistance = 6;
      controls.maxDistance = 12;
      controls.maxPolarAngle = Math.PI / 2.2;
      controls.minPolarAngle = Math.PI / 4.6;

      const ambient = new THREE.AmbientLight(0xffffff, 0.45);
      scene.add(ambient);
      const hemisphere = new THREE.HemisphereLight(0xc7d2fe, 0x1f2937, 0.6);
      scene.add(hemisphere);
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(6, 9, 6);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.camera.left = -8;
      keyLight.shadow.camera.right = 8;
      keyLight.shadow.camera.top = 8;
      keyLight.shadow.camera.bottom = -8;
      scene.add(keyLight);
      keyLightRef.current = keyLight;
      const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.5);
      rimLight.position.set(-6, 6, -4);
      scene.add(rimLight);

      const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, metalness: 0.05 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 6), baseMaterial);
      base.position.set(0, -0.4, 0);
      base.receiveShadow = true;
      scene.add(base);
      const soilMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8, metalness: 0.05 });
      const soil = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.6, 5.4), soilMaterial);
      soil.position.set(0, 0.3, 0);
      soil.castShadow = true;
      soil.receiveShadow = true;
      scene.add(soil);

      const group = new THREE.Group();

      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x6b4b2a,
        roughness: 0.7,
        metalness: 0.05
      });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 3.2, 20), trunkMaterial);
      trunk.position.set(0, 1.35, 0);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      group.add(trunk);

      const canopyMaterial = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.5,
        metalness: 0.05,
        emissive: 0x0b1f16
      });
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(2.1, 32, 32), canopyMaterial);
      canopy.position.set(0, 3.4, 0);
      canopy.castShadow = true;
      group.add(canopy);
      const canopy2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 28, 28), canopyMaterial.clone());
      canopy2.position.set(-1.1, 3.7, 0.6);
      canopy2.castShadow = true;
      group.add(canopy2);
      const canopy3 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 24), canopyMaterial.clone());
      canopy3.position.set(1.2, 3.2, -0.8);
      canopy3.castShadow = true;
      group.add(canopy3);

      const nodeGeometry = new THREE.SphereGeometry(0.22, 18, 18);

      const rootOffsets = [
        new THREE.Vector3(-2.4, 0.1, 1.8),
        new THREE.Vector3(-2.6, -0.2, -1.2),
        new THREE.Vector3(-1.4, -0.4, 2.2),
        new THREE.Vector3(-0.6, -0.6, -2.4),
        new THREE.Vector3(0.8, -0.5, 2.2),
        new THREE.Vector3(1.8, -0.4, -1.8),
        new THREE.Vector3(2.6, -0.2, 1.2),
        new THREE.Vector3(2.8, 0.1, -1.2)
      ];

      const rootGeometries = [];
      const meshes = stepsRef.current.map((step, idx) => {
        const rootMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2e1a, roughness: 0.8 });
        const nodeMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(visualState.healthColor).lerp(new THREE.Color(0xffffff), 0.2),
          roughness: 0.3,
          metalness: 0.3,
          emissive: 0x000000
        });

        const rootTarget = rootOffsets[idx] || new THREE.Vector3(0, -1, 0);
        const rootPath = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.6, 0),
          new THREE.Vector3(rootTarget.x * 0.4, 0.2, rootTarget.z * 0.4),
          new THREE.Vector3(rootTarget.x * 0.8, -0.2, rootTarget.z * 0.8),
          new THREE.Vector3(rootTarget.x, -0.6, rootTarget.z)
        ]);
        const rootTube = new THREE.TubeGeometry(rootPath, 20, 0.09, 8, false);
        rootGeometries.push(rootTube);
        const root = new THREE.Mesh(rootTube, rootMaterial);
        root.castShadow = true;
        root.receiveShadow = true;
        group.add(root);

        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(rootTarget.x, rootTarget.y - 0.2, rootTarget.z);
        node.castShadow = true;
        node.receiveShadow = true;
        node.userData = { index: idx, tab: step.tab, tier: step.tier };
        node.scale.set(1, 1, 1);
        node.userData.targetScale = 1;
        node.userData.baseY = node.position.y;
        group.add(node);
        return node;
      });

      group.position.set(0, 0.2, 0);
      group.scale.setScalar(visualState.treeScale);
      scene.add(group);
      treeGroupRef.current = group;
      canopyRefs.current = [canopy, canopy2, canopy3];

      const fruitGeometry = new THREE.SphereGeometry(0.16, 16, 16);
      const fruitColors = [0x38bdf8, 0xa855f7, 0xf97316, 0xfacc15];
      const fruitLabels = [
        { text: 'Customers', position: new THREE.Vector3(-1.2, 4.6, 1.2) },
        { text: 'Employees', position: new THREE.Vector3(1.4, 4.2, -1.1) },
        { text: 'Sourcing', position: new THREE.Vector3(-0.8, 5.1, -1.4) },
        { text: 'Stakeholders', position: new THREE.Vector3(1.1, 5.0, 1.0) }
      ];

      const fruitGroups = [];
      fruitLabels.forEach((fruit, index) => {
        const fruitGroup = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: fruitColors[index], roughness: 0.2, metalness: 0.3 });
        for (let i = 0; i < 5; i += 1) {
          const sphere = new THREE.Mesh(fruitGeometry, material);
          sphere.position.set(
            (Math.random() - 0.5) * 0.25,
            (Math.random() - 0.5) * 0.25,
            (Math.random() - 0.5) * 0.25
          );
          sphere.castShadow = true;
          fruitGroup.add(sphere);
        }
        fruitGroup.position.copy(fruit.position);
        fruitGroup.userData.baseY = fruitGroup.position.y;
        fruitGroup.userData.floatOffset = Math.random() * Math.PI * 2;
        scene.add(fruitGroup);
        fruitGroups.push(fruitGroup);

        const label = createLabelSprite(fruit.text);
        label.position.copy(fruit.position).add(new THREE.Vector3(0, 0.55, 0));
        scene.add(label);
      });
      fruitGroupsRef.current = fruitGroups;

      const dustGeometry = new THREE.BufferGeometry();
      const dustCount = 120;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount * 3; i += 3) {
        dustPositions[i] = (Math.random() - 0.5) * 10;
        dustPositions[i + 1] = Math.random() * 6 + 0.5;
        dustPositions[i + 2] = (Math.random() - 0.5) * 8;
      }
      dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
      const dustMaterial = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.05, transparent: true, opacity: 0.35 });
      const dust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(dust);

      ladderSceneRef.current = { scene, camera };
      ladderRendererRef.current = renderer;
      ladderControlsRef.current = controls;
      ladderMeshesRef.current = meshes;

      const onPointerMove = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        ladderMouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        ladderMouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };

      const onPointerLeave = () => {
        ladderMouseRef.current.x = 100;
        ladderMouseRef.current.y = 100;
      };

      const onClick = () => {
        const { scene: currentScene, camera: currentCamera } = ladderSceneRef.current;
        ladderRaycasterRef.current.setFromCamera(ladderMouseRef.current, currentCamera);
        const intersects = ladderRaycasterRef.current.intersectObjects(ladderMeshesRef.current);
        if (!intersects.length) return;
        const mesh = intersects[0].object;
        const index = mesh.userData.index;
        if (index > activeIndexRef.current) return;
        const step = stepsRef.current[index];
        if (!step) return;
        goToStep(step, index === activeIndexRef.current ? 'current' : 'completed');
      };

      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerleave', onPointerLeave);
      renderer.domElement.addEventListener('click', onClick);

      const resizeObserver = new ResizeObserver(() => {
        const newWidth = container.clientWidth || 600;
        const newHeight = container.clientHeight || 320;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      });
      resizeObserver.observe(container);

      const clock = new THREE.Clock();
      const animate = () => {
        ladderAnimationRef.current = requestAnimationFrame(animate);
        controls.update();
        const elapsed = clock.getElapsedTime();
        canopy.rotation.y = Math.sin(elapsed * 0.2) * 0.05;
        canopy2.rotation.y = Math.sin(elapsed * 0.18 + 1) * 0.05;
        canopy3.rotation.y = Math.sin(elapsed * 0.16 + 2) * 0.05;
        fruitGroups.forEach((group, idx) => {
          group.position.y = group.userData.baseY + Math.sin(elapsed * 0.8 + group.userData.floatOffset) * 0.08;
          group.rotation.y = Math.sin(elapsed * 0.3 + idx) * 0.08;
        });

        ladderRaycasterRef.current.setFromCamera(ladderMouseRef.current, camera);
        const intersects = ladderRaycasterRef.current.intersectObjects(ladderMeshesRef.current);
        const hovered = intersects.length ? intersects[0].object : null;
        if (ladderHoverRef.current !== hovered) {
          if (ladderHoverRef.current) {
            ladderHoverRef.current.userData.targetScale = 1;
            ladderHoverRef.current.material.emissive.set(0x000000);
          }
          ladderHoverRef.current = hovered;
          if (hovered) {
            hovered.userData.targetScale = 1.08;
            hovered.material.emissive.set(0x1e293b);
          }
        }

        ladderMeshesRef.current.forEach((mesh, idx) => {
          const target = mesh.userData.targetScale || 1;
          mesh.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
          mesh.position.y = mesh.userData.baseY + Math.sin(elapsed * 0.6 + idx) * 0.06;
        });

        ladderBurstsRef.current = ladderBurstsRef.current.filter((burst) => {
          burst.life -= 0.02;
          burst.points.material.opacity = Math.max(0, burst.life);
          burst.points.position.addScaledVector(burst.velocity, 0.03);
          if (burst.life <= 0) {
            burst.points.geometry.dispose();
            burst.points.material.dispose();
            currentScene.remove(burst.points);
            return false;
          }
          return true;
        });

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
        renderer.domElement.removeEventListener('click', onClick);
        controls.dispose();
        nodeGeometry.dispose();
        fruitGeometry.dispose();
        rootGeometries.forEach((geometry) => geometry.dispose());
        dustGeometry.dispose();
        dustMaterial.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    };

    const cleanup = initScene();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    const sceneData = ladderSceneRef.current;
    if (!sceneData) return;
    const { scene } = sceneData;
    const healthColor = new THREE.Color(visualState.healthColor);

    ladderMeshesRef.current.forEach((mesh, index) => {
      const material = mesh.material;
      const isCurrent = index === activeIndex;
      material.color.copy(healthColor);
      material.emissive.set(isCurrent ? 0x1f2937 : 0x000000);
    });

    const canopyScale = 0.65 + (visualState.leafDensity / 100) * 0.75;
    canopyRefs.current.forEach((canopy) => {
      canopy.material.color.copy(healthColor);
      canopy.scale.setScalar(canopyScale);
    });

    if (treeGroupRef.current) {
      treeGroupRef.current.scale.setScalar(visualState.treeScale);
    }

    const visibleGroups = Math.min(fruitGroupsRef.current.length, Math.ceil(visualState.fruitCount / 2));
    fruitGroupsRef.current.forEach((group, idx) => {
      group.visible = idx < visibleGroups;
    });

    if (keyLightRef.current) {
      keyLightRef.current.intensity = visualState.environment.lightIntensity;
    }
    scene.background = new THREE.Color(visualState.environment.skyColor);
    scene.fog = new THREE.Fog(visualState.environment.skyColor, 8, 22);

    const completedCount = steps.filter((step) => step.completed).length;
    if (completedCount > prevCompletedRef.current) {
      const targetIndex = Math.min(completedCount - 1, ladderMeshesRef.current.length - 1);
      const mesh = ladderMeshesRef.current[targetIndex];
      if (mesh) {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.08, transparent: true, opacity: 1 });
        const positions = new Float32Array(60);
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] = (Math.random() - 0.5) * 1.2;
          positions[i + 1] = (Math.random() - 0.5) * 1.2;
          positions[i + 2] = (Math.random() - 0.5) * 1.2;
        }
        const buffer = new THREE.BufferGeometry();
        buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const points = new THREE.Points(buffer, material);
        points.position.copy(mesh.position).add(new THREE.Vector3(0, 0.5, 0));
        scene.add(points);
        ladderBurstsRef.current.push({
          points,
          velocity: new THREE.Vector3(0, 0.2, 0),
          life: 1
        });
      }
    }
    prevCompletedRef.current = completedCount;
  }, [steps, activeIndex, visualState]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12 animate-in fade-in duration-700">
      {/* Hero / Scoreboard */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-indigo-900">
          Brand Health Dashboard
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Track your journey from Seed to Superbrand. Complete the audit to unlock your score.
        </p>

        {health && (
          <div className="flex flex-col items-center justify-center mt-8">
             <div className="relative flex items-center justify-center w-56 h-56 rounded-full border-8 border-slate-100 shadow-xl bg-white">
                <div className="text-center">
                  <span className="block text-6xl font-black text-indigo-900 tracking-tighter">{displayScore}%</span>
                  <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${getTierColor(displayTier)}`}>
                    {displayTier}
                  </span>
                </div>
             </div>

             {/* Critical Actions Pulse */}
             {health.topPriorities.length > 0 && (
               <div className="mt-8 max-w-lg w-full bg-white border border-indigo-100 rounded-xl p-6 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                   Critical Actions (Pulse)
                 </h3>
                 <div className="space-y-3">
                   {health.topPriorities.map((gap, idx) => (
                     <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors cursor-default">
                       <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${gap.priority === 'High' ? 'bg-red-500' : 'bg-orange-400'}`} />
                       <div>
                         <p className="text-sm font-semibold text-slate-800">{gap.text}</p>
                         <p className="text-xs text-slate-500">{gap.section}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Brand Growth Tree
              </h2>
              <p className="text-sm text-slate-500">Strong roots create lasting growth.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-slate-600">{progressPercent}% Complete</div>
              <div className="w-28 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-2 rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[1.15fr_1fr] gap-6 items-center mb-8">
            <div className="relative h-72 w-full rounded-2xl bg-slate-950/90 overflow-hidden">
              <div ref={ladderContainerRef} className="absolute inset-0" />
              <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                Brand Tree 3D
              </div>
              <div className="absolute bottom-4 left-4 text-xs text-slate-300">Roots</div>
              <div className="absolute bottom-4 right-4 text-xs text-slate-300">Fruits</div>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => {
                const status = step.completed ? 'completed' : index === activeIndex ? 'current' : 'pending';
                return (
                  <div key={step.id} className={`rounded-xl border px-4 py-3 transition-all ${
                    status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50'
                      : status === 'current'
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Step {index + 1}</div>
                    <div className="text-sm font-semibold text-slate-900">{step.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Healthy roots unlock growth and visibility at the top.
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const status = step.completed ? 'completed' : index === activeIndex ? 'current' : 'pending';
              const isInteractive = status !== 'pending';
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(step, status)}
                  disabled={!isInteractive}
                  aria-disabled={!isInteractive}
                  aria-label={`${step.title} step`}
                  aria-current={status === 'current' ? 'step' : undefined}
                  className={`relative flex-1 min-w-[220px] text-left rounded-xl border px-4 py-4 transition-all duration-300 ${
                    status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                      : status === 'current'
                      ? 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100'
                      : 'border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : status === 'current' ? (
                      <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                    <span className="text-sm font-bold uppercase tracking-wide text-slate-500">Step {index + 1}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-center gap-4 pt-8">
           <Link to="/questionnaire">
             <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
               {health?.overallScore > 0 ? 'Continue Audit' : 'Start Brand Audit'} <ArrowRight className="ml-2 h-5 w-5"/>
             </Button>
           </Link>
           <Link to="/strategy">
             <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2">
               View Strategy
             </Button>
           </Link>
           
           <Button 
             variant="outline" 
             size="lg" 
             className="h-14 px-8 text-lg border-2 gap-2"
             onClick={() => generatePDFReport(store, health)}
           >
             <Download className="h-5 w-5" /> Report
           </Button>
        </div>
      </div>

      {/* Pillar Breakdown */}
      {health && (
        <div className="grid md:grid-cols-3 gap-6 pt-8">
           {Object.entries(health.pillarScores).map(([key, score]) => (
             <Card key={key} className="border-t-4 border-t-indigo-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg capitalize flex justify-between items-center">
                   {key.replace('_', ' ')}
                   <span className={`text-xl font-bold ${score > 75 ? 'text-green-600' : score > 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                     {score}%
                   </span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
                   <div 
                     className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${score > 75 ? 'bg-green-500' : score > 25 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                     style={{ width: `${score}%` }}
                   ></div>
                 </div>
                 <p className="text-sm text-slate-500">
                   {score < 30 ? "Critical gaps detected." : score < 80 ? "Good foundation, but needs optimization." : "Strong performance!"}
                 </p>
                 {key === 'brand_activation' && activationInsight?.advisoryNote ? (
                   <p className="mt-2 text-xs text-slate-500">{activationInsight.advisoryNote}</p>
                 ) : null}
                {key === 'security_trust' && securityInsight?.securityVerdict ? (
                  <p className={`mt-2 text-xs ${securityInsight.systemicFragility ? 'text-red-600' : 'text-slate-500'}`}>
                    {securityInsight.securityVerdict}
                  </p>
                ) : null}
               </CardContent>
             </Card>
           ))}
        </div>
      )}

      {/* Trophy Cabinet (Gamification) */}
      {health && (
        <div className="pt-12 border-t border-slate-200">
           <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <span className="text-3xl">🏆</span> Trophy Cabinet
           </h2>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {health.earnedBadges.length > 0 ? (
                health.earnedBadges.map((badge) => (
                  <div key={badge.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex flex-col items-center text-center animate-in zoom-in duration-500">
                    <span className="text-4xl mb-2">{badge.icon}</span>
                    <h3 className="font-bold text-yellow-900">{badge.title}</h3>
                    <p className="text-xs text-yellow-700 mt-1">{badge.description}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <span className="text-4xl block mb-2 opacity-50">🔒</span>
                  <p>Start your audit to unlock your first badge!</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Home;
