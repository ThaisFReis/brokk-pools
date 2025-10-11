import { Scene3DConfig } from '../types/Scene3DConfig';

export const scene3DConfig: Scene3DConfig = {
  modelPath: '/assets/models/model3d.glb',
  cameraPosition: [0, 0, 5],
  ambientLightIntensity: 0.5,
  pointLights: [
    { position: [5, 5, 5], color: '#9945FF', intensity: 2.0 }, // Solana purple
    { position: [-5, -5, 5], color: '#14F195', intensity: 1.8 }, // Solana green
    { position: [0, 5, 3], color: '#00D4AA', intensity: 1.5 }, // Solana teal
  ],
  rotationSpeed: 0.002, // Slow rotation
  enableAutoRotate: true, // Enable auto-rotation for the model
};
