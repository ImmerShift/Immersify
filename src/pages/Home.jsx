import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStore } from '@/lib/store';
import { calculateBrandHealth } from '@/lib/utils';
import { generatePDFReport } from '@/lib/pdfGenerator';
import { ArrowRight, CheckCircle2, Circle, Download, Eye, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Home = () => {
  const [store, setStore] = useState(null);
  const [health, setHealth] = useState(null);
  const [brandLevel, setBrandLevel] = useState(null);
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

  useEffect(() => {
    const refresh = () => {
      const data = getStore();
      setStore(data);
      setBrandLevel(data.brandLevel || null);
      if (data.ratings) {
        setHealth(calculateBrandHealth(data.ratings));
      } else {
        setHealth(null);
      }
    };

    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  if (!store) return null;

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
  const hasText = (id) => typeof answers[id] === 'string' && answers[id].trim() !== '';

  const steps = useMemo(() => ([
    {
      id: 'brand-core',
      title: 'Brand Core Story',
      description: 'Define your why and core story.',
      tab: 'brand_core',
      tier: 'Seed',
      completed: hasText('core_why') && hasText('core_how') && hasText('core_what')
    },
    {
      id: 'visual',
      title: 'Visual Identity',
      description: 'Shape how the brand is seen.',
      tab: 'visual',
      tier: 'Seed',
      completed: !!answers.logo_upload && (!!answers.colors_primary || !!answers.colors_secondary)
    },
    {
      id: 'product',
      title: 'Product Experience',
      description: 'Deliver the promise in reality.',
      tab: 'product',
      tier: 'Sprout',
      completed: hasText('prod_desc') && hasText('prod_standard')
    },
    {
      id: 'market',
      title: 'Market Plan',
      description: 'Know your target and channels.',
      tab: 'market',
      tier: 'Sprout',
      completed: hasText('market_target') && hasText('market_goal')
    },
    {
      id: 'tech',
      title: 'Technology & Access',
      description: 'Make the brand easy to reach.',
      tab: 'tech',
      tier: 'Star',
      completed: hasText('tech_find') && hasText('tech_order')
    },
    {
      id: 'brand-activation',
      title: 'Brand Activation',
      description: 'Create real-world buzz.',
      tab: 'brand_activation',
      tier: 'Star',
      completed: hasText('activation_first_buzz') || hasText('activation_hook')
    },
    {
      id: 'team-branding',
      title: 'Team Branding',
      description: 'People deliver the brand.',
      tab: 'team_branding',
      tier: 'Star',
      completed: hasText('team_attitude') && hasText('team_greeting')
    },
    {
      id: 'security-trust',
      title: 'Security & Trust',
      description: 'Protect reliability and ethics.',
      tab: 'security_trust',
      tier: 'Superbrand',
      completed: hasText('trust_signal') && hasText('trust_promise')
    }
  ]), [answers, health, ratings]);

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

    const tierColors = {
      Seed: 0x6366f1,
      Sprout: 0x22c55e,
      Star: 0xf59e0b,
      Superbrand: 0xef4444
    };

    const createLabelSprite = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = 48;
      canvas.width = 512;
      canvas.height = 128;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'rgba(15, 23, 42, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#f8fafc';
      context.font = `bold ${fontSize}px Inter, sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(2.6, 0.65, 1);
      return sprite;
    };

    const initScene = () => {
      const scene = new THREE.Scene();
      scene.background = null;
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 320;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(6, 6, 10);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.minDistance = 6;
      controls.maxDistance = 16;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.minPolarAngle = Math.PI / 4;

      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const directional = new THREE.DirectionalLight(0xffffff, 1.1);
      directional.position.set(5, 10, 4);
      directional.castShadow = true;
      directional.shadow.mapSize.set(1024, 1024);
      scene.add(directional);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, transparent: true, opacity: 0.1 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.2;
      floor.receiveShadow = true;
      scene.add(floor);

      const group = new THREE.Group();

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.8, 3.4, 16),
        new THREE.MeshStandardMaterial({ color: 0x4b3621, roughness: 0.7, metalness: 0.05 })
      );
      trunk.position.set(0, 1.2, 0);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      group.add(trunk);

      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(2.4, 28, 28),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6, metalness: 0.05 })
      );
      canopy.position.set(0, 3.4, 0);
      canopy.castShadow = true;
      group.add(canopy);

      const rootGeometry = new THREE.CylinderGeometry(0.08, 0.1, 1.6, 12);
      const nodeGeometry = new THREE.SphereGeometry(0.22, 18, 18);

      const rootOffsets = [
        new THREE.Vector3(-2.4, -0.4, 0.8),
        new THREE.Vector3(-2.2, -0.8, -0.6),
        new THREE.Vector3(-1.4, -1.1, 1.6),
        new THREE.Vector3(-0.4, -1.4, -1.8),
        new THREE.Vector3(0.6, -1.3, 1.5),
        new THREE.Vector3(1.6, -1.1, -1.2),
        new THREE.Vector3(2.3, -0.8, 0.6),
        new THREE.Vector3(2.6, -0.4, -0.6)
      ];

      const meshes = stepsRef.current.map((step, idx) => {
        const color = tierColors[step.tier] || 0x6366f1;
        const rootMaterial = new THREE.MeshStandardMaterial({ color: 0x3f2a1a, roughness: 0.8 });
        const nodeMaterial = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.25,
          emissive: 0x000000
        });

        const root = new THREE.Mesh(rootGeometry, rootMaterial);
        const rootTarget = rootOffsets[idx] || new THREE.Vector3(0, -1, 0);
        root.position.set(rootTarget.x * 0.55, rootTarget.y + 0.2, rootTarget.z * 0.55);
        root.lookAt(rootTarget.x, -1.6, rootTarget.z);
        root.castShadow = true;
        group.add(root);

        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(rootTarget.x, rootTarget.y, rootTarget.z);
        node.castShadow = true;
        node.receiveShadow = true;
        node.userData = { index: idx, tab: step.tab, tier: step.tier };
        node.scale.set(1, 1, 1);
        node.userData.targetScale = 1;
        group.add(node);
        return node;
      });

      scene.add(group);

      const fruitGeometry = new THREE.SphereGeometry(0.18, 16, 16);
      const fruitColors = [0x38bdf8, 0xa855f7, 0xf97316, 0xfacc15];
      const fruitLabels = [
        { text: 'Customers', position: new THREE.Vector3(-1.2, 4.6, 1.2) },
        { text: 'Employees', position: new THREE.Vector3(1.4, 4.2, -1.1) },
        { text: 'Sourcing', position: new THREE.Vector3(-0.8, 5.1, -1.4) },
        { text: 'Stakeholders', position: new THREE.Vector3(1.1, 5.0, 1.0) }
      ];

      fruitLabels.forEach((fruit, index) => {
        const sphere = new THREE.Mesh(
          fruitGeometry,
          new THREE.MeshStandardMaterial({ color: fruitColors[index], roughness: 0.3, metalness: 0.2 })
        );
        sphere.position.copy(fruit.position);
        sphere.castShadow = true;
        scene.add(sphere);

        const label = createLabelSprite(fruit.text);
        label.position.copy(fruit.position).add(new THREE.Vector3(0, 0.45, 0));
        scene.add(label);
      });

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

      const animate = () => {
        ladderAnimationRef.current = requestAnimationFrame(animate);
        controls.update();

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

        ladderMeshesRef.current.forEach((mesh) => {
          const target = mesh.userData.targetScale || 1;
          mesh.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
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
        rootGeometry.dispose();
        nodeGeometry.dispose();
        fruitGeometry.dispose();
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
    const tierColors = {
      Seed: new THREE.Color(0x6366f1),
      Sprout: new THREE.Color(0x22c55e),
      Star: new THREE.Color(0xf59e0b),
      Superbrand: new THREE.Color(0xef4444)
    };

    ladderMeshesRef.current.forEach((mesh, index) => {
      const step = steps[index];
      if (!step) return;
      const baseColor = tierColors[step.tier] || new THREE.Color(0x6366f1);
      const material = mesh.material;
      const isCompleted = step.completed;
      const isCurrent = index === activeIndex;
      const tint = isCompleted ? baseColor.clone() : baseColor.clone().multiplyScalar(0.5);
      material.color.copy(tint);
      material.emissive.set(isCurrent ? 0x1f2937 : 0x000000);
    });

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
  }, [steps, activeIndex]);

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
