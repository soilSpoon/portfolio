// 공유 타입 — 모든 애니메이션 모듈에서 import.
// import type 구문은 컴파일 타임에만 존재 (SSR 사이드 이펙트 없음).
import type { gsap as GsapExport } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

/** GSAP main object type */
export type GsapType = typeof GsapExport;

/** ScrollTrigger class type (constructor + static + instance members) */
export type STType = typeof ScrollTrigger;

/** 모든 애니메이션 셋업 함수에 공통으로 전달되는 컨텍스트 */
export interface AnimCtx {
	gsap: GsapType;
	ST: STType;
}