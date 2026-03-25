/**
 * 디자인 토큰 — JS/GSAP 접근용
 *
 * CSS 변수(src/routes/layout.css :root)와 반드시 동기화 유지.
 * CSS 변수를 바꾸면 여기도 함께 수정할 것.
 */

/** GSAP 및 JS 애니메이션용 duration (단위: 초) */
export const duration = {
	fast: 0.3, // --dur-fast
	med: 0.6 // --dur-med
} as const;

/** CSS transition 및 GSAP ease 문자열 */
export const ease = {
	smooth: 'cubic-bezier(0.38, 0.005, 0.215, 1)' // --ease-smooth
} as const;

/** 타이포그래피 스케일 (단위: em — body font-size ≈ 1vw) */
export const fs = {
	hA: 6.75, // --fs-h-a
	hB: 3.5, // --fs-h-b
	hC: 1.8, // --fs-h-c
	eyebrow: 0.85, // --fs-eyebrow
	small: 0.8, // --fs-small
	mini: 0.65 // --fs-mini
} as const;
