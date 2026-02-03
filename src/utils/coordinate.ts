/**
 * 度分秒（DMS）形式への変換
 */
export function convertToDMS(decimal: number, isLatitude: boolean): string {
  const absolute = Math.abs(decimal)
  const degrees = Math.floor(absolute)
  const minutesDecimal = (absolute - degrees) * 60
  const minutes = Math.floor(minutesDecimal)
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(2)

  let direction: string
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S'
  } else {
    direction = decimal >= 0 ? 'E' : 'W'
  }

  return `${degrees}°${minutes}'${seconds}" ${direction}`
}

/**
 * Maidenhead Grid Locator (グリッドロケーター) の計算
 */
export function calculateGridLocator(lat: number, lon: number): string {
  // 経度を0-360の範囲に変換
  let adjustedLon = lon + 180
  // 緯度を0-180の範囲に変換
  let adjustedLat = lat + 90

  // Field (A-R)
  const fieldLon = String.fromCharCode(65 + Math.floor(adjustedLon / 20))
  const fieldLat = String.fromCharCode(65 + Math.floor(adjustedLat / 10))

  // Square (0-9)
  adjustedLon = adjustedLon % 20
  adjustedLat = adjustedLat % 10
  const squareLon = Math.floor(adjustedLon / 2)
  const squareLat = Math.floor(adjustedLat / 1)

  // Subsquare (a-x)
  adjustedLon = (adjustedLon % 2) * 60
  adjustedLat = (adjustedLat % 1) * 60
  const subsquareLon = String.fromCharCode(97 + Math.floor(adjustedLon / 5))
  const subsquareLat = String.fromCharCode(97 + Math.floor(adjustedLat / 2.5))

  return `${fieldLon}${fieldLat}${squareLon}${squareLat}${subsquareLon}${subsquareLat}`
}
