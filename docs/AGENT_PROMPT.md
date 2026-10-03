# Orca + Pi handoff

You are continuing REBELSTAR-II-WEB.

Read, in order:
1. `docs/RESEARCH.md`
2. `docs/REVERSE_SPEC.md`
3. `docs/ACCEPTANCE.md`
4. `docs/TODO.md`

Rules:
- Do not silently invent original values.
- Mark uncertain rules as SOURCE_REQUIRED.
- Keep simulation independent of rendering.
- Keep all gameplay data data-driven.
- Add tests for every discovered rule.
- Do not replace the original control model with a generic mouse-only interface.
- Preserve deterministic RNG.
- After each gameplay subsystem, run `npm test`.
- Pi/checking environment should report reproducible failures with seed, turn, unit and command sequence.

First task:
Complete the reverse specification and replace placeholder map/unit/weapon data with verified data where possible.

Second task:
Complete pickup/drop/change-item/reload.

Third task:
Complete combat and opportunity fire.

Fourth task:
Implement verified mission objectives and AI.

Fifth task:
Add Spectrum-style rendering/assets only after mechanics are stable.
