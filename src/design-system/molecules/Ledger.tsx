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
      className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-outline-variant/10"
    >
      <header className="flex justify-between items-end mb-6 border-b border-outline-variant/15 pb-3">
        <h2 className="font-headline text-xl italic">{title}</h2>
        <span className="font-label text-xs text-primary">
          Hydration: {Math.round(hydrationPercent * 100)}%
        </span>
      </header>
      <table aria-label="Ingredient ledger" className="w-full">
        <thead>
          <tr>
            <th scope="col" className="text-left font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2">
              Ingredient
            </th>
            {multiLoaf ? (
              <>
                <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2">
                  Per loaf
                </th>
                <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2">
                  Total
                </th>
              </>
            ) : (
              <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2">
                Grams
              </th>
            )}
            <th scope="col" className="text-right font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant pb-2">
              Baker's %
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="group">
              <td className="py-2 font-body text-on-surface-variant">{row.name}</td>
              <td className="py-2 text-right font-headline text-xl">
                {row.grams}
                <span className="text-xs italic ml-1">g</span>
              </td>
              {multiLoaf && (
                <td className="py-2 text-right font-headline text-xl">
                  {row.total ?? row.grams}
                  <span className="text-xs italic ml-1">g</span>
                </td>
              )}
              <td className="py-2 text-right font-label text-xs text-on-surface-variant">
                {row.percentage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="mt-6 pt-4 border-t border-dashed border-outline-variant/40 space-y-1">
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
      </footer>
    </section>
  )
}
