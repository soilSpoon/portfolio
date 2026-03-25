export const SELECTORS = {
	orb: '[data-orb]',
	orbCanvas: '[data-orb] canvas',
	orbOutline1: '[orb-outline="1"]',
	orbOutline2: '[orb-outline="2"]',
	pageWrapper: '[data-page-wrapper]',
	hudBrand: '[data-hud-brand]',
	hudBrandLink: '[data-hud-brand]',
	hudScroll: '[data-hud-scroll]',
	hudMenu: '[data-hud-menu]',
	heroTextBlocks: '[hh-tb]',
	heroTextBlock1: '[hh-tb="1"]',
	heroTextBlock2: '[hh-tb="2"]',
	heroTextBlock3: '[hh-tb="3"]',
	heroChars: '[split-hero] .char',
	homeHero: '[home-hero]'
} as const;

export const HERO_TEXT_BLOCK_SELECTORS = [
	SELECTORS.heroTextBlock1,
	SELECTORS.heroTextBlock2,
	SELECTORS.heroTextBlock3
] as const;
