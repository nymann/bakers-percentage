import type { ReactNode } from 'react'
import { tokens } from '../tokens'

export function Table({ children }: { children: ReactNode }) {
  return (
    <table
      style={{
        borderCollapse: 'collapse',
        width: '100%',
        fontFamily: tokens.typography.fontFamily,
        fontSize: tokens.typography.body.size,
        color: tokens.colors.text,
      }}
    >
      {children}
    </table>
  )
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        borderBottom: `2px solid ${tokens.colors.border}`,
        fontWeight: tokens.typography.heading.weight,
      }}
    >
      {children}
    </th>
  )
}

export function TableCell({ children }: { children: ReactNode }) {
  return (
    <td
      style={{
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}
    >
      {children}
    </td>
  )
}
