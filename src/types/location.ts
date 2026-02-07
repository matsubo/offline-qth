export interface LocationData {
  version: string
  lastUpdate: string
  locations: Location[]
}

export interface Location {
  lat: number
  lon: number
  prefecture: string
  city: string
  jcc: string
  jcg: string
}

export interface QTHInfo {
  latitude: string
  longitude: string
  latRaw: number
  lonRaw: number
  gridLocator: string
  elevation: string
  prefecture: string
  city: string
  jcc: string
  jcg: string
  callArea: number | null // 日本のコールエリア (0-8)
  accuracy: number | null // 位置情報の精度（メートル）
}

export interface GeocodingResult {
  prefecture: string
  city: string
  fullAddress?: string
}
