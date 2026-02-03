import { RefreshCw, MapPin, Github } from 'lucide-react'
import { useLocationData } from './hooks/useLocationData'
import { useGeolocation } from './hooks/useGeolocation'
import { cn } from './lib/utils'

function App() {
  const locationData = useLocationData()
  const { status, location, isOnline, refetch } = useGeolocation(locationData)

  return (
    <div className="min-h-screen p-5 md:p-10">
      <div className="mx-auto max-w-2xl">
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2">
            <MapPin className="w-8 h-8" />
            オフラインQTH
          </h1>
          <p className="text-lg md:text-xl opacity-90">JCC/JCG検索ツール</p>
        </header>

        <main className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center text-gray-700 text-lg mb-4">{status}</div>
          </div>

          <button
            onClick={refetch}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            再取得
          </button>

          {location && (
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
              <ResultItem label="緯度" value={location.latitude} />
              <ResultItem label="経度" value={location.longitude} />
              <ResultItem label="標高" value={location.elevation} />
              <ResultItem label="都道府県" value={location.prefecture} />
              <ResultItem label="市区町村" value={location.city} />
              <ResultItem label="グリッドロケーター" value={location.gridLocator} highlight />
              <ResultItem label="JCC" value={location.jcc} highlight />
              <ResultItem label="JCG" value={location.jcg} highlight />
            </div>
          )}

          <div className="bg-white/95 rounded-xl p-6 shadow-lg">
            <p className="font-bold mb-3">使い方:</p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
              <li>ページを開くと自動的に位置情報を取得</li>
              <li>位置情報の許可を求められたら「許可」を選択</li>
              <li>オフラインでも動作します（初回はオンライン必須）</li>
            </ul>
          </div>
        </main>

        <footer className="mt-8 text-center text-white space-y-3">
          <p className="flex items-center justify-center gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm",
              isOnline ? "bg-green-500/30" : "bg-orange-500/30"
            )}>
              {isOnline ? 'オンライン' : 'オフライン'}
            </span>
          </p>
          <p className="text-sm">
            v2.0.0 | Created by{' '}
            <a
              href="https://x.com/je1wfv"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              JE1WFV
            </a>
          </p>
          <p className="text-sm flex items-center justify-center gap-3">
            <a
              href="https://github.com/matsubo/offline-qth"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

interface ResultItemProps {
  label: string
  value: string
  highlight?: boolean
}

function ResultItem({ label, value, highlight }: ResultItemProps) {
  return (
    <div className={cn(
      "flex justify-between items-center py-3 border-b last:border-0",
      highlight && "bg-blue-50 -mx-6 px-6 py-4"
    )}>
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className={cn(
        "font-medium",
        highlight ? "text-orange-600 text-lg" : "text-blue-600"
      )}>
        {value}
      </span>
    </div>
  )
}

export default App
