import { PillGroup, type PillOption } from '../../../design-system/atoms/PillGroup'
import { useNumberInput } from '../../../design-system/headless/useNumberInput'
import {
  OVEN_PROFILES,
  ovenProfileFor,
  type OvenType,
} from '../../../domain/Oven'

const OVEN_HEADING_ID = 'execution-oven-guidance'

export interface OvenGuidanceProps {
  readonly selectedOven: OvenType | null
  readonly onSelectOven: (type: OvenType) => void
  readonly preheatMinutes: number | null
  readonly onChangePreheatMinutes: (minutes: number) => void
}

export function OvenGuidance({
  selectedOven,
  onSelectOven,
  preheatMinutes,
  onChangePreheatMinutes,
}: OvenGuidanceProps) {
  const options: PillOption<OvenType>[] = OVEN_PROFILES.map((p) => ({
    value: p.type,
    label: p.label,
  }))

  const profile = selectedOven ? ovenProfileFor(selectedOven) : null

  return (
    <section
      aria-labelledby={OVEN_HEADING_ID}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 sm:p-8 space-y-5"
    >
      <div>
        <h2
          id={OVEN_HEADING_ID}
          className="font-headline text-2xl text-on-surface"
        >
          Oven
        </h2>
        <p className="font-body text-sm text-on-surface-variant italic mt-1">
          Pick your setup — we&rsquo;ll show the temp, preheat, and phase notes
          for it.
        </p>
      </div>

      <PillGroup<OvenType>
        ariaLabel="Oven type"
        options={options}
        value={selectedOven}
        onChange={onSelectOven}
        stretch
      />

      {profile ? (
        <OvenProfileDetails
          profile={profile}
          preheatMinutes={preheatMinutes}
          onChangePreheatMinutes={onChangePreheatMinutes}
        />
      ) : (
        <p className="font-body text-sm text-on-surface-variant">
          Pick an oven type above to see temperature and preheat guidance.
        </p>
      )}
    </section>
  )
}

function OvenProfileDetails({
  profile,
  preheatMinutes,
  onChangePreheatMinutes,
}: {
  profile: ReturnType<typeof ovenProfileFor>
  preheatMinutes: number | null
  onChangePreheatMinutes: (minutes: number) => void
}) {
  return (
    <div className="space-y-5 animate-slide-up-fade">
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ProfileFact label="Temperature" value={profile.tempRange} />
        <ProfileFact label="Preheat" value={profile.preheatRange} />
        <ProfileFact label="Phase" value={profile.phaseGuidance} />
      </dl>

      <PreheatInput
        minutes={preheatMinutes}
        onChange={onChangePreheatMinutes}
      />
    </div>
  )
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-low rounded-xl px-4 py-3">
      <dt className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant mb-1">
        {label}
      </dt>
      <dd className="font-body text-sm text-on-surface">{value}</dd>
    </div>
  )
}

function PreheatInput({
  minutes,
  onChange,
}: {
  minutes: number | null
  onChange: (minutes: number) => void
}) {
  const input = useNumberInput({
    value: minutes ?? 0,
    onChange,
  })
  return (
    <label className="flex items-center gap-3 pt-2 border-t border-outline-variant/15">
      <span className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant">
        Time to target temperature
      </span>
      <span className="inline-flex items-baseline gap-1 px-3 py-1.5 rounded-full bg-surface-container-low">
        <input
          {...input.getInputProps()}
          aria-label="Time to target temperature in minutes"
          className="w-12 bg-transparent text-right font-headline italic text-base text-on-surface tabular-nums focus:outline-none"
        />
        <span aria-hidden="true" className="font-label text-xs text-on-surface-variant">
          min
        </span>
      </span>
    </label>
  )
}
