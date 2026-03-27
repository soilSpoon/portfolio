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
