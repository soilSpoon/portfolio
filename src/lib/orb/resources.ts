import * as THREE from 'three';
import { DEFAULT_SIMULATION_CONFIG, DPR_CAP, INITIAL_TEXTURE_MIX } from './constants';
import {
	INTERACTION_FRAGMENT_SHADER,
	INTERACTION_VERTEX_SHADER,
	RENDER_FRAGMENT_SHADER,
	RENDER_VERTEX_SHADER
} from './shaders';
import type {
	PointerState,
	RenderingResources,
	SimulationConfig,
	SimulationResources,
	WebGLRenderer
} from './types';

export function createPointerState(): PointerState {
	return { x: 0, y: 0, moved: false, mousedown: false };
}

function createFullscreenResources() {
	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
	camera.position.z = 1;
	const geometry = new THREE.PlaneGeometry(2, 2);
	return { scene, camera, geometry };
}

export function createRenderTarget(size: number) {
	return new THREE.WebGLRenderTarget(size, size, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		type: THREE.UnsignedByteType,
		depthBuffer: false,
		stencilBuffer: false
	});
}

export function applyRendererSize(renderer: WebGLRenderer, el: HTMLDivElement) {
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
	renderer.setSize(el.clientWidth, el.clientHeight, false);
}

export function createRenderer(el: HTMLDivElement) {
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	applyRendererSize(renderer, el);
	el.appendChild(renderer.domElement);
	return renderer;
}

export function buildInteractionMaterial() {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			uTexture: { value: null },
			center: { value: new THREE.Vector2(0.5, 0.5) },
			center2: { value: new THREE.Vector2(0.5, 0.5) },
			radius: { value: DEFAULT_SIMULATION_CONFIG.radius },
			strength: { value: DEFAULT_SIMULATION_CONFIG.strength },
			time: { value: 0 },
			noiseSpeed: { value: DEFAULT_SIMULATION_CONFIG.noiseSpeed },
			noiseAmplitude: { value: DEFAULT_SIMULATION_CONFIG.noiseAmplitude },
			noiseFrequency: { value: DEFAULT_SIMULATION_CONFIG.noiseFrequency },
			mouseDown: { value: false }
		},
		vertexShader: INTERACTION_VERTEX_SHADER,
		fragmentShader: INTERACTION_FRAGMENT_SHADER
	});
}

export function buildSimulationMaterial() {
	return buildInteractionMaterial();
}

export function buildRenderingMaterial() {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			uDisplacement: { value: null },
			uTexture: { value: null },
			uTime: { value: 0 },
			uMixFactor: { value: INITIAL_TEXTURE_MIX }
		},
		vertexShader: RENDER_VERTEX_SHADER,
		fragmentShader: RENDER_FRAGMENT_SHADER
	});
}

export function buildSimulationResources(config: SimulationConfig): SimulationResources {
	const { scene, camera, geometry } = createFullscreenResources();
	const material = buildSimulationMaterial();
	material.uniforms.radius.value = config.radius;
	material.uniforms.strength.value = config.strength;
	material.uniforms.noiseSpeed.value = config.noiseSpeed;
	material.uniforms.noiseAmplitude.value = config.noiseAmplitude;
	material.uniforms.noiseFrequency.value = config.noiseFrequency;
	const mesh = new THREE.Mesh(geometry, material);
	const a = createRenderTarget(config.size);
	const b = createRenderTarget(config.size);
	scene.add(mesh);
	return { scene, camera, geometry, mesh, a, b, material };
}

export function buildRenderingResources(): RenderingResources {
	const { scene, camera, geometry } = createFullscreenResources();
	const material = buildRenderingMaterial();
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	return { scene, camera, geometry, mesh, material };
}

export function disposeSimulationResources(resources: SimulationResources) {
	resources.geometry.dispose();
	resources.material.dispose();
	resources.a.dispose();
	resources.b.dispose();
}

export function disposeRenderingResources(resources: RenderingResources) {
	resources.geometry.dispose();
	resources.material.dispose();
}
