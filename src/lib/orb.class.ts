/**
 * OrbClass — Three.js WebGL 반구형 구체 렌더러
 *
 * offbrand-orb.iife.js 역분석 기반.
 * FBO[0]=256×256 (interaction out), FBO[1]=128×128 (simulation out / render input)
 * Camera: PerspectiveCamera(60, aspect, 0.1, 2), z=2.4
 */
export class OrbClass {
	// Three.js 모듈 레퍼런스 (async init 완료 후 설정)
	private THREE!: typeof import('three');

	private renderer!: import('three').WebGLRenderer;
	private camera!: import('three').PerspectiveCamera;
	private scene!: import('three').Scene;
	private fboScene!: import('three').Scene;
	// Material 타입을 직접 지정해 render()에서 as any 제거
	private fboPlane!: import('three').Mesh<import('three').PlaneGeometry, import('three').Material>;
	private sphere!: import('three').Mesh;
	private fbos!: [import('three').WebGLRenderTarget, import('three').WebGLRenderTarget];
	private interactionMaterial!: import('three').ShaderMaterial;
	private simulationMaterial!: import('three').ShaderMaterial;
	private renderingMaterial!: import('three').ShaderMaterial;
	private timer!: import('three').Timer;
	private raycaster!: import('three').Raycaster;

	private mousePosition = { x: -1, y: -1 };
	private normalizedMousePosition = { x: -1, y: -1 };
	private frameId = 0;
	private intervalId: ReturnType<typeof setInterval> | null = null;
	private angle = Math.PI / 2;
	private angleChangeSpeed = 1;
	private el: HTMLDivElement;
	private _matcapLoaded = false;
	private _initialized = false;

	constructor(el: HTMLDivElement) {
		this.el = el;
		this.init().catch((err) => {
			console.error('[Orb] 초기화 실패:', err);
		});
	}

	private async init(): Promise<void> {
		// ── WebGL 지원 사전 확인 ─────────────────────────────────────────────────
		const testCanvas = document.createElement('canvas');
		const testGl = testCanvas.getContext('webgl2') ?? testCanvas.getContext('webgl');
		if (!testGl) {
			console.warn('[Orb] WebGL 미지원 환경 — Orb 비활성화');
			return;
		}

		let THREE: typeof import('three');
		try {
			THREE = await import('three');
		} catch (err) {
			console.error('[Orb] Three.js 로드 실패:', err);
			return;
		}
		this.THREE = THREE;

		// 원본과 동일: 80vh 기준 버퍼 초기화
		// GSAP 애니메이션(0→4.3em→80vh) 중 리사이즈 없음 → flicker 방지
		const initPx = Math.round(window.innerHeight * 0.8);
		const w = Math.max(initPx, 300);
		const h = w;

		// ─ Renderer (updateStyle:false → CSS width:100% !important가 display 크기 제어)
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(w, h, false);
		this.renderer.setPixelRatio(window.devicePixelRatio || 1);
		this.el.appendChild(this.renderer.domElement);

		// ─ Camera (구체 + FBO passes 공통 사용)
		this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2);
		this.camera.position.z = 2.4;

		// ─ Scenes
		this.scene = new THREE.Scene();
		this.fboScene = new THREE.Scene();
		this.timer = new THREE.Timer();
		this.raycaster = new THREE.Raycaster();

		// ─ Float 텍스처 지원 확인
		const glCtx = this.renderer.getContext();
		const exts = glCtx.getSupportedExtensions() ?? [];
		const texType: typeof THREE.FloatType | typeof THREE.HalfFloatType = exts.includes(
			'EXT_color_buffer_float'
		)
			? THREE.FloatType
			: THREE.HalfFloatType;

		if (!exts.includes('EXT_color_buffer_float') && !exts.includes('EXT_color_buffer_half_float')) {
			console.warn('[Orb] Float/HalfFloat 텍스처 미지원 — HalfFloat fallback 사용');
		}

		// ─ FBOs: [0]=256 (interaction target), [1]=128 (simulation target + render source)
		const fboOpts = {
			format: THREE.RGBAFormat,
			type: texType,
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping
		};
		this.fbos = [
			new THREE.WebGLRenderTarget(256, 256, fboOpts),
			new THREE.WebGLRenderTarget(128, 128, fboOpts)
		];

		// ─ FBO quad (VS: gl_Position=vec4(pos,1.0) → 항상 화면 채움)
		const quadGeo = new THREE.PlaneGeometry(2, 2);
		this.fboPlane = new THREE.Mesh(quadGeo) as import('three').Mesh<
			import('three').PlaneGeometry,
			import('three').Material
		>;
		this.fboScene.add(this.fboPlane);

		// ─ Shader Materials (exact shaders from offbrand-orb.iife.js)
		this.interactionMaterial = this.buildInteractionMaterial(THREE);
		this.simulationMaterial = this.buildSimulationMaterial(THREE);
		this.renderingMaterial = this.buildRenderingMaterial(THREE);

		// ─ Fallback: 실제 matcap 로딩 전 흰색 텍스처로 검은 구체 방지
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
		this.interactionMaterial.uniforms.uTexture.value = this.fbos[1].texture;

		// ─ Simulation uniforms
		this.simulationMaterial.uniforms.uTexture.value = this.fbos[0].texture;
		this.simulationMaterial.uniforms.size.value.set(
			this.fbos[0].width / 2,
			this.fbos[0].height / 2
		);

		// ─ Rendering uniforms
		this.renderingMaterial.uniforms.uTexture.value = this.fbos[1].texture;
		this.renderingMaterial.uniforms.size.value.set(this.fbos[1].width, this.fbos[1].height);
		this.renderingMaterial.uniforms.eye.value.copy(this.camera.position).normalize();

		// ─ 반구 지오메트리: SphereGeometry(1, 100, 100, 0, Math.PI)
		const sphereGeo = new THREE.SphereGeometry(1, 100, 100, 0, Math.PI);
		this.sphere = new THREE.Mesh(sphereGeo, this.renderingMaterial);
		this.scene.add(this.sphere);

		// ─ 초기 matcap 텍스처 로드
		const isDark = !document.documentElement.classList.contains('light');
		this.setTexture(
			isDark ? '/ob/textures/ob_texture-old-2.jpg' : '/ob/textures/ob_texture-old.webp'
		);

		this.addListeners();
		this.resize();
		this.timer.connect(document);
		this._initialized = true;

		// ─ Auto-pulse: 200ms마다 랜덤 파문 생성
		this.intervalId = setInterval(() => {
			this.interactionMaterial.uniforms.center2.value.set(0.5 + Math.random() * 0.5, Math.random());
			setTimeout(() => {
				this.interactionMaterial.uniforms.center2.value.set(-1, -1);
			}, 10);
		}, 200);

		this.frameId = window.requestAnimationFrame(this.update);

		// preloader:done 이후 orb가 최종 크기(80vh)에 도달하면 버퍼 동기화
		window.addEventListener('preloader:done', () => setTimeout(() => this.resize(), 300), {
			once: true
		});
	}

	// ── InteractionMaterial shader (offbrand-orb.iife.js에서 추출) ────────────
	private buildInteractionMaterial(THREE: typeof import('three')): import('three').ShaderMaterial {
		return new THREE.ShaderMaterial({
			vertexShader: /* glsl */ `
varying vec2 vUv;
void main(){
  vUv=uv;
  gl_Position=vec4(position,1.0);
}`,
			fragmentShader: /* glsl */ `
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
				time: { value: 0 },
				uTexture: { value: null },
				center: { value: new THREE.Vector2(-1, -1) },
				center2: { value: new THREE.Vector2(-1, -1) },
				radius: { value: 0.05 },
				strength: { value: 0.05 },
				noiseSpeed: { value: 0.1 },
				noiseAmplitude: { value: 0.005 },
				noiseFrequency: { value: 3 },
				mouseDown: { value: false }
			}
		});
	}

	// ── SimulationMaterial shader ─────────────────────────────────────────────
	private buildSimulationMaterial(THREE: typeof import('three')): import('three').ShaderMaterial {
		return new THREE.ShaderMaterial({
			vertexShader: /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
			fragmentShader: /* glsl */ `
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
				size: { value: new THREE.Vector2(128, 128) }
			}
		});
	}

	// ── RenderingMaterial shader ──────────────────────────────────────────────
	private buildRenderingMaterial(THREE: typeof import('three')): import('three').ShaderMaterial {
		return new THREE.ShaderMaterial({
			vertexShader: /* glsl */ `
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
			fragmentShader: /* glsl */ `
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
				matcapTexture: { value: null },
				matcapTexture2: { value: null },
				textureMix: { value: 0 },
				size: { value: new THREE.Vector2(128, 128) },
				eye: { value: new THREE.Vector3() },
				lightDirection: { value: new THREE.Vector3(0, 1, 1) },
				angle: { value: Math.PI / 2 }
			}
		});
	}

	// ── 이벤트 핸들러 ─────────────────────────────────────────────────────────
	private addListeners(): void {
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('mousemove', this.onMouseMove);
	}

	removeListeners(): void {
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

	// ── rAF 루프 ──────────────────────────────────────────────────────────────
	private update = () => {
		// init() 완료 전에는 프레임 스킵
		if (!this._initialized) {
			this.frameId = window.requestAnimationFrame(this.update);
			return;
		}

		const rect = this.el.getBoundingClientRect();

		// 마우스 → 정규화 좌표 (-1 ~ 1)
		this.normalizedMousePosition.x = ((this.mousePosition.x - rect.left) / rect.width) * 2 - 1;
		this.normalizedMousePosition.y = -((this.mousePosition.y - rect.top) / rect.height) * 2 + 1;

		// Raycasting — new THREE.Vector2()로 타입 단언(as unknown as Vector2) 제거
		const coords = new this.THREE.Vector2(
			this.normalizedMousePosition.x,
			this.normalizedMousePosition.y
		);
		this.raycaster.setFromCamera(coords, this.camera);

		const hits = this.raycaster.intersectObject(this.sphere);
		if (hits[0]?.uv) {
			this.interactionMaterial.uniforms.center.value.copy(hits[0].uv);
		} else {
			this.interactionMaterial.uniforms.center.value.set(-1, -1);
		}

		// 시간 업데이트
		this.timer.update();
		this.interactionMaterial.uniforms.time.value = this.timer.getElapsed();

		// 진동하는 라이트 방향 (margin 안에서 왕복)
		this.angle += 0.01 * this.angleChangeSpeed;
		const margin = 0.5;
		if (this.angle > Math.PI - margin) {
			this.angleChangeSpeed *= -1;
			this.angle = Math.PI - margin;
		} else if (this.angle < margin) {
			this.angleChangeSpeed *= -1;
			this.angle = margin;
		}
		this.renderingMaterial.uniforms.lightDirection.value.set(
			Math.cos(this.angle),
			Math.sin(this.angle),
			1
		);
		this.renderingMaterial.uniforms.angle.value = this.angle;

		this.render();
		this.frameId = window.requestAnimationFrame(this.update);
	};

	private render(): void {
		// Pass 1: interaction → fbos[0]
		this.fboPlane.material = this.interactionMaterial;
		this.renderer.setRenderTarget(this.fbos[0]);
		this.renderer.render(this.fboScene, this.camera);

		// Pass 2: simulation → fbos[1]
		this.fboPlane.material = this.simulationMaterial;
		this.renderer.setRenderTarget(this.fbos[1]);
		this.renderer.render(this.fboScene, this.camera);

		// Pass 3: 화면에 구체 렌더
		this.renderer.setRenderTarget(null);
		this.renderer.render(this.scene, this.camera);
	}

	resize(): void {
		const { offsetWidth: w, offsetHeight: h } = this.el;
		if (w === 0 || h === 0) return;
		// updateStyle:false → CSS(width:100% !important)가 display 크기 제어
		this.renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
	}

	// ── 텍스처 교체 (크로스페이드) ────────────────────────────────────────────
	/**
	 * matcap 텍스처 교체.
	 * 첫 로드: 즉시 적용 (fallback DataTexture 대체).
	 * 이후: 사용 중인 슬롯의 반대편에 로드 후 300ms crossfade.
	 */
	setTexture(url: string): void {
		import('three')
			.then(({ TextureLoader }) => {
				new TextureLoader().load(
					url,
					(tex) => this._applyTexture(tex),
					undefined,
					(err) => console.warn('[Orb] 텍스처 로드 실패:', url, err)
				);
			})
			.catch((err) => console.error('[Orb] Three.js 로드 실패 (setTexture):', err));
	}

	private _applyTexture(tex: import('three').Texture): void {
		const u = this.renderingMaterial.uniforms;
		if (!this._matcapLoaded) {
			// 첫 번째 텍스처: 두 슬롯 모두 즉시 적용 (DataTexture 대체)
			u.matcapTexture.value = tex;
			u.matcapTexture2.value = tex;
			u.textureMix.value = 0;
			this._matcapLoaded = true;
			return;
		}
		// 크로스페이드: 덜 사용 중인 슬롯에 새 텍스처 로드 후 mix 애니메이션
		const useSlot2 = u.textureMix.value < 0.5;
		if (useSlot2) {
			u.matcapTexture2.value = tex;
			this._animateMix(1);
		} else {
			u.matcapTexture.value = tex;
			this._animateMix(0);
		}
	}

	/** textureMix uniform을 target 값으로 300ms 동안 선형 보간 */
	private _animateMix(target: number): void {
		const u = this.renderingMaterial.uniforms;
		const start = performance.now();
		const from = u.textureMix.value;
		const tick = () => {
			const p = Math.min((performance.now() - start) / 300, 1);
			u.textureMix.value = from + (target - from) * p;
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}

	// ── 정리 ──────────────────────────────────────────────────────────────────
	dispose(): void {
		this.timer.disconnect();
		this.removeListeners();
		if (this.intervalId) clearInterval(this.intervalId);
		window.cancelAnimationFrame(this.frameId);
		this.renderer.dispose();
		this.fbos[0].dispose();
		this.fbos[1].dispose();
	}
}
