import { useMemo, useState, useRef } from 'react'
import type {
  HeritageRiverDataFile,
  HeritageRiverSite,
  HeritageRiverActionId,
  HeritageTypeCategory,
} from '../types'
import dataJson from '../data/flagship-heritage-river.json'
import { TYPE_COLOR } from '../theme/module1VisualPalette'
import { HeritageActionGlyph } from './HeritageActionGlyph'
import styles from './HeritageRiverTimeline.module.css'

const file = dataJson as HeritageRiverDataFile

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t))
}

function yearT(year: number, minY: number, maxY: number) {
  if (maxY <= minY) return 0
  return clamp01((year - minY) / (maxY - minY))
}

const YEAR_TICKS = [600, 900, 1200, 1500, 1800, 1900]

const TYPE_CATEGORIES: HeritageTypeCategory[] = [
  '民居',
  '祠堂',
  '牌坊',
  '桥梁',
  '综合用途/建筑群',
  '其他',
]

const EVENT_LEGEND_SEMANTICS: Array<{
  id: 'formation' | 'construction' | 'destruction' | 'repair' | 'protection'
  label: string
  action: HeritageRiverActionId
}> = [
  { id: 'formation', label: '初建/形成', action: 'settle' },
  { id: 'construction', label: '建设/扩建/格局定型', action: 'waterworks' },
  { id: 'destruction', label: '损毁/战乱', action: 'warfare' },
  { id: 'repair', label: '修复/整治', action: 'repair' },
  { id: 'protection', label: '保护/认定', action: 'edict' },
]

const ACTION_LABEL_MAP: Record<string, string> = {}
for (const a of file.actionLegend) ACTION_LABEL_MAP[a.id] = a.label
const ACTION_COLOR_MAP: Record<string, string> = {}
for (const a of file.actionLegend) ACTION_COLOR_MAP[a.id] = a.color

interface TooltipState {
  visible: boolean
  left: number
  top: number
  year: number
  action: string
  actionColor: string
  label: string
  siteName: string
  region: string
}

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
                  style={{ left: `${t0 * 100}%`, width: `${w}%` }}
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
                style={{ left: `calc(8px + (100% - 16px) * ${t})` }}
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
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    left: 0,
    top: 0,
    year: 0,
    action: '',
    actionColor: '',
    label: '',
    siteName: '',
    region: '',
  })
  const wrapRef = useRef<HTMLDivElement>(null)

  const [minY, maxY] = file.timeRange

  const sites = useMemo(() => {
    const s = q.trim().toLowerCase()
    const base = !s
      ? file.sites
      : file.sites.filter(
          (x) =>
            x.name.toLowerCase().includes(s) ||
            x.region.toLowerCase().includes(s),
        )

    // “祠堂类别”从时间轴整体移除：包含祠堂阶段的对象行不再渲染
    return base.filter(
      (x) => !x.segments.some((seg) => seg.typeCategory === '祠堂'),
    )
  }, [q])

  const actionMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const a of file.actionLegend) m.set(a.id, a.color)
    return m
  }, [])

  function showTooltip(
    e: React.MouseEvent,
    ev: { year: number; action: string; label: string },
    site: { name: string; region: string },
  ) {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return

    // 估算 tooltip 尺寸后做边界约束，避免贴边时被 `.wrap { overflow: hidden }` 裁掉
    const tooltipW = 260
    const tooltipH = 122
    const margin = 8

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const desiredLeft = x + 14
    const desiredTop = y - 10

    const maxLeft = Math.max(margin, rect.width - tooltipW - margin)
    const maxTop = Math.max(margin, rect.height - tooltipH - margin)

    const left = Math.min(Math.max(margin, desiredLeft), maxLeft)
    const top = Math.min(Math.max(margin, desiredTop), maxTop)
    setTooltip({
      visible: true,
      left,
      top,
      year: ev.year,
      action: ACTION_LABEL_MAP[ev.action] ?? ev.action,
      actionColor: ACTION_COLOR_MAP[ev.action] ?? '#254e7a',
      label: ev.label,
      siteName: site.name,
      region: site.region,
    })
  }

  function hideTooltip() {
    setTooltip((t) => ({ ...t, visible: false }))
  }

  function moveTooltip(e: React.MouseEvent) {
    if (!tooltip.visible) return
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return

    const tooltipW = 260
    const tooltipH = 122
    const margin = 8

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const desiredLeft = x + 14
    const desiredTop = y - 10

    const maxLeft = Math.max(margin, rect.width - tooltipW - margin)
    const maxTop = Math.max(margin, rect.height - tooltipH - margin)

    const left = Math.min(Math.max(margin, desiredLeft), maxLeft)
    const top = Math.min(Math.max(margin, desiredTop), maxTop)
    setTooltip((t) => ({
      ...t,
      left,
      top,
    }))
  }

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      aria-label="徽派代表作编年时间轴"
      style={{ position: 'relative' }}
      onMouseMove={moveTooltip}
    >
      {/* ── 自定义悬浮提示框 ── */}
      {tooltip.visible && (
        <div
          className={styles.evTooltip}
          style={{ left: tooltip.left, top: tooltip.top }}
          aria-hidden
        >
          <div className={styles.evTooltipYear}>{tooltip.year} 年</div>
          <div className={styles.evTooltipAction}>
            <span
              className={styles.evTooltipDot}
              style={{ background: tooltip.actionColor }}
            />
            {tooltip.action}
          </div>
          <div className={styles.evTooltipLabel}>{tooltip.label}</div>
          <div className={styles.evTooltipSite}>
            {tooltip.siteName}
            <span className={styles.evTooltipRegion}>{tooltip.region}</span>
          </div>
        </div>
      )}

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
              {TYPE_CATEGORIES.filter((k) => k !== '祠堂')
                .map((k) => (
                  <span key={k} className={styles.legendItem}>
                    <span
                      className={styles.legendLine}
                      aria-hidden
                      style={{
                        background: TYPE_COLOR[k],
                        opacity: 0.7,
                      }}
                    />
                    {k}
                  </span>
                ))}
            </div>
          </div>
          <div className={styles.legendGroup}>
            <span className={styles.legendGroupTitle}>沿革事件</span>
            <div className={styles.legendScroll}>
              {EVENT_LEGEND_SEMANTICS.map((s) => {
                const c = actionMap.get(s.action) ?? '#6F8E89'
                return (
                  <span key={s.id} className={styles.legendItem}>
                    <span className={styles.legendGlyph}>
                      <HeritageActionGlyph action={s.action} color={c} size={13} />
                    </span>
                    {s.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.chartScroll}>
          {sites.map((site: HeritageRiverSite) => {
            const isActive = activeId === site.id
            const visibleSegments = site.segments.filter(
              (s) => s.typeCategory !== '祠堂',
            )
            const rowStart = visibleSegments.length
              ? Math.min(...visibleSegments.map((s) => s.startYear))
              : minY
            const rowEnd = visibleSegments.length
              ? Math.max(...visibleSegments.map((s) => s.endYear))
              : minY
            const rowT0 = yearT(rowStart, minY, maxY)
            const rowT1 = yearT(rowEnd, minY, maxY)
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
                    <span className={styles.rowDot} aria-hidden>·</span>
                    <span className={styles.rowMeta}>{site.region}</span>
                  </span>
                </button>
                <div
                  className={`${styles.trackPane} ${
                    isActive ? styles.trackPaneActive : ''
                  }`}
                >
                  {rowT1 > rowT0 && (
                    <span
                      className={styles.rail}
                      style={{
                        left: `calc(8px + (100% - 16px) * ${rowT0})`,
                        width: `calc((100% - 16px) * ${rowT1 - rowT0})`,
                      }}
                      aria-hidden
                    />
                  )}
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
                    if (seg.typeCategory === '祠堂') return null
                    const t0 = yearT(seg.startYear, minY, maxY)
                    const t1 = yearT(seg.endYear, minY, maxY)
                    return (
                      <span
                        key={`${site.id}-seg-${idx}`}
                        className={styles.segment}
                        style={{
                          left: `calc(8px + (100% - 16px) * ${t0})`,
                          width: `calc((100% - 16px) * ${t1 - t0})`,
                          background: TYPE_COLOR[seg.typeCategory],
                          opacity: 0.38,
                        }}
                      />
                    )
                  })}
                  {site.events
                    .filter((ev) =>
                      visibleSegments.some(
                        (s) => ev.year >= s.startYear && ev.year <= s.endYear,
                      ),
                    )
                    .map((ev, idx) => {
                      const t = yearT(ev.year, minY, maxY)
                      const c = actionMap.get(ev.action) ?? '#254e7a'
                      return (
                        <span
                          key={`${site.id}-ev-${idx}`}
                          className={styles.ev}
                          style={{
                            left: `calc(8px + (100% - 16px) * ${t})`,
                            // 所有事件都贴到主线的上方（不再分上/下通道）
                            // 事件外层容器尺寸会在 CSS 中缩小；这里让“可见图形底部”贴近 rail
                            ['--ev-offsetY' as any]: '-6.5px',
                          }}
                          onMouseEnter={(e) => showTooltip(e, ev, site)}
                          onMouseLeave={hideTooltip}
                        >
                          <HeritageActionGlyph
                            action={ev.action}
                            color={c}
                            size={10}
                          />
                        </span>
                      )
                    })}
                </div>
              </div>
            )
          })}

          <details className={styles.footnote}>
            <summary>数据与口径说明</summary>
            本模块为可视化展示：颜色与节点用于表达归类与沿革关系，年份取常见记载或段落中值，仅供参考。
          </details>
        </div>

        <AxisFooter minY={minY} maxY={maxY} />
      </div>
    </div>
  )
}
