import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { scene3DConfig } from '../content/scene3d';
import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';

// GLTF Model Loader Component with Mouse Tracking (MetaMask fox style)
function Model() {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Load the GLTF model
  const { scene } = useGLTF(scene3DConfig.modelPath);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Smoothly interpolate model rotation to follow mouse
  useFrame(() => {
    if (groupRef.current) {
      // Calculate target rotation based on mouse position
      // Limit rotation range for natural movement
      const targetRotationY = mousePosition.x * 0.5; // Horizontal rotation (-0.5 to +0.5 radians)
      const targetRotationX = mousePosition.y * 0.3; // Vertical rotation (-0.3 to +0.3 radians)

      // Smooth interpolation (lerp) for natural movement
      const lerpFactor = 0.1; // Lower = smoother but slower, higher = faster but jerky

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        lerpFactor
      );

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        lerpFactor
      );

      // Optional: Add subtle floating animation
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  // Apply Solana-branded materials to all meshes in the model
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Clone material to avoid modifying the original
      const material = child.material as THREE.MeshStandardMaterial;
      if (material) {
        child.material = material.clone();
        const newMaterial = child.material as THREE.MeshStandardMaterial;

        // Apply cyberpunk/metallic look
        newMaterial.metalness = 0.9;
        newMaterial.roughness = 0.2;

        // Add emissive glow with Solana colors
        const colors = ['#9945FF', '#14F195', '#00D4AA'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        newMaterial.emissive = new THREE.Color(randomColor);
        newMaterial.emissiveIntensity = 0.3;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

function Scene3D() {
  return (
    <Canvas
      camera={{ position: scene3DConfig.cameraPosition as [number, number, number], fov: 50 }}
      className="h-96 w-full cursor-pointer"
      gl={{ antialias: true, alpha: true }}
    >
      {/* Ambient light */}
      <ambientLight intensity={scene3DConfig.ambientLightIntensity} />

      {/* Point lights with Solana colors */}
      {scene3DConfig.pointLights.map((light, index) => (
        <pointLight
          key={index}
          position={light.position as [number, number, number]}
          color={new THREE.Color(light.color)}
          intensity={light.intensity}
        />
      ))}

      {/* Directional light for better model visibility */}
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* GLTF Model with Mouse Tracking */}
      <Model />
    </Canvas>
  );
}

// Preload the model for better performance
useGLTF.preload(scene3DConfig.modelPath);

export default Scene3D;
