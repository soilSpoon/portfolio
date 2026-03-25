import type { SimulationConfig } from './types';

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
	size: 64,
	radius: 0.08,
	strength: 0.1,
	noiseSpeed: 0.0075,
	noiseAmplitude: 0.005,
	noiseFrequency: 10
};

export const INITIAL_TEXTURE_MIX = 0.85;
export const TEXTURE_MIX_DURATION_MS = 1000;
export const ORB_TEXTURE_URL = '/ob/textures/ob_texture-old-2.jpg';
export const DPR_CAP = 1.5;
