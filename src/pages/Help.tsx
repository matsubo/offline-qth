import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function Help() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-10 relative z-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono-data text-teal-400 hover:text-amber-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wider">
              {t("help.backToHome")}
            </span>
          </Link>
          <div className="card-technical rounded-none border-l-4 border-l-amber-500 p-6 corner-accent">
            <div className="text-xs font-mono-data glow-teal mb-2 tracking-wider">
              DOCUMENTATION
            </div>
            <h1 className="text-4xl md:text-5xl font-display glow-amber">
              {t("help.title")}
            </h1>
          </div>
        </header>

        <main className="space-y-6">
          {/* Section 1: オフラインの仕組み */}
          <section className="card-technical rounded-none border-l-4 border-l-green-500 p-6 corner-accent">
            <h2 className="text-2xl font-display glow-green mb-4 flex items-center gap-3">
              <span className="text-3xl">📱</span>
              {t("help.offline.title")}
            </h2>
            <div className="space-y-4 text-teal-100/90 font-body leading-relaxed">
              <p>{t("help.offline.pwa")}</p>
              <div className="data-panel rounded p-4 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">▹</span>
                  <span>{t("help.offline.cache")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">▹</span>
                  <span>{t("help.offline.data")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">▹</span>
                  <span>{t("help.offline.gps")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: 位置情報の精度 */}
          <section className="card-technical rounded-none border-l-4 border-l-teal-500 p-6 corner-accent">
            <h2 className="text-2xl font-display glow-teal mb-4 flex items-center gap-3">
              <span className="text-3xl">📍</span>
              {t("help.accuracy.title")}
            </h2>
            <div className="space-y-4 text-teal-100/90 font-body leading-relaxed">
              <p>{t("help.accuracy.gpsLimits")}</p>
              <div className="data-panel rounded p-4 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>{t("help.accuracy.obstacles")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>{t("help.accuracy.agps")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>{t("help.accuracy.estimation")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: データの精度 */}
          <section className="card-technical rounded-none border-l-4 border-l-amber-500 p-6 corner-accent">
            <h2 className="text-2xl font-display glow-amber mb-4 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              {t("help.data.title")}
            </h2>
            <div className="space-y-5 text-teal-100/90 font-body leading-relaxed">
              <div className="data-panel rounded border-l-4 border-l-blue-400 p-4">
                <p className="font-bold text-blue-300">
                  🗾 {t("help.data.region")}
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg mb-2 text-teal-300 tracking-wide">
                  JCC/JCG
                </h3>
                <p className="text-sm">{t("help.data.jccJcg")}</p>
              </div>
              <div>
                <h3 className="font-display text-lg mb-2 text-teal-300 tracking-wide">
                  {t("label.elevation")}
                </h3>
                <p className="text-sm">{t("help.data.elevation")}</p>
              </div>
              <div>
                <h3 className="font-display text-lg mb-2 text-teal-300 tracking-wide">
                  {t("help.data.addressTitle")}
                </h3>
                <p className="text-sm">{t("help.data.address")}</p>
              </div>
            </div>
          </section>

          {/* Section 4: トラブルシューティング */}
          <section className="card-technical rounded-none border-l-4 border-l-red-500 p-6 corner-accent">
            <h2 className="text-2xl font-display text-red-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">🔧</span>
              {t("help.troubleshooting.title")}
            </h2>
            <div className="space-y-5 text-teal-100/90 font-body leading-relaxed">
              <div className="data-panel rounded p-4">
                <h3 className="font-display text-base mb-2 text-red-300 tracking-wide">
                  ❌ {t("help.troubleshooting.noLocationTitle")}
                </h3>
                <p className="text-sm">
                  {t("help.troubleshooting.noLocation")}
                </p>
              </div>
              <div className="data-panel rounded p-4">
                <h3 className="font-display text-base mb-2 text-yellow-300 tracking-wide">
                  ⏱️ {t("help.troubleshooting.slowTitle")}
                </h3>
                <p className="text-sm">{t("help.troubleshooting.slow")}</p>
              </div>
              <div className="data-panel rounded p-4">
                <h3 className="font-display text-base mb-2 text-orange-300 tracking-wide">
                  ⚠️ {t("help.troubleshooting.wrongDataTitle")}
                </h3>
                <p className="text-sm">{t("help.troubleshooting.wrongData")}</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-10 text-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded text-slate-900 font-display text-base tracking-wider transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("help.backToHome")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
