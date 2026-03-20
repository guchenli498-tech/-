import { useEffect, useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import type { BuildingMarker, CityHeatDatum, ProvinceName } from '../types'
import styles from './ProvinceHeatMap.module.css'

async function loadChinaGeoJson() {
  // 用 CDN 省界数据（因为本地 echarts-map geo 不在 node_modules）
  const url =
    'https://cdn.jsdelivr.net/npm/china-echarts-map@1.0.0/dist/china.js'
  const code = await fetch(url).then((r) => r.text())
  // china.js 是 commonjs：module.exports = { type:'FeatureCollection', ... }
  const module = { exports: {} as any }
  const fn = new Function('module', 'exports', `${code}; return module.exports;`)
  return fn(module, module.exports)
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

  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        if (!echarts.getMap('china')) {
          const geo = await loadChinaGeoJson()
          echarts.registerMap('china', geo as any)
        }
      } catch {
        // TODO: replace with local geojson file for fully offline deployment
      } finally {
        if (mounted) setReady(Boolean(echarts.getMap('china')))
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const values = useMemo(
    () => cities.map((c) => c.totalBefore1911),
    [cities],
  )
  const heatBinColors = ['#e1f8fa', '#81e8ef', '#67b8bf', '#4a848a'] as const
  const heatMinMax = useMemo(() => {
    if (!values.length) return { min: 0, max: 1 }
    const min = Math.min(...values, 0)
    const max = Math.max(...values, 1)
    return { min, max }
  }, [values])

  const heatThresholds = useMemo(() => {
    // 四档分级：低/较低/较高/高（按 min/max 等距切分，保证分档在小样本下仍明显）
    const { min, max } = heatMinMax
    const delta = max - min
    if (delta <= 0) return { t1: min, t2: min, t3: min }
    return {
      t1: min + delta * 0.25,
      t2: min + delta * 0.5,
      t3: min + delta * 0.75,
    }
  }, [heatMinMax])

  function heatLevelForValue(v: number) {
    if (!Number.isFinite(v)) return 0
    if (v >= heatThresholds.t3) return 3
    if (v >= heatThresholds.t2) return 2
    if (v >= heatThresholds.t1) return 1
    return 0
  }

  const provinceValueMap = useMemo(() => {
    const byProv = new Map<ProvinceName, number>()
    ;(['安徽', '浙江', '江西'] as ProvinceName[]).forEach((p) => byProv.set(p, 0))
    cities.forEach((c) => {
      byProv.set(c.province, (byProv.get(c.province) ?? 0) + c.totalBefore1911)
    })
    return byProv
  }, [cities])

  const scatterCityData = useMemo(() => {
    return cities
      .filter((c) => c.geoCoord)
      .map((c) => {
        const isSel = c.cityId === selectedCityId
        const isHover = c.cityId === hoveredCityId
        const level = heatLevelForValue(c.totalBefore1911)
        const base = heatBinColors[level]
        const heatOpacity = level === 0 ? 0.9 : level === 1 ? 0.95 : level === 2 ? 0.985 : 1
        return {
          name: c.cityName,
          value: c.geoCoord,
          cityId: c.cityId,
          total: c.totalBefore1911,
          itemStyle: {
            color: base,
            opacity: heatOpacity,
            // 选中态用深灰描边避免与建筑层“#4a4a48”强调色混在一起
            borderColor: isSel ? '#4A4A48' : isHover ? 'rgba(74,74,72,0.55)' : 'rgba(74,74,72,0.28)',
            borderWidth: isSel ? 3.0 : isHover ? 2.2 : 1.4,
          },
          symbolSize:
            // 用尺寸差强化“四档热力”可读性（让热力层更像“热力”而非散点）
            level === 3
              ? isSel
                ? 24
                : isHover
                  ? 21
                  : 19
              : level === 2
                ? isSel
                  ? 22
                  : isHover
                    ? 19
                    : 16
                : level === 1
                  ? isSel
                    ? 18
                    : isHover
                      ? 15
                      : 13
                  : isSel
                    ? 16
                    : isHover
                      ? 13
                      : 11,
        }
      })
  }, [cities, hoveredCityId, selectedCityId])

  const scatterBuildingData = useMemo(() => {
    return buildings
      .filter((b) => b.geoCoord)
      .map((b) => {
        const isSel = b.id === selectedBuildingId
        const isHover = b.id === hoveredBuildingId
        return {
          name: b.name,
          value: b.geoCoord as [number, number],
          buildingId: b.id,
          itemStyle: {
            // 重点建筑 marker 统一为 #4a4a48（选中态只做橙金 glow，高亮不改主体色）
            color: '#4A4A48',
            borderColor: '#4A4A48',
            borderWidth: isSel ? 3.0 : isHover ? 2.2 : 1.7,
            shadowBlur: isSel ? 18 : isHover ? 12 : 0,
            shadowColor: isSel ? '#F7A072' : 'rgba(247,160,114,0.85)',
          },
          symbolSize: isSel ? 20 : isHover ? 16 : 12,
        }
      })
  }, [buildings, hoveredBuildingId, selectedBuildingId])

  const option = useMemo(() => {
    // 地图底色：只突出安徽/浙江/江西，其它省透明
    const focusProvinces = ['浙江', '安徽', '江西'] as ProvinceName[]
    const focusRegions = focusProvinces.map((p) => {
      return {
        name: p,
        itemStyle: {
          // 省域底色尽量浅，让“城市热力四档”成为主视觉
          areaColor: 'rgba(225,248,250,0.13)',
          borderColor: 'rgba(74, 74, 72, 0.42)',
          borderWidth: 1.35,
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(225,248,250,0.16)',
            borderColor: 'rgba(74, 74, 72, 0.58)',
            borderWidth: 1.85,
          },
        },
      }
    })

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(250,247,240,0.96)',
        borderColor: 'rgba(212,191,167,0.95)',
        borderWidth: 1,
        textStyle: { color: '#4A4A48', fontFamily: 'SimSun, 宋体, serif' },
        formatter: (params: any) => {
          const sName: string = params.seriesName ?? ''
          if (sName === '城市热力') {
            const data = params?.data ?? {}
            return `<b>${data.name}</b><br/>截至1911总量：${data.total ?? '--'}`
          }
          if (sName === '重点建筑') {
            const data = params?.data ?? {}
            return `<b>${data.name}</b><br/>${params?.data?.buildingId ?? ''}`
          }
          return ''
        },
      },
      geo: {
        map: 'china',
        roam: false,
        // 让三省区域成为主视觉（占满卡片而不是缩成一坨）
        zoom: 3.55,
        center: [117.15, 29.25],
        layoutCenter: ['56%', '55%'],
        layoutSize: '205%',
        label: { show: false },
        itemStyle: {
          areaColor: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
        },
        regions: focusRegions as any,
        emphasis: { disabled: true },
      },
      series: [
        {
          name: '城市热力',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'circle',
          data: scatterCityData as any,
        },
        {
          name: '重点建筑',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'pin',
          data: scatterBuildingData.map((d) => ({
            name: d.name,
            value: d.value,
            buildingId: d.buildingId,
            itemStyle: d.itemStyle,
            symbolSize: d.symbolSize,
          })),
        },
      ],
    } as any
  }, [
    hoveredBuildingId,
    hoveredCityId,
    buildings,
    cities,
    provinceValueMap,
    selectedBuildingId,
    selectedCityId,
  ])

  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        <div className={styles.legendTitle}>城市热力（截止1911）</div>
        <div className={styles.legendBins}>
          {[
            { label: '高', color: '#4a848a' },
            { label: '较高', color: '#67b8bf' },
            { label: '中', color: '#81e8ef' },
            { label: '低', color: '#e1f8fa' },
          ].map((b) => (
            <div className={styles.legendBin} key={b.label}>
              <span className={styles.legendSwatch} style={{ background: b.color }} />
              <span className={styles.legendBinLabel}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      {!ready ? (
        <div style={{ padding: 16, color: 'var(--muted)', lineHeight: 1.8 }}>
          地图加载中（MVP）
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={false}
          onEvents={{
            mouseover: (params: any) => {
              if (params?.seriesName === '城市热力') {
                const id = params?.data?.cityId
                if (id) onCityHover(id)
              }
              if (params?.seriesName === '重点建筑') {
                const id = params?.data?.buildingId
                if (id) onBuildingHover(id)
              }
            },
            mouseout: (params: any) => {
              if (params?.seriesName === '城市热力') {
                const id = params?.data?.cityId
                if (id) onCityHover(undefined)
              }
              if (params?.seriesName === '重点建筑') {
                const id = params?.data?.buildingId
                if (id) onBuildingHover(undefined)
              }
            },
            click: (params: any) => {
              if (params?.seriesName === '城市热力') {
                const id = params?.data?.cityId as string | undefined
                if (id) onCityClick(id)
              }
              if (params?.seriesName === '重点建筑') {
                const id = params?.data?.buildingId as
                  | string
                  | undefined
                if (id) onBuildingClick(id)
              }
            },
          }}
        />
      )}
    </div>
  )
}

