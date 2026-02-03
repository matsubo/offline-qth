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
}

export interface GeocodingResult {
  prefecture: string
  city: string
  fullAddress?: string
}
