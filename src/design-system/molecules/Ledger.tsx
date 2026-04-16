import type { ReactNode } from 'react'

export type LedgerRow = {
  name: string
  grams: number
  total?: number
  percentage: string
}

export type LedgerProps = {
  rows: readonly LedgerRow[]
  multiLoaf: boolean
  totalDoughWeight: number
  finishedLoafWeight: number
  hydrationPercent: number
  title?: ReactNode
}

export function Ledger({
  rows,
  multiLoaf,
  totalDoughWeight,
  finishedLoafWeight,
  hydrationPercent,
  title = 'The Formula',
}: LedgerProps) {
  return (
    <section
      aria-label="Ingredient ledger"
      className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/10"
    >
      <div className="flex justify-between items-end mb-4 border-b border-outline-variant/15 pb-3">
        <h2 className="font-headline text-xl italic">{title}</h2>
        <span className="font-label text-xs text-primary">
          Hydration: {Math.round(hydrationPercent * 100)}%
        </span>
      </div>
      <table aria-label="Ingredient ledger" className="w-full tabular-nums">
        <thead>
          <tr>
            <th scope="col" className="text-left font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2 pr-3">
              Ingredient
            </th>
            {multiLoaf ? (
              <>
                <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2 pl-3">
                  Per loaf
                </th>
                <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2 pl-3">
                  Total
                </th>
              </>
            ) : (
              <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2 pl-3">
                Grams
              </th>
            )}
            <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2 pl-3">
              Baker's %
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="group">
              <td className="py-2 pr-3 font-body text-on-surface-variant">{row.name}</td>
              <td className="py-2 pl-3 text-right font-headline text-xl whitespace-nowrap">
                {row.grams}
                <span className="text-xs italic ml-1">g</span>
              </td>
              {multiLoaf && (
                <td className="py-2 pl-3 text-right font-headline text-xl whitespace-nowrap">
                  {row.total ?? row.grams}
                  <span className="text-xs italic ml-1">g</span>
                </td>
              )}
              <td className="py-2 pl-3 text-right font-label text-xs text-on-surface-variant">
                {row.percentage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 pt-4 border-t border-dashed border-outline-variant/40 space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant">
            Total dough weight
          </span>
          <span className="font-headline text-2xl text-primary">
            {totalDoughWeight}
            <span className="text-sm italic ml-1">g</span>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant">
            Finished loaf weight
          </span>
          <span className="font-headline text-lg text-on-surface">
            {finishedLoafWeight}
            <span className="text-sm italic ml-1">g</span>
          </span>
        </div>
      </div>
    </section>
  )
}
