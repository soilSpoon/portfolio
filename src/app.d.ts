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

	// 커스텀 HTML 데이터 속성 타입 선언
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			// 커스텀 속성 (data-* 없이 직접 사용)
			'home-hero'?: boolean | string;
			'hh-tb'?: string;
			'split-hero'?: boolean | string;
			'split-text'?: boolean | string;
			'grid-anim'?: boolean | string;
			'home-work'?: boolean | string;
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
			'mode-toggle'?: string;
			'data-lenis-prevent'?: boolean | string;
			'data-cursor-wrap'?: boolean | string;
			'data-cursor'?: boolean | string;
			'data-cursor-hover'?: boolean | string;
			'data-hide'?: string;
		}
	}
}

export {};
