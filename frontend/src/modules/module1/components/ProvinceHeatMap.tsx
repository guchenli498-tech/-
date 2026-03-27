import { useEffect, useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import type { BuildingMarker, CityHeatDatum } from '../types'
import styles from './ProvinceHeatMap.module.css'

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
    })
  )
  // 合并所有 features 为一个 FeatureCollection
  const merged = {
    type: 'FeatureCollection',
    features: results.flatMap((r) =>
      (r.geojson.features ?? []).map((f: any) => ({
        ...f,
        properties: { ...f.properties, cityId: r.cityId },
      }))
    ),
  }
  return merged
}

const HEAT_COLORS = ['#e1f8fa', '#81e8ef', '#67b8bf', '#4a848a'] as const

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
    return () => { mounted = false }
  }, [])

  // 热力分级
  const values = useMemo(() => cities.map((c) => c.totalBefore1911), [cities])
  const { min, max } = useMemo(() => {
    if (!values.length) return { min: 0, max: 1 }
    return { min: Math.min(...values, 0), max: Math.max(...values, 1) }
  }, [values])

  function heatColor(v: number) {
    const delta = max - min || 1
    const ratio = (v - min) / delta
    if (ratio >= 0.75) return HEAT_COLORS[3]
    if (ratio >= 0.5) return HEAT_COLORS[2]
    if (ratio >= 0.25) return HEAT_COLORS[1]
    return HEAT_COLORS[0]
  }

  // 地图 regions 热力着色
  const mapData = useMemo(() =>
    cities.map((c) => ({
      name: c.cityName,
      value: c.totalBefore1911,
      cityId: c.cityId,
      itemStyle: {
        areaColor: heatColor(c.totalBefore1911),
        borderColor:
          c.cityId === selectedCityId
            ? '#4A4A48'
            : c.cityId === hoveredCityId
              ? 'rgba(74,74,72,0.7)'
              : 'rgba(74,74,72,0.35)',
        borderWidth:
          c.cityId === selectedCityId ? 2.5 : c.cityId === hoveredCityId ? 1.8 : 1,
      },
    })),
  [cities, selectedCityId, hoveredCityId]
  )

  // 建筑散点
  const scatterBuildingData = useMemo(() =>
    buildings
      .filter((b) => b.geoCoord)
      .map((b) => {
        const isSel = b.id === selectedBuildingId
        const isHover = b.id === hoveredBuildingId
        return {
          name: b.name,
          value: b.geoCoord as [number, number],
          buildingId: b.id,
          itemStyle: {
            color: '#4A4A48',
            borderColor: '#4A4A48',
            borderWidth: isSel ? 3 : isHover ? 2.2 : 1.7,
            shadowBlur: isSel ? 18 : isHover ? 12 : 0,
            shadowColor: '#F7A072',
          },
          symbolSize: isSel ? 20 : isHover ? 16 : 12,
        }
      }),
  [buildings, selectedBuildingId, hoveredBuildingId]
  )

  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(250,247,240,0.96)',
      borderColor: 'rgba(212,191,167,0.95)',
      borderWidth: 1,
      textStyle: { color: '#4A4A48', fontFamily: 'SimSun, 宋体, serif' },
      formatter: (params: any) => {
        if (params.seriesName === '县区热力') {
          return `<b>${params.name}</b><br/>古建筑数量：${params.value ?? '--'}`
        }
        if (params.seriesName === '重点建筑') {
          return `<b>${params.data?.name}</b>`
        }
        return ''
      },
    },
    visualMap: {
      type: 'continuous',
      min: min,
      max: max,
      inRange: {
        color: ['#e1f8fa', '#81e8ef', '#67b8bf', '#4a848a'],
      },
      show: false,
    },
    geo: {
      map: 'huizhou-counties',
      roam: true,
      zoom: 1.1,
      label: {
        show: true,
        fontSize: 11,
        color: 'rgba(74,74,72,0.85)',
        fontFamily: 'SimSun, 宋体, serif',
      },
      itemStyle: {
        areaColor: '#f2eee6',
        borderColor: 'rgba(74,74,72,0.3)',
        borderWidth: 1,
      },
      emphasis: {
        label: { show: true, color: '#4A4A48', fontWeight: 'bold' },
        itemStyle: { areaColor: 'rgba(247,160,114,0.25)' },
      },
    },
    series: [
      {
        name: '县区热力',
        type: 'map',
        map: 'huizhou-counties',
        geoIndex: 0,
        data: cities.map((c) => ({
          name: c.cityName,
          value: c.totalBefore1911,
          cityId: c.cityId,
          selected: c.cityId === selectedCityId,
          itemStyle: c.cityId === selectedCityId ? {
            borderColor: '#4A4A48',
            borderWidth: 2.5,
          } : c.cityId === hoveredCityId ? {
            borderColor: 'rgba(74,74,72,0.7)',
            borderWidth: 1.8,
          } : {},
        })),
        emphasis: {
          label: { show: true },
          itemStyle: { areaColor: 'rgba(247,160,114,0.35)' },
        },
        select: {
          itemStyle: {
            borderColor: '#4A4A48',
            borderWidth: 2.5,
          },
        },
      },
      {
        name: '重点建筑',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        data: scatterBuildingData,
      },
    ],
  }), [min, max, cities, selectedCityId, hoveredCityId, scatterBuildingData])

  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        <div className={styles.legendTitle}>古建筑数量</div>
        <div className={styles.legendBins}>
          {[
            { label: `≥${Math.round(min + (max-min)*0.75)}`, color: '#4a848a' },
            { label: `≥${Math.round(min + (max-min)*0.5)}`, color: '#67b8bf' },
            { label: `≥${Math.round(min + (max-min)*0.25)}`, color: '#81e8ef' },
            { label: `<${Math.round(min + (max-min)*0.25)}`, color: '#e1f8fa' },
          ].map((b) => (
            <div className={styles.legendBin} key={b.label}>
              <span className={styles.legendSwatch} style={{ background: b.color }} />
              <span className={styles.legendBinLabel}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      {!ready ? (
        <div style={{ padding: 16, color: 'var(--muted)', lineHeight: 1.8 }}>地图加载中…</div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={false}
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
      )}
    </div>
  )
}
