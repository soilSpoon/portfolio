// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// itsoffbrand.com 클론 — 커스텀 HTML 데이터 속성 타입 선언
	namespace svelteHTML {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface SVGAttributes<T> {
			'hsc-scale'?: boolean | string;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface HTMLAttributes<T> {
			// 커스텀 속성 (data-* 없이 직접 사용)
			'pointer-none'?: boolean | string;
			'pointer-auto'?: boolean | string;
			'home-hero'?: boolean | string;
			'hh-tb'?: string;
			'split-hero'?: boolean | string;
			'split-text'?: boolean | string;
			'grid-anim'?: boolean | string;
			'hsc-track'?: boolean | string;
			'hsc-scale'?: boolean | string;
			'hsc-img'?: boolean | string;
			'hsc-rotate'?: boolean | string;
			'hsc-text'?: boolean | string;
			'home-work'?: boolean | string;
			'work-hero'?: boolean | string;
			'orb-out-w'?: string;
			'orb-out-r'?: string;
			'orb-outline'?: string;
			'data-orb'?: boolean | string;
			'data-orb-wrap'?: boolean | string;
			'stagger-scroll'?: boolean | string;
			'stagger-lines'?: boolean | string;
			'stagger-el'?: boolean | string;
			'stagger-text'?: boolean | string;
			'btn-reveal'?: boolean | string;
			'reveal-target'?: boolean | string;
			'link-reveal'?: boolean | string;
			'hover-anim'?: boolean | string;
			'home-vid'?: boolean | string;
			'gradient-evolve'?: boolean | string;
			'mode-toggle'?: string;
			'scale-up-feature'?: string;
			'about-line'?: boolean | string;
			'about-line-section'?: boolean | string;
			'ent-vid'?: string;
			'ent-video-showreel'?: boolean | string;
			'data-start'?: string;
			'data-lenis-prevent'?: boolean | string;
			'data-cursor-wrap'?: boolean | string;
			'data-cursor'?: boolean | string;
			'data-cursor-hover'?: boolean | string;
			'data-hide'?: string;
			'pre-text'?: boolean | string;
			'pre-percent'?: boolean | string;
		}
	}
}

export {};
