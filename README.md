# REBELSTAR2JS

Browser-native reconstruction scaffold for **Rebelstar II: Alien Encounter (ZX Spectrum 48K)**.

This package is deliberately split into:
- deterministic game simulation;
- data-driven rules;
- browser renderer;
- input layer;
- AI;
- tests;
- research/specification.

The current package is a **playable engine scaffold**, not a claim of complete ROM-level conversion. Original values that have not yet been verified are marked as `TODO/SOURCE_REQUIRED`.

## Run

Requires Node.js 20.19+.

```bash
npm install
npm test
npm run dev
```

Then open the Vite URL shown in the terminal.

## Architecture

INPUT -> COMMAND -> ENGINE -> GAME STATE -> EVENTS -> RENDERER

Rendering must never own game rules.

## Acceptance

See `docs/ACCEPTANCE.md`.

## Research discipline

See `docs/RESEARCH.md` and `docs/REVERSE_SPEC.md`.
