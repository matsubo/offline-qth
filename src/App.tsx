import { RefreshCw, Github, Languages, HelpCircle, BookOpen, MessageCircle, Coffee, Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLocationData } from './hooks/useLocationData'
import { useGeolocation } from './hooks/useGeolocation'
import { cn } from './lib/utils'
import { useState, useEffect } from 'react'
import { trackLanguageChange } from './utils/analytics'

function App() {
  const { t, i18n } = useTranslation()
  const locationData = useLocationData()
  const { status, location, isOnline, refetch } = useGeolocation(locationData)

  const [jccJcgCount, setJccJcgCount] = useState<number | null>(null)
  const [locationDataLastUpdate, setLocationDataLastUpdate] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await fetch('/offline-qth/data/location-data.json')
        const locationJson = await locationResponse.json()
        setJccJcgCount(locationJson.locations.length)
        setLocationDataLastUpdate(locationJson.lastUpdate)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  const toggleLanguage = () => {
    const currentLang = i18n.language
    const newLang = currentLang === 'ja' ? 'en' : 'ja'
    i18n.changeLanguage(newLang)

    // Track language change
    trackLanguageChange(currentLang, newLang)
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 relative z-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-4 animate-fade-in">
          <div className="card-technical rounded-none border-l-4 border-l-amber-500 p-3 corner-accent">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] font-mono-data glow-teal mb-0.5 tracking-wider">QTH-LOCATOR-v{__APP_VERSION__}</div>
                <h1 className="text-2xl md:text-3xl font-display glow-amber">
                  OFFLINE QTH
                </h1>
                <div className="text-[10px] font-mono text-teal-400/60 mt-0.5">GPS // CALL AREA // JCC/JCG // GRID LOCATOR</div>
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  to="/help"
                  className="p-2 rounded border border-teal-500/30 bg-black/30 hover:bg-teal-500/10 hover:border-teal-500/60 transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="p-2 rounded border border-teal-500/30 bg-black/30 hover:bg-teal-500/10 hover:border-teal-500/60 transition-all"
                  aria-label="Toggle language"
                >
                  <Languages className="w-4 h-4 text-teal-400" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          <div className="card-technical rounded p-4 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-400 status-indicator"></div>
              <div className="text-center font-mono-data text-sm tracking-wider text-teal-300">{t(status)}</div>
            </div>
          </div>

          <button
            onClick={refetch}
            className="w-full btn-primary text-slate-900 font-display text-lg py-4 px-8 rounded flex items-center justify-center gap-3 animate-fade-in"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="tracking-wide">{t('button.refetch')}</span>
          </button>

          {location && (
            <div className="card-technical rounded-none animate-fade-in overflow-hidden corner-accent">
              {/* GPS Coordinates Section */}
              <div className="border-b border-teal-500/20 bg-black/20">
                <div className="px-5 py-3 border-l-4 border-l-green-500">
                  <div className="text-[10px] font-mono-data glow-green tracking-wider mb-2">[ GPS COORDINATES ]</div>
                  <div className="grid grid-cols-2 gap-4">
                    <ResultItem label={t('label.latitude')} value={location.latitude} />
                    <ResultItem label={t('label.longitude')} value={location.longitude} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {location.accuracy && <ResultItem label={t('label.accuracy')} value={`±${Math.round(location.accuracy)}m`} />}
                    <ResultItem label={t('label.elevation')} value={t(location.elevation)} />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="border-b border-teal-500/20 data-panel">
                <div className="px-5 py-3 border-l-4 border-l-teal-500 relative z-10">
                  <div className="text-[10px] font-mono-data glow-teal tracking-wider mb-2">[ LOCATION DATA ]</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <ResultItem label={t('label.prefecture')} value={location.prefecture} />
                    <ResultItem label={t('label.city')} value={location.city} />
                  </div>
                </div>
              </div>

              {/* Amateur Radio Data Section */}
              <div className="px-5 py-4 border-l-4 border-l-amber-500">
                <div className="text-[10px] font-mono-data glow-amber tracking-wider mb-3">[ AMATEUR RADIO DATA ]</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ResultItem label={t('label.gridLocator')} value={location.gridLocator} highlight />
                  <ResultItem label={t('label.callArea')} value={location.callArea !== null ? `JA${location.callArea}` : '---'} highlight />
                  <ResultItem label={t('label.jcc')} value={location.jcc} highlight />
                  <ResultItem label={t('label.jcg')} value={location.jcg} highlight />
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-12 animate-fade-in">
          <div className="card-technical rounded-none border-l-4 border-l-teal-500/40 p-5">
            <div className="space-y-4">
              {/* Status Bar */}
              <div className="flex items-center justify-between border-b border-teal-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isOnline ? "bg-green-500 status-indicator" : "bg-orange-500"
                  )}></div>
                  <span className="font-mono-data text-xs tracking-wider text-teal-400/80">
                    {isOnline ? t('footer.online') : t('footer.offline')}
                  </span>
                </div>
                <div className="font-mono-data text-[10px] text-teal-500/60 tracking-wider">
                  SYS_v{__APP_VERSION__}
                </div>
              </div>

              {/* Creator Info */}
              <div className="text-center">
                <div className="text-[10px] font-mono-data text-teal-500/60 tracking-wider mb-1">SYSTEM OPERATOR</div>
                <div className="text-sm font-mono">
                  <span className="text-teal-400/60">{t('footer.createdBy')}</span>{' '}
                  <a
                    href="https://x.com/je1wfv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold glow-amber hover:text-amber-400 transition-colors"
                  >
                    JE1WFV
                  </a>
                </div>
              </div>

              {/* Links */}
              <div className="border-t border-teal-500/10 pt-4 space-y-3">
                {/* External Resources */}
                <div>
                  <div className="text-[9px] font-mono-data text-teal-500/50 tracking-wider mb-2 text-center">
                    EXTERNAL RESOURCES
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href="https://je1wfv.teraren.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-teal-500/60 hover:text-teal-400 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs font-mono-data">{t('footer.blog')}</span>
                    </a>
                    <div className="w-px h-4 bg-teal-500/20"></div>
                    <a
                      href="https://discord.gg/Fztt8jwr6A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-teal-500/60 hover:text-teal-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-mono-data">{t('footer.discord')}</span>
                    </a>
                    <div className="w-px h-4 bg-teal-500/20"></div>
                    <a
                      href="https://github.com/matsubo/offline-qth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-teal-500/60 hover:text-teal-400 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-xs font-mono-data">{t('footer.github')}</span>
                    </a>
                  </div>
                </div>

                {/* Support / Donation */}
                <div>
                  <div className="text-[9px] font-mono-data text-teal-500/50 tracking-wider mb-2 text-center">
                    SUPPORT
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href="https://buymeacoffee.com/matsubokkuri"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-400/80 hover:text-amber-300 transition-colors"
                    >
                      <Coffee className="w-4 h-4" />
                      <span className="text-xs font-mono-data">Buy Me a Coffee</span>
                    </a>
                    <div className="w-px h-4 bg-teal-500/20"></div>
                    <a
                      href="https://github.com/sponsors/matsubo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-400/80 hover:text-amber-300 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-mono-data">GitHub Sponsors</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Database Stats */}
              <div className="text-center border-t border-teal-500/10 pt-3">
                <div className="text-[9px] font-mono-data text-teal-500/50 tracking-wider">
                  {jccJcgCount && (
                    <span>DATABASE: {t('footer.jccJcgData', { count: jccJcgCount })}</span>
                  )}
                  {locationDataLastUpdate && (
                    <span> {'// '}{t('footer.lastUpdated', { date: locationDataLastUpdate })}</span>
                  )}
                </div>
              </div>

              {/* 73 Sign-off */}
              <div className="text-center border-t border-teal-500/10 pt-3">
                <div className="font-display text-sm glow-green tracking-wider">73 DE JE1WFV</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

interface ResultItemProps {
  label: string
  value: string | null
  highlight?: boolean
}

function ResultItem({ label, value, highlight }: ResultItemProps) {
  const displayValue = value || '---'

  if (highlight) {
    return (
      <div className="data-panel rounded p-3 text-center relative">
        <div className="text-[9px] font-mono-data text-teal-400/60 tracking-wider mb-1.5">{label}</div>
        <div className="font-mono-data text-2xl glow-amber tracking-wider">
          {displayValue}
        </div>
        {/* Corner accent for highlighted items */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/40"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/40"></div>
      </div>
    )
  }

  return (
    <div className="py-0.5">
      <div className="text-[10px] font-mono-data text-teal-500/60 tracking-wider mb-0.5">{label}</div>
      <div className="font-mono text-base text-teal-100 tracking-wide">
        {displayValue}
      </div>
    </div>
  )
}

export default App

