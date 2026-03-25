<script lang="ts">
	import { onMount } from 'svelte';

	let orbEl = $state<HTMLDivElement | null>(null);
	let orbInstance: OrbClass | null = null;

	// ─── Three.js Orb ──────────────────────────────────────────────────────────
	// offbrand-orb.iife.js 직접 역분석 — 정확한 uniform명/shader 코드 사용
	// FBO[0]=256×256 (interaction out), FBO[1]=128×128 (simulation out / render input)
	// Camera: PerspectiveCamera(60, aspect, 0.1, 2), z=2.4
	// — FBO pass도 동일한 PerspectiveCamera 사용 (VS가 gl_Position=vec4(pos,1.0)이므로 무관)

	class OrbClass {
		private renderer!: import('three').WebGLRenderer;
		private camera!: import('three').PerspectiveCamera;
		private scene!: import('three').Scene;
		private fboScene!: import('three').Scene;
		private fboPlane!: import('three').Mesh;
		private sphere!: import('three').Mesh;
		private fbos!: [import('three').WebGLRenderTarget, import('three').WebGLRenderTarget];
		private interactionMaterial!: import('three').ShaderMaterial;
		private simulationMaterial!: import('three').ShaderMaterial;
		private renderingMaterial!: import('three').ShaderMaterial;
		private clock!: import('three').Clock;
		private raycaster!: import('three').Raycaster;
		private mousePosition = { x: -1, y: -1 };
		private normalizedMousePosition = { x: -1, y: -1 };
		private frameId = 0;
		private intervalId: ReturnType<typeof setInterval> | null = null;
		private resizeObserver: ResizeObserver | null = null;
		private angle = Math.PI / 2;
		private angleChangeSpeed = 1;
		private el: HTMLDivElement;

		constructor(el: HTMLDivElement) {
			this.el = el;
			this.init();
		}

		private async init() {
			const THREE = await import('three');

			// 초기 CSS가 width:0, height:0이므로 최소 크기로 시작
			// ResizeObserver가 GSAP 애니메이션에 맞춰 동적으로 크기 조정
			const rawW = this.el.offsetWidth;
			const rawH = this.el.offsetHeight;
			const w = rawW > 0 ? rawW : 1;
			const h = rawH > 0 ? rawH : 1;

			// ─ Renderer
			this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this.renderer.setSize(w, h);
			this.renderer.setPixelRatio(window.devicePixelRatio || 1);
			this.el.appendChild(this.renderer.domElement);

			// ─ Camera (used for both sphere and FBO passes)
			this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2);
			this.camera.position.z = 2.4;

			// ─ Scenes
			this.scene = new THREE.Scene();
			this.fboScene = new THREE.Scene();
			this.clock = new THREE.Clock();
			this.raycaster = new THREE.Raycaster();

			// ─ Float texture support
			const gl = this.renderer.getContext();
			const exts = gl.getSupportedExtensions() || [];
			let texType: typeof THREE.FloatType | typeof THREE.HalfFloatType;
			if (exts.includes('EXT_color_buffer_float')) {
				texType = THREE.FloatType;
			} else if (exts.includes('EXT_color_buffer_half_float')) {
				texType = THREE.HalfFloatType;
			} else {
				console.warn('Float textures not supported');
				texType = THREE.HalfFloatType;
			}

			// ─ FBOs: [0]=256 (interaction target), [1]=128 (simulation target + render source)
			const fboOpts = {
				format: THREE.RGBAFormat,
				type: texType,
				wrapS: THREE.ClampToEdgeWrapping,
				wrapT: THREE.ClampToEdgeWrapping,
			};
			this.fbos = [
				new THREE.WebGLRenderTarget(256, 256, fboOpts),
				new THREE.WebGLRenderTarget(128, 128, fboOpts),
			];

			// ─ FBO quad (VS ignores projection → always fills screen)
			const quadGeo = new THREE.PlaneGeometry(2, 2);
			this.fboPlane = new THREE.Mesh(quadGeo);
			this.fboScene.add(this.fboPlane);

			// ─ Materials (exact shaders from offbrand-orb.iife.js)
			this.interactionMaterial = this.buildInteractionMaterial(THREE);
			this.simulationMaterial = this.buildSimulationMaterial(THREE);
			this.renderingMaterial = this.buildRenderingMaterial(THREE);

			// ─ Fallback white DataTexture: prevents black sphere before real matcap loads
			const whitePx = new Uint8Array([200, 200, 220, 255]);
			const whiteTex = new THREE.DataTexture(whitePx, 1, 1, THREE.RGBAFormat);
			whiteTex.needsUpdate = true;
			this.renderingMaterial.uniforms.matcapTexture.value = whiteTex;
			this.renderingMaterial.uniforms.matcapTexture2.value = whiteTex;

			// ─ Interaction uniforms
			this.interactionMaterial.uniforms.center.value.set(-1, -1);
			this.interactionMaterial.uniforms.center2.value.set(-1, -1);
			this.interactionMaterial.uniforms.radius.value = 0.05;
			this.interactionMaterial.uniforms.strength.value = 0.05;
			this.interactionMaterial.uniforms.noiseSpeed.value = 0.1;
			this.interactionMaterial.uniforms.noiseAmplitude.value = 0.005;
			this.interactionMaterial.uniforms.noiseFrequency.value = 3;
			this.interactionMaterial.uniforms.uTexture.value = this.fbos[1].texture; // reads sim output

			// ─ Simulation uniforms
			this.simulationMaterial.uniforms.uTexture.value = this.fbos[0].texture; // reads interaction output
			this.simulationMaterial.uniforms.size.value.set(
				this.fbos[0].width / 2,
				this.fbos[0].height / 2
			);

			// ─ Rendering uniforms
			this.renderingMaterial.uniforms.uTexture.value = this.fbos[1].texture; // reads sim output
			this.renderingMaterial.uniforms.size.value.set(this.fbos[1].width, this.fbos[1].height);
			this.renderingMaterial.uniforms.eye.value.copy(this.camera.position).normalize();

			// ─ Half-sphere geometry: SphereGeometry(1, 100, 100, 0, Math.PI)
			const sphereGeo = new THREE.SphereGeometry(1, 100, 100, 0, Math.PI);
			this.sphere = new THREE.Mesh(sphereGeo, this.renderingMaterial);
			this.scene.add(this.sphere);

			// ─ Load initial matcap texture
			const isDark = !document.documentElement.classList.contains('light');
			const darkTex = '/ob/textures/ob_texture-old-2.jpg';
			const lightTex = '/ob/textures/ob_texture-old.webp';
			this.setTexture(isDark ? darkTex : lightTex);

			this.addListeners();
			this.resize();
			this.clock.start();

			// ─ Auto-pulse: random ripple every 200ms
			this.intervalId = setInterval(() => {
				this.interactionMaterial.uniforms.center2.value.set(
					0.5 + Math.random() * 0.5,
					Math.random()
				);
				setTimeout(() => {
					this.interactionMaterial.uniforms.center2.value.set(-1, -1);
				}, 10);
			}, 200);

			this.frameId = window.requestAnimationFrame(this.update);

			// ─ ResizeObserver: 컨테이너 크기 변경 시 renderer/camera 동기화
			// (GSAP가 width:0→80vh로 키울 때도 캔버스 크기 업데이트)
			this.resizeObserver = new ResizeObserver(() => {
				const { offsetWidth: rw, offsetHeight: rh } = this.el;
				if (rw > 0 && rh > 0) {
					this.resize();
				}
			});
			this.resizeObserver.observe(this.el);

			// 이미 컨테이너가 크기를 가지고 있으면 즉시 resize (Three.js 로드가 늦었을 때)
			const { offsetWidth: fw, offsetHeight: fh } = this.el;
			if (fw > 0 && fh > 0) {
				this.renderer.setSize(fw, fh);
				this.camera.aspect = fw / fh;
				this.camera.updateProjectionMatrix();
			}
		}

		// ── Exact InteractionMaterial shader from offbrand-orb.iife.js ────────
		private buildInteractionMaterial(THREE: typeof import('three')): import('three').ShaderMaterial {
			return new THREE.ShaderMaterial({
				vertexShader: /* glsl */`
varying vec2 vUv;
void main(){
  vUv=uv;
  gl_Position=vec4(position,1.0);
}`,
				fragmentShader: /* glsl */`
const float PI=3.141592653589793;
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform sampler2D uTexture;
uniform vec2 center;
uniform vec2 center2;
uniform float radius;
uniform float strength;
uniform float time;
uniform float noiseSpeed;
uniform float noiseAmplitude;
uniform float noiseFrequency;
uniform bool mouseDown;
varying vec2 vUv;
void main(){
  vec4 data=texture2D(uTexture,vUv);
  float realStrength=strength;
  float dist=length(center-vUv);
  float drop=max(0.0,1.0-dist/radius);
  drop=0.5-cos(drop*PI)*0.5;
  if(mouseDown){data.r-=drop*realStrength;}else{data.r+=drop*realStrength;}
  float dist2=length(center2-vUv);
  float drop2=max(0.0,1.0-dist2/radius);
  drop2=0.5-cos(drop2*PI)*0.5;
  data.r+=drop2*strength;
  data.r+=snoise(vec3(vUv,time*noiseSpeed)*noiseFrequency)*noiseAmplitude;
  gl_FragColor=data;
}`,
				uniforms: {
					time:           { value: 0 },
					uTexture: { value: null },
					center:         { value: new THREE.Vector2(-1, -1) },
					center2:        { value: new THREE.Vector2(-1, -1) },
					radius:         { value: 0.05 },
					strength:       { value: 0.05 },
					noiseSpeed:     { value: 0.1 },
					noiseAmplitude: { value: 0.005 },
					noiseFrequency: { value: 3 },
					mouseDown:      { value: false },
				},
			});
		}

		// ── Exact SimulationMaterial shader from offbrand-orb.iife.js ─────────
		private buildSimulationMaterial(THREE: typeof import('three')): import('three').ShaderMaterial {
			return new THREE.ShaderMaterial({
				vertexShader: /* glsl */`
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
				fragmentShader: /* glsl */`
uniform sampler2D uTexture;
uniform vec2 size;
varying vec2 vUv;
void main(){
  vec4 data=texture2D(uTexture,vUv);
  vec2 dx=vec2(1.0/size.x,0.0);
  vec2 dy=vec2(0.0,1.0/size.y);
  float average=(texture2D(uTexture,vUv-dx).r+texture2D(uTexture,vUv-dy).r+texture2D(uTexture,vUv+dx).r+texture2D(uTexture,vUv+dy).r)*0.25;
  data.g+=(average-data.r)*2.0;
  data.g*=0.995;
  data.r+=data.g;
  data.r*=0.995;
  gl_FragColor=data;
}`,
				uniforms: {
					uTexture: { value: null },
					size:    { value: new THREE.Vector2(128, 128) },
				},
			});
		}

		// ── Exact RenderingMaterial shader from offbrand-orb.iife.js ──────────
		private buildRenderingMaterial(THREE: typeof import('three')): import('three').ShaderMaterial {
			return new THREE.ShaderMaterial({
				vertexShader: /* glsl */`
uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vPosition;
void main(){
  vUv=uv;
  vec4 data=texture2D(uTexture,uv);
  vec3 transformed=position;
  transformed+=normal*data.r*0.7;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(transformed,1.0);
  vPosition=gl_Position.xyz;
}`,
				fragmentShader: /* glsl */`
uniform sampler2D uTexture;
uniform sampler2D matcapTexture;
uniform sampler2D matcapTexture2;
uniform float textureMix;
uniform vec2 size;
uniform vec3 eye;
uniform vec3 lightDirection;
uniform float angle;
varying vec2 vUv;
varying vec3 vPosition;
vec2 matcap(vec3 eye,vec3 normal){
  vec3 reflected=reflect(eye,normal);
  float m=2.8284271247461903*sqrt(reflected.z+1.0);
  return reflected.xy/m+0.5;
}
float lambert(vec3 N,vec3 L){
  vec3 nrmN=normalize(N);
  vec3 nrmL=normalize(L);
  float result=dot(nrmN,nrmL);
  return max(result,0.0);
}
float blendOverlay(float base,float blend){
  return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}
vec3 blendOverlay(vec3 base,vec3 blend){
  return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}
vec2 rotateUV(vec2 uv,float rotation){
  float mid=0.5;
  return vec2(cos(rotation)*(uv.x-mid)+sin(rotation)*(uv.y-mid)+mid,cos(rotation)*(uv.y-mid)-sin(rotation)*(uv.x-mid)+mid);
}
void main(){
  vec4 data=texture2D(uTexture,vUv);
  vec3 tangent=vec3(1.0/size.x,texture2D(uTexture,vec2(vUv.x+(1.0/size.x),vUv.y)).r-data.r,0.0);
  vec3 bitangent=vec3(0.0,texture2D(uTexture,vec2(vUv.x,vUv.y+(1.0/size.y))).r-data.r,1.0/size.y);
  vec3 normal=normalize(cross(tangent,bitangent));
  normal=vec3(normal.x,sqrt(1.0-dot(normal.xz,normal.xz)),normal.z);
  vec2 matcapUv=matcap(eye,normal).xy;
  vec3 cyan=vec3(0.47,0.729,0.9);
  float light=lambert(normal,lightDirection);
  float specularStrength=0.025;
  vec3 viewDir=normalize(eye-vPosition);
  vec3 reflectDir=reflect(lightDirection,normal);
  float spec=pow(max(dot(viewDir,reflectDir),0.0),8.0);
  vec3 specular=specularStrength*spec*cyan;
  vec2 rotatedUv=rotateUV(vUv,angle);
  vec3 color=mix(texture2D(matcapTexture,rotatedUv).rgb,texture2D(matcapTexture2,rotatedUv).rgb,textureMix);
  gl_FragColor=vec4(blendOverlay(color,vec3(light))+specular,1.0);
}`,
				uniforms: {
					uTexture: { value: null },
					matcapTexture:  { value: null },
					matcapTexture2: { value: null },
					textureMix:     { value: 0 },
					size:           { value: new THREE.Vector2(128, 128) },
					eye:            { value: new THREE.Vector3() },
					lightDirection: { value: new THREE.Vector3(0, 1, 1) },
					angle:          { value: Math.PI / 2 },
				},
			});
		}

		private addListeners() {
			window.addEventListener('resize', this.onResize);
			window.addEventListener('mousedown', this.onMouseDown);
			window.addEventListener('mousemove', this.onMouseMove);
		}

		removeListeners() {
			window.removeEventListener('resize', this.onResize);
			window.removeEventListener('mousedown', this.onMouseDown);
			window.removeEventListener('mouseup', this.onMouseUp);
			window.removeEventListener('mousemove', this.onMouseMove);
		}

		private onResize = () => this.resize();

		private onMouseDown = () => {
			this.interactionMaterial.uniforms.mouseDown.value = true;
			window.addEventListener('mouseup', this.onMouseUp);
		};

		private onMouseUp = () => {
			this.interactionMaterial.uniforms.mouseDown.value = false;
			window.removeEventListener('mouseup', this.onMouseUp);
		};

		private onMouseMove = (e: MouseEvent) => {
			this.mousePosition.x = e.clientX;
			this.mousePosition.y = e.clientY;
		};

		private update = () => {
			const rect = this.el.getBoundingClientRect();

			// Mouse → normalised clip coords
			this.normalizedMousePosition.x =
				((this.mousePosition.x - rect.left) / rect.width) * 2 - 1;
			this.normalizedMousePosition.y =
				-((this.mousePosition.y - rect.top) / rect.height) * 2 + 1;

			// Raycasting → UV on sphere
			this.raycaster.setFromCamera(
				this.normalizedMousePosition as unknown as import('three').Vector2,
				this.camera
			);
			const hits = this.raycaster.intersectObject(this.sphere);
			if (hits[0]?.uv) {
				this.interactionMaterial.uniforms.center.value.copy(hits[0].uv);
			} else {
				this.interactionMaterial.uniforms.center.value.set(-1, -1);
			}

			// Time
			const t = this.clock.getElapsedTime();
			this.interactionMaterial.uniforms.time.value = t;

			// Oscillating light direction
			this.angle += 0.01 * this.angleChangeSpeed;
			const margin = 0.5;
			if (this.angle > Math.PI - margin) {
				this.angleChangeSpeed *= -1;
				this.angle = Math.PI - margin;
			} else if (this.angle < margin) {
				this.angleChangeSpeed *= -1;
				this.angle = margin;
			}
			const lx = Math.cos(this.angle);
			const ly = Math.sin(this.angle);
			this.renderingMaterial.uniforms.lightDirection.value.set(lx, ly, 1);
			this.renderingMaterial.uniforms.angle.value = this.angle;

			this.render();
			this.frameId = window.requestAnimationFrame(this.update);
		};

		private render() {
			// Pass 1: interaction → fbos[0]
			this.fboPlane.material = this.interactionMaterial as any;
			this.renderer.setRenderTarget(this.fbos[0]);
			this.renderer.render(this.fboScene, this.camera);

			// Pass 2: simulation → fbos[1]
			this.fboPlane.material = this.simulationMaterial as any;
			this.renderer.setRenderTarget(this.fbos[1]);
			this.renderer.render(this.fboScene, this.camera);

			// Pass 3: render sphere to screen
			this.renderer.setRenderTarget(null);
			this.renderer.render(this.scene, this.camera);
		}

		resize() {
			const { offsetWidth: w, offsetHeight: h } = this.el;
			if (w === 0 || h === 0) return; // 0x0 캔버스 방지
			this.renderer.setSize(w, h);
			this.camera.aspect = w / h;
			this.camera.updateProjectionMatrix();
		}

		private _matcapLoaded = false;

		setTexture(url: string) {
			import('three').then(({ TextureLoader }) => {
				const loader = new TextureLoader();
				loader.load(url, (tex) => {
					const u = this.renderingMaterial.uniforms;
					if (!this._matcapLoaded) {
						// First real texture: replace the DataTexture fallback on both slots, snap to it
						u.matcapTexture.value = tex;
						u.matcapTexture2.value = tex;
						u.textureMix.value = 0;
						this._matcapLoaded = true;
					} else {
						// Subsequent: crossfade via alternate slot
						const fromSlot = u.textureMix.value < 0.5 ? 2 : 1;
						if (fromSlot === 2) {
							u.matcapTexture2.value = tex;
							const start = performance.now();
							const fade = () => {
								const p = Math.min((performance.now() - start) / 300, 1);
								u.textureMix.value = p;
								if (p < 1) requestAnimationFrame(fade);
							};
							requestAnimationFrame(fade);
						} else {
							u.matcapTexture.value = tex;
							const start = performance.now();
							const fade = () => {
								const p = Math.min((performance.now() - start) / 300, 1);
								u.textureMix.value = 1 - p;
								if (p < 1) requestAnimationFrame(fade);
							};
							requestAnimationFrame(fade);
						}
					}
				});
			});
		}

		dispose() {
			this.clock.stop();
			this.removeListeners();
			if (this.intervalId) clearInterval(this.intervalId);
			if (this.resizeObserver) this.resizeObserver.disconnect();
			window.cancelAnimationFrame(this.frameId);
			this.renderer.dispose();
			this.fbos[0].dispose();
			this.fbos[1].dispose();
		}
	}

	onMount(() => {
		if (!orbEl) return;
		orbInstance = new OrbClass(orbEl);

		// Listen for dark/light mode changes
		const observer = new MutationObserver(() => {
			const isDark = !document.documentElement.classList.contains('light');
			orbInstance?.setTexture(
				isDark
					? '/ob/textures/ob_texture-old-2.jpg'
					: '/ob/textures/ob_texture-old.webp'
			);
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		return () => {
			observer.disconnect();
			orbInstance?.dispose();
			orbInstance = null;
		};
	});
</script>

<!-- data-orb 타깃: layout.svelte의 .orb-w 안에 위치 -->
<!-- GSAP이 초기에 width:0em + autoAlpha:0 으로 세팅 후 두 단계로 애니메이션 (원본과 동일) -->
<div data-orb="" class="orb" bind:this={orbEl}></div>
