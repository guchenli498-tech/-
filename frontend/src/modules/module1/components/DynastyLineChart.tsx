import ReactECharts from 'echarts-for-react'
import type { CityDynastySeries } from '../types'

export function DynastyLineChart(props: {
  data?: CityDynastySeries
  height?: number
  mode?: 'area' | 'line'
}) {
  const { data, height = 220, mode = 'area' } = props

  if (!data) {
    return (
      <div style={{ padding: 18, color: 'var(--muted)', lineHeight: 1.8 }}>
        点击地图城市后，这里将展示“历朝数量折线图”联动结果。
      </div>
    )
  }

  const x = data.series.map((p) => p.dynasty)
  const y = data.series.map((p) => p.count)

  const option = {
    backgroundColor: 'transparent',
    grid: { left: 40, right: 14, top: 24, bottom: 36 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(250,247,240,0.95)',
      borderColor: 'rgba(212,191,167,0.95)',
      borderWidth: 1,
      textStyle: { color: '#4A4A48', fontFamily: 'SimSun, 宋体, serif' },
      formatter: (params: any) => {
        const p = params?.[0]
        if (!p) return ''
        return `<b>${data.cityName}</b><br/>${p.axisValueLabel}：${p.data}`
      },
    },
    xAxis: {
      type: 'category',
      data: x,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(74,74,72,0.72)',
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(247,160,114,0.18)' } },
      axisLabel: { color: 'rgba(74,74,72,0.55)', fontSize: 11 },
    },
    series: [
      {
        name: '数量',
        type: 'line',
        data: y,
        smooth: true,
        symbolSize: 7,
        symbol: mode === 'line' ? 'circle' : 'none',
        lineStyle: { width: 3, color: '#F7A072' },
        itemStyle: { color: '#F7A072' },
        areaStyle:
          mode === 'area'
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(247,160,114,0.24)' },
                    { offset: 1, color: 'rgba(247,160,114,0.04)' },
                  ],
                },
              }
            : undefined,
      },
    ],
  }

  return (
    <div style={{ height }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

