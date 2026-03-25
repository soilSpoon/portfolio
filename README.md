# Portfolio

A SvelteKit portfolio site with a GSAP-driven preloader, animated home sections, and a Three.js orb background.

## Requirements

- Node.js 20+
- npm 10+

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

## Validation

Run type and Svelte checks:

```bash
npm run check
```

Run linting:

```bash
npm run lint
```

Format the repository:

```bash
npm run format
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Notes

- Animation timing and orb alignment constraints are documented in `AGENTS.md`.
- Paraglide runtime files under `src/lib/paraglide` are generated artifacts and should not be edited manually.
