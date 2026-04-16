import { useContext } from 'react'
import {
  BakeStorageContext,
  type BakeStorageValue,
} from './bake-storage-context'

export function useBakeStorageValue(): BakeStorageValue {
  const value = useContext(BakeStorageContext)
  if (!value) {
    throw new Error(
      'useBakeStorageValue must be used within a BakeStorageProvider',
    )
  }
  return value
}
