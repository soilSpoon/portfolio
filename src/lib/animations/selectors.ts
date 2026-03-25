export const SELECTORS = {
  orb: '[data-orb]',
  orbCanvas: '[data-orb] canvas',
  orbOutline1: '[orb-outline="1"]',
  orbOutline2: '[orb-outline="2"]',
  pageWrapper: '.page-w',
  hudBrand: '.hud-brand-link',
  hudBrandLink: '.hud-brand-link',
  hudScroll: '.hud-scroll-w',
  hudMenu: '.hud-menu-w',
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
