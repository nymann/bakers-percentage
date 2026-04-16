export function BakingGuidance() {
  return (
    <section
      aria-label="Baking guidance"
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-4 sm:p-6 space-y-6"
    >
      <div>
        <span className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant block mb-2">
          Baking guidance
        </span>
        <p className="font-body text-sm text-on-surface-variant italic">
          Lean hearth breads — boule, b&acirc;tard, country, baguette. The
          numbers below are ranges, not set points. Ovens can sit up to
          &plusmn;28&nbsp;&deg;C from their dial, and the bake-end decision
          lives in the crust, not the timer.
        </p>
      </div>

      <div>
        <h3 className="font-label text-[0.8rem] text-on-surface mb-2">
          Preheat &amp; load
        </h3>
        <p className="font-body text-sm text-on-surface-variant mb-3">
          Preheat to target, then give the vessel enough time to soak up heat.
          Thermal mass matters more than the dial.
        </p>
        <ul className="font-body text-sm text-on-surface-variant space-y-1.5 list-disc pl-5 marker:text-on-surface-variant/40">
          <li>
            <span className="text-on-surface">Dutch oven</span> — 230–260&nbsp;&deg;C,
            30–45 min preheat. 20 min lid on, then 20 min lid off to finish the
            crust.
          </li>
          <li>
            <span className="text-on-surface">Stone or steel with steam</span> —
            240–260&nbsp;&deg;C, 45–60 min preheat. Steam the first 15 min (ice
            in a pan, lava rocks, or injection), then vent.
          </li>
          <li>
            <span className="text-on-surface">Sheet pan, no steam</span> —
            220–230&nbsp;&deg;C, 30 min preheat. Expect a thinner crust and
            less oven spring.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-label text-[0.8rem] text-on-surface mb-2">
          Knowing it&rsquo;s done
        </h3>
        <p className="font-body text-sm text-on-surface-variant mb-3">
          For lean hearth, the crust is the primary signal. The thermometer
          tells you the crumb has set — not that the bake is finished. These
          are two separate events.
        </p>
        <ul className="font-body text-sm text-on-surface-variant space-y-1.5 list-disc pl-5 marker:text-on-surface-variant/40">
          <li>
            <span className="text-on-surface">Crust colour (primary)</span> —
            deep mahogany, no pale patches on the sides or under the ears.
            Darker than feels safe.
          </li>
          <li>
            <span className="text-on-surface">Weight in hand</span> — noticeably
            lighter than when it went in. Water has been driven off; the loaf
            rings lighter than its size suggests.
          </li>
          <li>
            <span className="text-on-surface">Knock on the bottom</span> — a
            hollow thump means the interior has set and vapour has vented.
          </li>
          <li>
            <span className="text-on-surface">Internal temperature</span> —
            96–99&nbsp;&deg;C marks the crumb as gelatinised and no longer
            gummy. It plateaus there while water remains, so it goes
            insensitive exactly when you need precision. Use it to rule out
            underbaking, not to call the bake done. Baguettes are too thin for
            a probe to help.
          </li>
        </ul>
        <p className="font-body text-sm text-on-surface-variant mt-3">
          <span className="text-on-surface">Crust vs keeping trade&shy;off.</span>{' '}
          The bake-out period after the crumb sets deepens colour and flavour
          but accelerates starch retrogradation — the loaf firms up faster
          over the next 24&nbsp;h. If it&rsquo;s for today, push the crust
          dark. If it&rsquo;s for tomorrow, pull at the lower end of done, or
          freeze once fully cool.
        </p>
      </div>

      <div>
        <h3 className="font-label text-[0.8rem] text-on-surface mb-2">
          After the oven
        </h3>
        <ul className="font-body text-sm text-on-surface-variant space-y-1.5 list-disc pl-5 marker:text-on-surface-variant/40">
          <li>
            <span className="text-on-surface">
              Cool to ~35&nbsp;&deg;C internal before slicing.
            </span>{' '}
            1.5–2 h for loaves over 1&nbsp;kg. Slicing earlier vents steam and
            locks in a gummy crumb even when the bake was correct.
          </li>
          <li>
            <span className="text-on-surface">Don&rsquo;t package hot.</span>{' '}
            Condensation softens the crust and seeds mould within 24–48&nbsp;h.
            Day&nbsp;0: uncovered or cloth, cut-side down.
          </li>
          <li>
            <span className="text-on-surface">Never refrigerate.</span> Starch
            retrogrades fastest at fridge temperature (~4&nbsp;&deg;C) — the
            worst storage for softness in the 0–72&nbsp;h window.
          </li>
          <li>
            <span className="text-on-surface">Day 1–2</span> — paper bag or
            bread box. Slows surface drying without trapping moisture.
          </li>
          <li>
            <span className="text-on-surface">Beyond day 2–3</span> — slice and
            freeze. Freezing is the only way to pause retrogradation; toasting
            from frozen refreshes cleanly.
          </li>
        </ul>
      </div>
    </section>
  )
}
