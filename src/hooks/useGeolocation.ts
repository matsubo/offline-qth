import { useState, useEffect, useCallback } from 'react'
import type { LocationData, QTHInfo } from '../types/location'
import { getElevation, reverseGeocode, findLocationInfo } from '../utils/api'
import { convertToDMS, calculateGridLocator } from '../utils/coordinate'

export function useGeolocation(locationData: LocationData | null) {
  const [status, setStatus] = useState('位置情報を取得中...')
  const [location, setLocation] = useState<QTHInfo | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [error, setError] = useState<string | null>(null)

  // オンライン/オフライン状態の監視
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const fetchLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('位置情報がサポートされていません')
      setStatus('位置情報がサポートされていません')
      return
    }

    setStatus('位置情報を取得中...')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const altitudeGPS = position.coords.altitude

        // 即座に表示できる情報をセット
        const initialData: QTHInfo = {
          latitude: convertToDMS(lat, true),
          longitude: convertToDMS(lon, false),
          latRaw: lat,
          lonRaw: lon,
          gridLocator: calculateGridLocator(lat, lon),
          elevation: altitudeGPS ? `${Math.round(altitudeGPS)}m (GPS)` : '取得中...',
          prefecture: '取得中...',
          city: '取得中...',
          jcc: '取得中...',
          jcg: '取得中...'
        }

        setLocation(initialData)
        setStatus('詳細情報を取得中...')

        // オンラインの場合、API で詳細情報を取得
        if (navigator.onLine) {
          try {
            // 標高を取得
            const elevation = await getElevation(lat, lon)
            if (elevation !== null) {
              initialData.elevation = `${elevation}m`
            }

            // 住所を取得
            const geoData = await reverseGeocode(lat, lon)
            if (geoData) {
              initialData.prefecture = geoData.prefecture || '不明'
              initialData.city = geoData.city || '不明'
            }
          } catch (err) {
            console.error('API取得エラー:', err)
            initialData.prefecture = '取得失敗'
            initialData.city = '取得失敗'
          }

          // JCC/JCGを取得
          const locationInfo = findLocationInfo(lat, lon, locationData)
          initialData.jcc = locationInfo.jcc
          initialData.jcg = locationInfo.jcg

          setLocation({ ...initialData })
          setStatus('位置情報を取得しました')
        } else {
          // オフラインの場合
          const locationInfo = findLocationInfo(lat, lon, locationData)
          initialData.prefecture = `${locationInfo.prefecture} (推定)`
          initialData.city = `${locationInfo.city} (推定)`
          initialData.jcc = locationInfo.jcc
          initialData.jcg = locationInfo.jcg
          initialData.elevation = '取得不可'

          setLocation({ ...initialData })
          setStatus('オフラインモード：推定値を表示')
        }
      },
      (error) => {
        let errorMessage = ''
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '位置情報の許可が拒否されました'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置情報が取得できません'
            break
          case error.TIMEOUT:
            errorMessage = 'タイムアウトしました'
            break
          default:
            errorMessage = 'エラーが発生しました'
        }
        setError(errorMessage)
        setStatus(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [locationData])

  // 初回自動取得
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLocation()
    }, 500)

    return () => clearTimeout(timer)
  }, [fetchLocation])

  return {
    status,
    location,
    isOnline,
    error,
    refetch: fetchLocation
  }
}
