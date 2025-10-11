export interface PointLightConfig {
  position: [number, number, number];
  color: string;
  intensity: number;
}

export interface Scene3DConfig {
  modelPath: string;
  cameraPosition: [number, number, number];
  ambientLightIntensity: number;
  pointLights: PointLightConfig[];
  rotationSpeed: number;
  enableAutoRotate: boolean;
}
