import type { BuildingMarker, CityHeatDatum } from '../types'
import { module1Overview } from '../data/overview'
import countyNarrativesJson from '../data/county-narratives.json'
import panelImagesJson from '../data/panel-images.json'
import styles from './BuildingInfoPanel.module.css'
import { parseBoldEmphasis } from './richText'

const countyNarratives = countyNarrativesJson as Record<
  string,
  { metaLine: string; tagline: string; body: string }
>

const panelImages = panelImagesJson as {
  overview: {
    hero: string
    paragraphImages: string[]
    hintStrip: string
  }
  county: Record<string, string>
}

const DETAIL_META_LABELS = ['地区', '类型', '年代'] as const

function buildingPanelPhoto(id: string) {
  return `/module1/panel/building-${id}.jpg`
}

function splitFullWidthBar(s: string) {
  return s
    .split('｜')
    .map((x) => x.trim())
    .filter(Boolean)
}

function CountyMetaLine({ line }: { line: string }) {
  const parts = splitFullWidthBar(line)
  return (
    <div className={styles.metaRow}>
      {parts.map((p, i) => (
        <span key={i} className={i === 0 ? styles.metaChipStat : styles.metaChip}>
          {parseBoldEmphasis(p, styles.emphasis)}
        </span>
      ))}
    </div>
  )
}

function BuildingDetailMeta({ meta }: { meta: string }) {
  const parts = splitFullWidthBar(meta)
  return (
    <div className={styles.detailMetaRow}>
      {parts.map((p, i) => (
        <div key={i} className={styles.detailMetaItem}>
          <span className={styles.detailMetaLabel}>
            {DETAIL_META_LABELS[i] ?? '·'}
          </span>
          <span className={styles.detailMetaValue}>
            {parseBoldEmphasis(p, styles.emphasis)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function BuildingInfoPanel(props: {
  city?: CityHeatDatum
  building?: BuildingMarker
}) {
  const { city, building } = props

  if (building) {
    const meta = building.detailMeta ?? [
      city?.cityName ?? building.cityId,
      building.type ?? '—',
      building.dynasty ?? '—',
    ].join('｜')
    const body = building.detailBody ?? building.summary
    const photo = buildingPanelPhoto(building.id)

    return (
      <div className={styles.panelRoot}>
        <div className={styles.buildingHero}>
          <img
            src={photo}
            alt={building.name}
            className={styles.buildingHeroImg}
            loading="lazy"
            decoding="async"
          />
        </div>

        <h2 className={styles.title}>{building.name}</h2>
        <BuildingDetailMeta meta={meta} />
        <div className={styles.body}>
          {parseBoldEmphasis(body, styles.emphasis)}
        </div>

        {building.tags?.length ? (
          <div className={styles.tagRow}>
            {building.tags.slice(0, 6).map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  if (city) {
    const n = countyNarratives[city.cityId]
    const countyImg = panelImages.county[city.cityId] ?? panelImages.overview.hero

    return (
      <div className={styles.panelRoot}>
        <div className={styles.countyHero}>
          <img
            src={countyImg}
            alt={city.cityName}
            className={styles.countyHeroImg}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.countyHeroFade} />
          <div className={styles.countyHeroTitle}>{city.cityName}</div>
        </div>

        {n ? (
          <>
            <CountyMetaLine line={n.metaLine} />
            <div className={styles.tagline}>
              {parseBoldEmphasis(n.tagline, styles.emphasis)}
            </div>
            <div className={styles.body}>
              {parseBoldEmphasis(n.body, styles.emphasis)}
            </div>
          </>
        ) : (
          <div className={styles.fallbackBody}>
            {parseBoldEmphasis(
              `${city.province} · 截止1911 县域古建筑总量 **${city.totalBefore1911}** 处。本地详细释文待补。`,
              styles.emphasis
            )}
          </div>
        )}

        <div className={`${styles.hint} ${styles.hintStrong}`}>
          <div className={styles.hintMediaRow}>
            <img
              src={countyImg}
              alt=""
              className={styles.hintThumb}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.hintMediaText}>
              {parseBoldEmphasis(module1Overview.mapHint, styles.emphasis)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const [img1, img2] = panelImages.overview.paragraphImages

  return (
    <div className={styles.panelRoot}>
      <div className={styles.heroWide}>
        <img
          src={panelImages.overview.hero}
          alt="皖南徽派村落"
          className={styles.heroWideImg}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.heroWideFade} />
      </div>

      <h2 className={styles.title}>{module1Overview.title}</h2>

      <div className={styles.prosePairs}>
        <div className={styles.copyPair}>
          <figure className={styles.copyPairFig}>
            <img src={img1} alt="" loading="lazy" decoding="async" />
          </figure>
          <p className={styles.copyPairText}>
            {parseBoldEmphasis(module1Overview.paragraphs[0], styles.emphasis)}
          </p>
        </div>
        <div className={styles.copyPair}>
          <figure className={styles.copyPairFig}>
            <img src={img2} alt="" loading="lazy" decoding="async" />
          </figure>
          <p className={styles.copyPairText}>
            {parseBoldEmphasis(module1Overview.paragraphs[1], styles.emphasis)}
          </p>
        </div>
      </div>

      <div className={styles.hint}>
        <div className={styles.hintTitle}>怎样浏览</div>
        <div className={styles.hintMediaRow}>
          <img
            src={panelImages.overview.hintStrip}
            alt=""
            className={styles.hintThumb}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.hintMediaText}>
            <div>{parseBoldEmphasis(module1Overview.mapHint, styles.emphasis)}</div>
            <div className={styles.hintBlockGap}>
              {parseBoldEmphasis(module1Overview.countyHint, styles.emphasis)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
