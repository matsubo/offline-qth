import type { LocationData, Location, GeocodingResult } from '../types/location'
import { haversineDistance } from './coordinate'

/**
 * 国土地理院APIで標高を取得
 */
export async function getElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const url = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lon}&lat=${lat}&outtype=JSON`
    const response = await fetch(url)
    const data = await response.json()

    if (data.elevation !== undefined && data.elevation !== null) {
      return Math.round(data.elevation)
    }
  } catch {
    // Silently fail - elevation is optional
  }
  return null
}

/**
 * 逆ジオコーディング（OpenStreetMap Nominatim）
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ja`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OfflineQTH/2.0'
      }
    })
    const data = await response.json()

    if (data.address) {
      const addr = data.address
      const prefecture = addr.state || addr.province || ''
      const city = addr.city || addr.town || addr.village || addr.municipality || ''
      const cityDistrict = addr.city_district || ''

      return {
        prefecture,
        city,
        cityDistrict,
        fullAddress: data.display_name
      }
    }
  } catch {
    // Silently fail - geocoding is optional
  }
  return null
}

/**
 * JCC/JCGデータのロード
 */
export async function loadLocationData(): Promise<LocationData | null> {
  try {
    const basePath = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${basePath}data/location-data.json`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load location data:', error)
    return null
  }
}

/**
 * 位置情報から都道府県・市区町村・JCC/JCGを判定
 */
export function findLocationInfo(
  lat: number,
  lon: number,
  locationData: LocationData | null
): { prefecture: string; city: string; jcc: string; jcg: string } {
  if (!locationData || !locationData.locations) {
    return {
      prefecture: 'location.unknown',
      city: 'location.unknown',
      jcc: 'location.unknown',
      jcg: 'location.unknown'
    }
  }

  // 最も近い地点を探す（Haversine距離を使用）
  let minDistance = Infinity
  let closestLocation: Location | null = null

  for (const location of locationData.locations) {
    // 球面距離（メートル）を計算
    const distance = haversineDistance(lat, lon, location.lat, location.lon)

    if (distance < minDistance) {
      minDistance = distance
      closestLocation = location
    }
  }

  if (closestLocation) {
    return {
      prefecture: closestLocation.prefecture,
      city: closestLocation.city,
      jcc: closestLocation.jcc,
      jcg: closestLocation.jcg
    }
  }

  return {
    prefecture: 'location.unknown',
    city: 'location.unknown',
    jcc: 'location.unknown',
    jcg: 'location.unknown'
  }
}

/**
 * 市区町村名からJCC/JCGを検索
 */
export function findJccJcgByCity(
  city: string,
  locationData: LocationData | null
): { jcc: string; jcg: string } {
  if (!locationData || !locationData.locations) {
    return {
      jcc: 'location.unknown',
      jcg: 'location.unknown'
    }
  }

  // 市区町村名で完全一致検索
  const location = locationData.locations.find(loc => loc.city === city)

  if (location) {
    return {
      jcc: location.jcc,
      jcg: location.jcg
    }
  }

  return {
    jcc: 'location.unknown',
    jcg: 'location.unknown'
  }
}
