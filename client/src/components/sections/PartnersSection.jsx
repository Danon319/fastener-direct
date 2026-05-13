import { partners, GRID_MIN_CARD, GRID_GAP, GRID_MAX_WIDTH } from '@/content/partners'

/**
 * Карточка партнёра с hover-эффектом через Tailwind group-hover.
 * Использует container queries (cqw) для fluid-типографики внутри карточки.
 */
function PartnerCard({ partner }) {
  const { name, spec, category, city, year, url, logo, photo } = partner

  return (
    <a
      href={url || '#'}
      onClick={(e) => {
        if (!url) e.preventDefault()
      }}
      className="group block overflow-hidden rounded-3xl bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-all duration-300 @container hover:bg-slateHover hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:aspect-[440/290] lg:p-6"
    >
      <div
        className="grid h-full gap-3 lg:gap-4"
        style={{ gridTemplateColumns: '1fr clamp(140px, 40%, 175px)' }}
      >
        {/* Left: text + tags */}
        <div className="flex min-w-0 flex-col justify-between overflow-hidden">
          <div className="min-w-0 overflow-hidden">
            <h4 className="truncate text-[clamp(1.05rem,4.8cqw,1.35rem)] font-medium leading-tight tracking-wide text-slate transition-colors duration-300 group-hover:text-white">
              {name}
            </h4>
            <p className="mt-1.5 line-clamp-3 text-[clamp(0.6875rem,3.19cqw,0.88rem)] leading-relaxed text-muted transition-colors duration-300 group-hover:text-white">
              {spec}
            </p>
          </div>

          <div className="mt-2 flex flex-col flex-wrap items-start gap-1">
            <span className="rounded-md bg-tagDate px-3 py-1.5 text-[clamp(10.8px,2.88cqw,12.6px)] font-medium text-navy transition-colors duration-300 group-hover:bg-white/90">
              {year}
            </span>
            <span className="rounded-md bg-red px-3 py-1.5 text-[clamp(10.8px,2.88cqw,12.6px)] font-medium text-white">
              {category}
            </span>
            <span className="rounded-md bg-navy px-3 py-1.5 text-[clamp(10.8px,2.88cqw,12.6px)] font-medium text-white">
              {city}
            </span>
          </div>
        </div>

        {/* Right: photo + logo placeholders */}
        <div className="flex min-w-0 flex-col gap-px overflow-hidden">
          <div className="flex-1 overflow-hidden rounded-lg">
            <img src={photo} alt={name} className="h-full w-full object-cover" />
          </div>
          <div
            className="flex items-center justify-center overflow-hidden rounded-lg bg-white"
            style={{ flex: '0 0 clamp(38px, 19%, 54px)' }}
          >
            <img
              src={logo}
              alt={`${name} logo`}
              className="max-h-full max-w-[70%] object-contain"
            />
          </div>
        </div>
      </div>
    </a>
  )
}

/**
 * Секция партнёров — адаптивная сетка карточек с container-query типографикой.
 */
export default function PartnersSection() {
  return (
    <section className="bg-tagDate px-4 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto" style={{ maxWidth: GRID_MAX_WIDTH }}>
        <div
          className="grid justify-center"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${GRID_MIN_CARD}px), 1fr))`,
            gap: GRID_GAP,
          }}
        >
          {partners.map((p, i) => (
            <PartnerCard key={i} partner={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
