import { useMemo, useState } from 'react'
import type {
  HeritageRiverDataFile,
  HeritageRiverSite,
  HeritageTypeCategory,
} from '../types'
import dataJson from '../data/flagship-heritage-river.json'
import { TYPE_COLOR } from '../theme/module1VisualPalette'
import styles from './HeritageRiverTimeline.module.css'

const file = dataJson as HeritageRiverDataFile

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t))
}

function yearT(year: number, minY: number, maxY: number) {
  if (maxY <= minY) return 0
  return clamp01((year - minY) / (maxY - minY))
}

const YEAR_TICKS = [400, 700, 1000, 1300, 1600, 1900]

function AxisFooter(props: { minY: number; maxY: number }) {
  const { minY, maxY } = props
  return (
    <div className={styles.axisFooter}>
      <div className={styles.axisRow}>
        <div className={styles.axisSpacer} />
        <div className={styles.dynRuler} aria-hidden>
          <div className={styles.dynRulerInner}>
            {file.dynastyBands.map((b, i) => {
              const t0 = yearT(b.startYear, minY, maxY)
              const t1 = yearT(b.endYear, minY, maxY)
              const w = Math.max(0, t1 - t0) * 100
              if (w < 0.15) return null
              return (
                <div
                  key={b.id}
                  className={`${styles.dynRulerSeg} ${
                    i % 2 ? styles.dynRulerSegAlt : ''
                  }`}
                  style={{
                    left: `${t0 * 100}%`,
                    width: `${w}%`,
                  }}
                  title={b.label}
                >
                  <span className={styles.dynRulerLab}>{b.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className={styles.axisRow}>
        <div className={styles.axisSpacer} />
        <div className={styles.yearRuler}>
          {YEAR_TICKS.filter((y) => y >= minY && y <= maxY).map((y) => {
            const t = yearT(y, minY, maxY)
            return (
              <span
                key={y}
                className={styles.yearTick}
                style={{
                  left: `calc(8px + (100% - 16px) * ${t})`,
                }}
              >
                {y}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function HeritageRiverTimeline() {
  const [q, setQ] = useState('')
  const [activeId, setActiveId] = useState<string | undefined>(undefined)

  const [minY, maxY] = file.timeRange

  const sites = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return file.sites
    return file.sites.filter(
      (x) =>
        x.name.toLowerCase().includes(s) ||
        x.region.toLowerCase().includes(s),
    )
  }, [q])

  const actionMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const a of file.actionLegend) m.set(a.id, a.color)
    return m
  }, [])

  return (
    <div className={styles.wrap} aria-label="徽派代表作编年时间轴">
      <header className={styles.head}>
        <div className={styles.brand}>
          <span className={styles.brandMain}>徽韵遗产志</span>
          <span className={styles.brandSub}>代表作编年</span>
        </div>
        <input
          className={styles.search}
          type="search"
          placeholder="搜索遗址、区县…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="筛选代表作"
        />
        <div className={styles.legendBlock} aria-label="图例">
          <div className={styles.legendGroup}>
            <span className={styles.legendGroupTitle}>遗存类型</span>
            <div className={styles.legendScroll}>
              {(Object.keys(TYPE_COLOR) as HeritageTypeCategory[]).map((k) => (
                <span key={k} className={styles.legendItem}>
                  <span
                    className={styles.legendLine}
                    style={{ background: TYPE_COLOR[k] }}
                  />
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.legendGroup}>
            <span className={styles.legendGroupTitle}>沿革节点</span>
            <div className={styles.legendScroll}>
              {file.actionLegend.map((a) => (
                <span key={a.id} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ background: a.color }}
                  />
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.chartScroll}>
          {sites.map((site: HeritageRiverSite) => {
            const isActive = activeId === site.id
            return (
              <div key={site.id} className={styles.gridRow}>
                <button
                  type="button"
                  className={styles.rowLabel}
                  title={`${site.name}（${site.region}）`}
                  onClick={() =>
                    setActiveId((id) => (id === site.id ? undefined : site.id))
                  }
                >
                  <span className={styles.rowLine}>
                    <span className={styles.rowName}>{site.name}</span>
                    <span className={styles.rowDot} aria-hidden>
                      ·
                    </span>
                    <span className={styles.rowMeta}>{site.region}</span>
                  </span>
                </button>
                <div
                  className={`${styles.trackPane} ${
                    isActive ? styles.trackPaneActive : ''
                  }`}
                >
                  <div className={styles.rail} />
                  {file.dynastyBands.map((b, i) => {
                    const t0 = yearT(b.startYear, minY, maxY)
                    const t1 = yearT(b.endYear, minY, maxY)
                    return (
                      <span
                        key={`${site.id}-bg-${b.id}`}
                        className={`${styles.dynShade} ${
                          i % 2 ? styles.dynShadeAlt : ''
                        }`}
                        style={{
                          left: `${t0 * 100}%`,
                          width: `${(t1 - t0) * 100}%`,
                        }}
                      />
                    )
                  })}
                  {site.segments.map((seg, idx) => {
                    const t0 = yearT(seg.startYear, minY, maxY)
                    const t1 = yearT(seg.endYear, minY, maxY)
                    const title = `${seg.dynasty} · ${seg.typeCategory} · ${seg.startYear}–${seg.endYear}`
                    return (
                      <span
                        key={`${site.id}-seg-${idx}`}
                        className={styles.segment}
                        title={title}
                        style={{
                          left: `calc(8px + (100% - 16px) * ${t0})`,
                          width: `calc((100% - 16px) * ${t1 - t0})`,
                          background: TYPE_COLOR[seg.typeCategory],
                        }}
                      />
                    )
                  })}
                  {site.events.map((ev, idx) => {
                    const t = yearT(ev.year, minY, maxY)
                    return (
                      <span
                        key={`${site.id}-ev-${idx}`}
                        className={styles.ev}
                        title={`${ev.year} · ${ev.label}`}
                        style={{
                          left: `calc(8px + (100% - 16px) * ${t})`,
                          background: actionMap.get(ev.action) ?? '#254e7a',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}

          <details className={styles.footnote}>
            <summary>数据与口径说明</summary>
            横条为遗存类型着色区段；圆点为文献节点。年份取常见记载或段落中值，与文保名录断代不完全一致处仅供展示。
          </details>
        </div>

        <AxisFooter minY={minY} maxY={maxY} />
      </div>
    </div>
  )
}
