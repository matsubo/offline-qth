import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue with bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LocationMapProps {
  latitude: number
  longitude: number
  isOnline?: boolean
}

// Custom marker icon for current location
const createCurrentLocationIcon = () => {
  return L.divIcon({
    className: 'current-location-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: rgb(51, 204, 204);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(51, 204, 204, 0.6), 0 0 20px rgba(51, 204, 204, 0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

// Component to center map
function MapCenter({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([latitude, longitude], 13)
  }, [map, latitude, longitude])

  return null
}

export function LocationMap({ latitude, longitude, isOnline = true }: LocationMapProps) {
  return (
    <div className="card-technical rounded-none overflow-hidden corner-accent border-l-4 border-l-teal-500" style={{ height: '400px' }}>
      {!isOnline && (
        <div className="absolute top-2 left-2 z-[1000] bg-amber-500/90 text-black px-3 py-1 rounded text-xs font-mono-data">
          ⚠️ OFFLINE - Showing cached tiles only
        </div>
      )}
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />

        <MapCenter latitude={latitude} longitude={longitude} />

        {/* Current location marker */}
        <Marker position={[latitude, longitude]} icon={createCurrentLocationIcon()}>
          <Popup>
            <div className="font-mono-data text-xs">
              <div className="font-bold text-teal-600">Your Location</div>
              <div>{latitude.toFixed(6)}, {longitude.toFixed(6)}</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
