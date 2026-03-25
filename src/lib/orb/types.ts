import type * as THREE from 'three';

export type ShaderMaterial = THREE.ShaderMaterial;
export type Texture = THREE.Texture;
export type WebGLRenderer = THREE.WebGLRenderer;
export type Scene = THREE.Scene;
export type OrthographicCamera = THREE.OrthographicCamera;
export type PlaneGeometry = THREE.PlaneGeometry;
export type Mesh = THREE.Mesh;
export type WebGLRenderTarget = THREE.WebGLRenderTarget;

export type PointerState = {
	x: number;
	y: number;
	moved: boolean;
	mousedown: boolean;
};

export type SimulationConfig = {
	size: number;
	radius: number;
	strength: number;
	noiseSpeed: number;
	noiseAmplitude: number;
	noiseFrequency: number;
};

export type SimulationResources = {
	scene: Scene;
	camera: OrthographicCamera;
	geometry: PlaneGeometry;
	mesh: Mesh;
	a: WebGLRenderTarget;
	b: WebGLRenderTarget;
	material: ShaderMaterial;
};

export type RenderingResources = {
	scene: Scene;
	camera: OrthographicCamera;
	geometry: PlaneGeometry;
	mesh: Mesh;
	material: ShaderMaterial;
};

export type RendererResources = {
	renderer: WebGLRenderer;
	simulation: SimulationResources;
	rendering: RenderingResources;
};
