import { useMemo } from 'react'
import type { BuildingMarker, CityHeatDatum, ProvinceName } from '../types'
import styles from './RegionInsetMap.module.css'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) => v.toString(16).padStart(2, '0')
  return `#${to(Math.round(r))}${to(Math.round(g))}${to(Math.round(b))}`
}

function colorScale(value: number, min: number, max: number) {
  const stops = ['#4a848a', '#67b8bf', '#81e8ef', '#e1f8fa']
  const t = max === min ? 0.5 : (value - min) / (max - min)
  const clamped = Math.min(1, Math.max(0, t))
  const seg = (stops.length - 1) * clamped
  const idx = Math.floor(seg)
  const localT = seg - idx
  const c1 = hexToRgb(stops[idx] ?? stops[0])
  const c2 = hexToRgb(stops[idx + 1] ?? stops[stops.length - 1])
  return rgbToHex(
    lerp(c1.r, c2.r, localT),
    lerp(c1.g, c2.g, localT),
    lerp(c1.b, c2.b, localT),
  )
}

export function RegionInsetMap(props: {
  cities: CityHeatDatum[]
  buildings: BuildingMarker[]
  selectedCityId?: string
}) {
  const { cities, selectedCityId } = props

  const values = useMemo(() => cities.map((c) => c.totalBefore1911), [cities])
  const min = Math.min(...values, 0)
  const max = Math.max(...values, 1)

  const provinceFill = useMemo(() => {
    const byProv = new Map<ProvinceName, number[]>()
    cities.forEach((c) => {
      const arr = byProv.get(c.province) ?? []
      arr.push(c.totalBefore1911)
      byProv.set(c.province, arr)
    })
    const res = {} as Record<ProvinceName, string>
    ;(['安徽', '浙江', '江西'] as ProvinceName[]).forEach((p) => {
      const arr = byProv.get(p) ?? [0]
      const avg = arr.reduce((s, v) => s + v, 0) / arr.length
      res[p] = colorScale(avg, min, max)
    })
    return res
  }, [cities, min, max])

  const selectedCity = cities.find((c) => c.cityId === selectedCityId)

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 260 180" className={styles.svg} role="img">
        <rect x="0" y="0" width="260" height="180" fill="rgba(252,252,252,0.2)" />

        <path
          d="M120,38 L220,48 L230,85 L180,95 L150,78 Z"
          fill={provinceFill['浙江']}
          opacity={0.55}
          stroke="rgba(242,239,233,0.9)"
        />
        <path
          d="M95,82 L150,42 L120,38 L75,62 L50,105 L90,125 Z"
          fill={provinceFill['安徽']}
          opacity={0.5}
          stroke="rgba(242,239,233,0.9)"
        />
        <path
          d="M25,110 L80,90 L75,62 L50,105 L60,155 L35,165 Z"
          fill={provinceFill['江西']}
          opacity={0.45}
          stroke="rgba(242,239,233,0.9)"
        />

        {cities.map((c) => {
          if (!c.center && !c.geoCoord) return null
          const isSel = c.cityId === selectedCityId
          const fill = colorScale(c.totalBefore1911, min, max)
          // 用 geoCoord 或 center 映射到 SVG 坐标
          const cx = c.center
            ? (c.center[0] / 1000) * 260
            : ((c.geoCoord![0] - 117.0) / 2.0) * 260
          const cy = c.center
            ? (c.center[1] / 650) * 180
            : (1 - (c.geoCoord![1] - 29.0) / 2.0) * 180
          return (
            <circle
              key={c.cityId}
              cx={cx}
              cy={cy}
              r={isSel ? 6 : 4}
              fill={fill}
              stroke={isSel ? '#F7A072' : 'rgba(242,239,233,0.95)'}
              strokeWidth={isSel ? 2.2 : 1}
            />
          )
        })}

        {selectedCity ? (
          <text x="16" y="18" fill="rgba(74,74,72,0.75)" fontSize="12">
            {selectedCity.cityName}
          </text>
        ) : (
          <text x="16" y="18" fill="rgba(74,74,72,0.65)" fontSize="12">
            未选择
          </text>
        )}
      </svg>
    </div>
  )
}

