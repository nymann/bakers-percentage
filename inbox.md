# Inbox

Unprocessed items. Run `/clarify` to triage into next-actions, projects, reference, or someday.

---

## Yeast fermentation: replace heuristic Q10 model with empirical kinetics

**Captured:** 2026-04-16

**Context:** First pass of `YeastFermentation` will use Q10 ≈ 2.2 with a single reference point (1% IDY, 24 °C, 4 h prebake). That's a heuristic — fine for dragging the timeline, not enough to claim parity with the sourdough side (Ratkowsky/Vrancken 2011, Gänzle 1998).

**What's missing for a full model:**

- **S. cerevisiae cardinal-temperature parameters in dough** — T_min, T_opt, T_max for *Saccharomyces cerevisiae* in lean wheat dough (not wort, not lab medium). Candidate paper: Arroyo-López, Orlić, Querol, Barrio (2009), *Int. J. Food Microbiology* — combined T/pH/sugar effects on S. cerevisiae growth. Verify it covers the 15–35 °C range we care about.
- **Inoculum-to-time relationship** — confirm the 1/yeast% inverse holds across realistic yeast loads (0.1%–3% IDY). Likely sublinear at high inoculum due to substrate competition.
- **Fresh vs. instant equivalence** — the "3×" factor varies by manufacturer (SAF-Instant vs. Red Star vs. fresh cake). Need a defensible single ratio or a per-type table.
- **Salt inhibition** — salt at 1.8–2.2% slows fermentation measurably (~10–20%). Currently ignored. Need a coefficient.
- **Bulk vs. proof split** — sketch hardcodes 65/35. Real split depends on shaping technique and target crumb. Look for a reference (Cauvain & Young, *Technology of Breadmaking*).
- **Over-proof boundary** — at what gas-cell volume does the loaf collapse? Sourdough side uses LAB acidification as the proxy; yeast needs a different proxy (CO₂ retention curve). Check Pyler & Gorton, *Baking Science and Technology* vol. 2.
- **Cold-retard for yeast** — yeast keeps fermenting in the fridge (unlike LAB-only retard). Need a separate `RetardYeastFermentation` analogous to `RetardFermentation`, with a much steeper temperature cutoff.

**Books to consult:**
- Cauvain & Young — *Technology of Breadmaking* (3rd ed., 2015) — quantitative proof-time models.
- Pyler & Gorton — *Baking Science and Technology* (4th ed., 2008) — Q10 / Arrhenius treatments, salt & sugar effects.
- Hamelman — *Bread* (3rd ed., 2021) — DDT equation, practitioner cross-check.

**Possible outcome:** New `references/sources.md` entries for the yeast literature, plus a `YeastFermentation` rewrite that replaces hardcoded constants with cited parameters. Likely a multi-scenario user story, not a single PR.

**Scope decisions (2026-04-16):**
- **Prerequisite refactor (separate commit/PR):** rename `FermentationStrategy.starterPercent` → `inoculumPercent`. Sourdough term leaks into the yeast strategy otherwise. Do this before adding `YeastFermentation`.
- **Include cold-retard for yeast in the same story.** Yeast keeps fermenting in the fridge (unlike LAB-only retard), so a `YeastRetardFermentation` parallel to `RetardFermentation` is part of the model, not a follow-up.
