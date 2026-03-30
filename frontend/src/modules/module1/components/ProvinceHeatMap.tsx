import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import type { BuildingMarker, CityHeatDatum } from '../types'
import { HEAT_MAP_GRADIENT, MAP_GEO_THEME } from '../theme/module1VisualPalette'
import styles from './ProvinceHeatMap.module.css'

/** 与当前界面截图一致的初始视窗：版心约 78%、略提缩放、中心略偏屯溪—歙县一带 */
const DEFAULT_GEO_LAYOUT_SIZE = '78%'
const DEFAULT_GEO_ZOOM = 1.42
const DEFAULT_GEO_CENTER: [number, number] = [118.14, 29.78]

/** SVG 文件名 → 图例文案（仅展示数据里出现过的类型） */
const HERITAGE_ICON_FILE_LABEL: Record<string, string> = {
  'icon-village.svg': '古村落·建筑群',
  'icon-paifang.svg': '牌坊',
  'icon-citang.svg': '祠堂',
  'icon-bridge.svg': '石桥',
  'icon-covered-bridge.svg': '廊桥',
  'icon-academy.svg': '书院',
  'icon-residence.svg': '民居·故居',
  'icon-stage.svg': '戏台',
  'icon-dam.svg': '水利工程',
  'icon-ritual-complex.svg': '牌坊群·家庙',
}

function mapIconFileFromPath(path: string) {
  return path.split('/').pop() ?? path
}

function mapIconToEchartsSymbol(mapIcon: string | undefined): string | undefined {
  if (!mapIcon) return undefined
  const path = mapIcon.startsWith('/') ? mapIcon : `/${mapIcon}`
  if (typeof window === 'undefined') return undefined
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  const url = `${window.location.origin}${base}${path}`
  return `image://${url}`
}

const GEO_FILES = [
  { name: '歙县', file: '/geo/歙县.geojson', cityId: 'sheXian' },
  { name: '休宁县', file: '/geo/休宁县.geojson', cityId: 'xiuNing' },
  { name: '绩溪县', file: '/geo/绩溪县.geojson', cityId: 'jiXi' },
  { name: '徽州区', file: '/geo/徽州区.geojson', cityId: 'huiZhouQu' },
  { name: '婺源县', file: '/geo/婺源县.geojson', cityId: 'wuYuan' },
  { name: '黟县', file: '/geo/黟县.geojson', cityId: 'yiXian' },
  { name: '祁门县', file: '/geo/祁门县.geojson', cityId: 'qiMen' },
  { name: '黄山区', file: '/geo/黄山区.geojson', cityId: 'huangShanQu' },
  { name: '屯溪区', file: '/geo/屯溪区.geojson', cityId: 'tunXiQu' },
]

async function loadLocalGeoJson() {
  const results = await Promise.all(
    GEO_FILES.map(async (g) => {
      const res = await fetch(g.file)
      const json = await res.json()
      return { ...g, geojson: json }
    }),
  )
  const merged = {
    type: 'FeatureCollection',
    features: results.flatMap((r) =>
      (r.geojson.features ?? []).map((f: any) => ({
        ...f,
        properties: { ...f.properties, cityId: r.cityId },
      })),
    ),
  }
  return merged
}

/** 近距离遗产点：经纬度轻微散开，避免缩放叠成一坨（约 1.2–2km） */
function displayGeoCoord(
  coord: [number, number],
  id: string,
  all: { id: string; coord: [number, number] }[],
): [number, number] {
  const [lon, lat] = coord
  const nearby = all.filter(
    (o) =>
      o.id !== id && Math.hypot(o.coord[0] - lon, o.coord[1] - lat) < 0.055,
  )
  if (nearby.length === 0) return coord
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  const angle = ((h % 360) * Math.PI) / 180
  const r = 0.014 * (1 + Math.min(nearby.length, 4) * 0.12)
  return [lon + Math.cos(angle) * r, lat + Math.sin(angle) * r]
}

/** 县块立体描边与投影（不改动热力填充色，仅增强分界与层次） */
function baseCountyItemStyle() {
  return {
    borderColor: 'rgba(42, 90, 92, 0.42)',
    borderWidth: 1.15,
    shadowBlur: 10,
    shadowOffsetY: 4,
    shadowOffsetX: 0,
    shadowColor: 'rgba(15, 48, 50, 0.14)',
  }
}

export function ProvinceHeatMap(props: {
  cities: CityHeatDatum[]
  buildings: BuildingMarker[]
  selectedCityId?: string
  hoveredCityId?: string
  selectedBuildingId?: string
  hoveredBuildingId?: string
  onCityHover: (cityId?: string) => void
  onCityClick: (cityId: string) => void
  onBuildingHover: (buildingId?: string) => void
  onBuildingClick: (buildingId: string) => void
}) {
  const {
    cities,
    buildings,
    selectedCityId,
    hoveredCityId,
    selectedBuildingId,
    hoveredBuildingId,
    onCityHover,
    onCityClick,
    onBuildingHover,
    onBuildingClick,
  } = props

  const filteredBuildings = useMemo(
    () =>
      buildings.filter((b) => {
        if (b.type === '祠堂') return false
        const file = b.mapIcon ? mapIconFileFromPath(b.mapIcon) : ''
        return file !== 'icon-citang.svg'
      }),
    [buildings],
  )

  const [ready, setReady] = useState(false)
  /** 地图实例首次就绪后只设一次默认缩放；后续 option 合并不再写死 zoom，避免 roam 被刷新掉 */
  const didApplyInitialGeoZoom = useRef(false)

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        if (!echarts.getMap('huizhou-counties')) {
          const geo = await loadLocalGeoJson()
          echarts.registerMap('huizhou-counties', geo as any)
        }
        if (mounted) setReady(true)
      } catch (e) {
        console.error('Failed to load geo:', e)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!ready) didApplyInitialGeoZoom.current = false
  }, [ready])

  const values = useMemo(() => cities.map((c) => c.totalBefore1911), [cities])
  const { min, max } = useMemo(() => {
    if (!values.length) return { min: 0, max: 1 }
    return { min: Math.min(...values, 0), max: Math.max(...values, 1) }
  }, [values])

  const scatterBuildingData = useMemo(() => {
    const withCoord = filteredBuildings
      .filter((b) => b.geoCoord)
      .map((b) => ({
        id: b.id,
        coord: b.geoCoord as [number, number],
      }))
    return filteredBuildings
      .filter((b) => b.geoCoord)
      .map((b) => {
        const isSel = b.id === selectedBuildingId
        const isHover = b.id === hoveredBuildingId
        const imgSym = mapIconToEchartsSymbol(b.mapIcon)
        const value = displayGeoCoord(b.geoCoord as [number, number], b.id, withCoord)
        if (imgSym) {
          return {
            name: b.name,
            value,
            buildingId: b.id,
            symbol: imgSym,
            symbolKeepAspect: true,
            itemStyle: {
              borderColor: 'rgba(255, 255, 255, 0.92)',
              borderWidth: 1.25,
              shadowBlur: isSel ? 16 : isHover ? 12 : 10,
              shadowColor: 'rgba(255, 255, 255, 0.55)',
              shadowOffsetY: isSel ? 2 : 1,
            },
            symbolSize: isSel ? 38 : isHover ? 32 : 27,
          }
        }
        return {
          name: b.name,
          value,
          buildingId: b.id,
          symbol: 'pin',
            itemStyle: {
              color: isSel
                ? MAP_GEO_THEME.pinSel
                : isHover
                  ? MAP_GEO_THEME.pinHover
                  : MAP_GEO_THEME.pinDefault,
              borderColor: isSel ? MAP_GEO_THEME.pinAccent : MAP_GEO_THEME.pinBorder,
              borderWidth: isSel ? 2.5 : isHover ? 2 : 1.5,
              shadowBlur: isSel ? 18 : isHover ? 11 : 6,
              shadowColor: 'rgba(74, 132, 138, 0.22)',
              shadowOffsetY: 2,
            },
            symbolSize: isSel ? 20 : isHover ? 16 : 12,
          }
        })
  }, [filteredBuildings, selectedBuildingId, hoveredBuildingId])

  const option = useMemo((): EChartsOption => ({
      animation: false,
      animationDurationUpdate: 0,
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(225, 248, 250, 0.97)',
        borderColor: 'rgba(74, 132, 138, 0.22)',
        borderWidth: 1,
        padding: [12, 16],
        extraCssText:
          'border-radius:14px; box-shadow:0 12px 36px rgba(74,132,138,0.14),0 2px 8px rgba(15,48,50,0.06);',
        textStyle: {
          color: MAP_GEO_THEME.ink,
          fontSize: 13,
          fontFamily:
            "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
        },
        formatter: (params: any) => {
          if (params.seriesName === '县区热力') {
            return `<div style="font-weight:600;margin-bottom:4px">${params.name}</div><span style="opacity:.85">截止1911古建筑数量：</span><b>${params.value ?? '--'}</b>`
          }
          if (params.seriesName === '重点建筑') {
            return `<div style="font-weight:600">${params.data?.name ?? ''}</div>`
          }
          return ''
        },
      },
      visualMap: {
        type: 'continuous',
        min,
        max,
        inRange: {
          color: [...HEAT_MAP_GRADIENT] as string[],
        },
        show: false,
      },
      geo: {
        map: 'huizhou-counties',
        roam: true,
        aspectScale: 0.88,
        layoutCenter: ['50%', '50%'],
        layoutSize: DEFAULT_GEO_LAYOUT_SIZE,
        label: {
          show: true,
          fontSize: 12,
          color: MAP_GEO_THEME.ink,
          fontWeight: 600,
          fontFamily:
            "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
          textBorderColor: 'rgba(255, 255, 255, 0.94)',
          textBorderWidth: 2.5,
          textShadowBlur: 6,
          textShadowColor: 'rgba(225, 248, 250, 0.95)',
          textShadowOffsetY: 1,
        },
        itemStyle: {
          areaColor: MAP_GEO_THEME.land,
          borderColor: MAP_GEO_THEME.border,
          borderWidth: 0.85,
          shadowBlur: 6,
          shadowOffsetY: 2,
          shadowColor: 'rgba(15, 48, 50, 0.08)',
        },
        emphasis: {
          label: {
            show: true,
            color: MAP_GEO_THEME.ink,
            fontWeight: 700,
            fontSize: 12,
            textBorderWidth: 3,
            textBorderColor: 'rgba(255, 255, 255, 0.98)',
            textShadowBlur: 8,
            textShadowColor: 'rgba(225, 248, 250, 0.9)',
          },
          itemStyle: {
            areaColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.92)',
            borderWidth: 2,
            shadowBlur: 16,
            shadowOffsetY: 4,
            shadowColor: 'rgba(74, 132, 138, 0.28)',
          },
        },
      },
      series: [
        {
          id: 'countyHeat',
          name: '县区热力',
          type: 'map',
          map: 'huizhou-counties',
          geoIndex: 0,
          zlevel: 0,
          z: 2,
          animation: false,
          data: cities.map((c) => {
            const base = baseCountyItemStyle()
            if (c.cityId === selectedCityId) {
              return {
                name: c.cityName,
                value: c.totalBefore1911,
                cityId: c.cityId,
                selected: true,
                itemStyle: {
                  ...base,
                  borderColor: MAP_GEO_THEME.focus,
                  borderWidth: 2.6,
                  shadowBlur: 18,
                  shadowOffsetY: 5,
                  shadowColor: 'rgba(74, 132, 138, 0.32)',
                },
              }
            }
            if (c.cityId === hoveredCityId) {
              return {
                name: c.cityName,
                value: c.totalBefore1911,
                cityId: c.cityId,
                itemStyle: {
                  ...base,
                  borderColor: 'rgba(255, 255, 255, 0.88)',
                  borderWidth: 1.85,
                  shadowBlur: 14,
                  shadowOffsetY: 4,
                  shadowColor: 'rgba(74, 132, 138, 0.22)',
                },
              }
            }
            return {
              name: c.cityName,
              value: c.totalBefore1911,
              cityId: c.cityId,
              itemStyle: base,
            }
          }),
          emphasis: {
            /** 默认 coordinateSystem 会把同 geo 下的散点一并淡出，图标像“没了” */
            blurScope: 'series',
            label: {
              show: true,
              fontWeight: 700,
              fontSize: 12,
              textBorderWidth: 3,
              textBorderColor: 'rgba(255, 255, 255, 0.98)',
              textShadowBlur: 8,
              textShadowColor: 'rgba(225, 248, 250, 0.9)',
            },
            itemStyle: {
              areaColor: 'rgba(255, 255, 255, 0.22)',
              borderColor: 'rgba(255, 255, 255, 0.95)',
              borderWidth: 2,
              shadowBlur: 18,
              shadowOffsetY: 5,
              shadowColor: 'rgba(74, 132, 138, 0.26)',
            },
          },
          select: {
            itemStyle: {
              borderColor: MAP_GEO_THEME.focus,
              borderWidth: 2.6,
              shadowBlur: 14,
              shadowOffsetY: 4,
              shadowColor: 'rgba(74, 132, 138, 0.28)',
            },
          },
        },
        {
          id: 'heritageMarkers',
          name: '重点建筑',
          type: 'scatter',
          coordinateSystem: 'geo',
          geoIndex: 0,
          zlevel: 1,
          z: 10,
          large: false,
          animation: false,
          /** 禁用名称标签，避免缩放/漫游时出现大块飘字 */
          label: { show: false },
          emphasis: {
            blurScope: 'series',
            scale: false,
            label: { show: false },
            itemStyle: {
              opacity: 1,
            },
          },
          data: scatterBuildingData,
        },
      ],
    }),
    [min, max, cities, selectedCityId, hoveredCityId, scatterBuildingData],
  )

  const onChartReady = (chart: echarts.ECharts) => {
    if (didApplyInitialGeoZoom.current) return
    didApplyInitialGeoZoom.current = true
    chart.setOption(
      {
        geo: [
          {
            zoom: DEFAULT_GEO_ZOOM,
            center: DEFAULT_GEO_CENTER,
            layoutSize: DEFAULT_GEO_LAYOUT_SIZE,
          },
        ],
      },
      { notMerge: false, lazyUpdate: true },
    )
  }

  /** 热力图例：只保留当前各县数据里真正出现过的数量档 */
  const legendBins = useMemo(() => {
    const d = max - min || 1
    const q1 = Math.round(min + d * 0.25)
    const q2 = Math.round(min + d * 0.5)
    const q3 = Math.round(min + d * 0.75)
    const bands: {
      label: string
      swatchIdx: number
      pred: (v: number) => boolean
    }[] = [
      { label: `≥${q3}`, swatchIdx: 3, pred: (v) => v >= q3 },
      {
        label: q2 <= q3 - 1 ? `${q2}–${q3 - 1}` : `≥${q2}`,
        swatchIdx: 2,
        pred: (v) => v >= q2 && v < q3,
      },
      {
        label: q1 <= q2 - 1 ? `${q1}–${q2 - 1}` : `≥${q1}`,
        swatchIdx: 1,
        pred: (v) => v >= q1 && v < q2,
      },
      { label: `<${q1}`, swatchIdx: 0, pred: (v) => v < q1 },
    ]
    return bands.filter((b) => cities.some((c) => b.pred(c.totalBefore1911)))
  }, [cities, min, max])

  const usedHeritageLegendItems = useMemo(() => {
    const seen = new Map<string, { file: string; label: string; src: string }>()
    for (const b of filteredBuildings) {
      if (!b.mapIcon) continue
      const file = mapIconFileFromPath(b.mapIcon)
      const label = HERITAGE_ICON_FILE_LABEL[file]
      if (!label || seen.has(file)) continue
      const src = b.mapIcon.startsWith('/') ? b.mapIcon : `/${b.mapIcon}`
      seen.set(file, { file, label, src })
    }
    return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))
  }, [filteredBuildings])

  return (
    <div className={styles.wrap}>
      {usedHeritageLegendItems.length > 0 ? (
        <details
          className={styles.heritageLegendWrap}
          aria-label="地图上使用的遗产类型图例"
        >
          <summary className={styles.heritageLegendSummary}>遗产类型</summary>
          <div className={styles.heritageLegendBody}>
            <ul className={styles.heritageLegendList}>
              {usedHeritageLegendItems.map((row) => (
                <li key={row.file} className={styles.heritageLegendRow}>
                  <span className={styles.heritageLegendIconWrap}>
                    <img
                      src={row.src}
                      alt=""
                      className={styles.heritageLegendIcon}
                    />
                  </span>
                  <span className={styles.heritageLegendText}>{row.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      ) : null}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>截止1911古建筑数量</div>
        <div className={styles.legendRamp} aria-hidden>
          {HEAT_MAP_GRADIENT.map((c) => (
            <span
              key={c}
              className={styles.legendRampSeg}
              style={{ background: c }}
            />
          ))}
        </div>
        <div className={styles.legendBins}>
          {legendBins.map((b, i) => (
            <div className={styles.legendBin} key={b.label}>
              <span
                className={styles.legendSwatch}
                style={{
                  background:
                    HEAT_MAP_GRADIENT[[3, 2, 1, 0][i] ?? 0],
                }}
              />
              <span className={styles.legendBinLabel}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      {!ready ? (
        <div className={styles.loading}>地图加载中</div>
      ) : (
        <div className={styles.chartInner}>
          <ReactECharts
            echarts={echarts}
            option={option}
            style={{ height: '100%', width: '100%' }}
            notMerge={false}
            lazyUpdate={false}
            opts={{ renderer: 'canvas' }}
            onChartReady={onChartReady}
            onEvents={{
              mouseover: (params: any) => {
                if (params.seriesName === '县区热力') {
                  const id = cities.find((c) => c.cityName === params.name)?.cityId
                  if (id) onCityHover(id)
                }
                if (params.seriesName === '重点建筑') {
                  const id = params.data?.buildingId
                  if (id) onBuildingHover(id)
                }
              },
              mouseout: (params: any) => {
                if (params.seriesName === '县区热力') onCityHover(undefined)
                if (params.seriesName === '重点建筑') onBuildingHover(undefined)
              },
              click: (params: any) => {
                if (params.seriesName === '县区热力') {
                  const id = cities.find((c) => c.cityName === params.name)?.cityId
                  if (id) onCityClick(id)
                }
                if (params.seriesName === '重点建筑') {
                  const id = params.data?.buildingId
                  if (id) onBuildingClick(id)
                }
              },
            }}
          />
        </div>
      )}
    </div>
  )
}
