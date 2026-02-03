import { useState, useEffect } from 'react'
import type { SotaData } from '../types/location'
import { loadSotaData } from '../utils/api'

export function useSotaData() {
  const [sotaData, setSotaData] = useState<SotaData | null>(null)

  useEffect(() => {
    loadSotaData().then(setSotaData)
  }, [])

  return sotaData
}
