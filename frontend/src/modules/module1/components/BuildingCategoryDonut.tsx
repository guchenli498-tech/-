import ReactECharts from 'echarts-for-react'
import type { BuildingCategoryDatum } from '../types'

const CATEGORY_COLORS: Record<string, string> = {
  民居: '#D98B3D',
  桥梁: '#E3A84E',
  '综合用途/建筑群': '#C9792F',
  其他: '#F0BC69',
}
const FALLBACK_COLORS = [
  '#D98B3D',
  '#E3A84E',
  '#C9792F',
  '#F0BC69',
  '#B86B2D',
]

export function BuildingCategoryDonut(props: {
  data: BuildingCategoryDatum[]
}) {
  const { data } = props

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(248, 251, 255, 0.97)',
      borderColor: 'rgba(81, 127, 171, 0.38)',
      borderWidth: 1,
      padding: [10, 14],
      extraCssText:
        'border-radius:10px; box-shadow:0 8px 28px rgba(37,78,122,0.13),0 2px 6px rgba(37,78,122,0.07);',
      textStyle: {
        color: '#254e7a',
        fontFamily: "'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif",
        fontSize: 13,
      },
      formatter: (p: any) =>
        `<div style="font-weight:700;margin-bottom:3px;color:#254e7a">${p.name}</div>` +
        `<span style="opacity:.75">数量：</span><b style="color:#c9a227">${p.value}</b>` +
        `<span style="opacity:.6;margin-left:8px">(${p.percent?.toFixed(1)}%)</span>`,
    },
    // 标题由外层 ChartPanel 统一渲染
    legend: { show: false },
    series: [
      {
        type: 'pie',
        roseType: 'radius',
        radius: ['18%', '78%'],
        center: ['50%', '54%'],
        avoidLabelOverlap: true,
        startAngle: 60,
        labelLine: {
          length: 10,
          length2: 8,
          smooth: true,
          lineStyle: { color: 'rgba(81,127,171,0.4)', width: 1 },
        },
        label: {
          show: true,
          formatter: (p: any) => {
            const pct = p.percent?.toFixed(0) ?? ''
            return `{name|${p.name}}\n{pct|${pct}%}`
          },
          rich: {
            name: {
              color: '#254e7a',
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 17,
              fontFamily: "'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif",
            },
            pct: {
              color: 'rgba(81,127,171,0.75)',
              fontSize: 10,
              lineHeight: 14,
              fontFamily: "'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif",
            },
          },
          overflow: 'break',
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: 'rgba(252,250,244,0.98)',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(37,78,122,0.14)',
          shadowOffsetY: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 22,
            shadowColor: 'rgba(81,127,171,0.28)',
            borderWidth: 3,
            borderColor: 'rgba(255,255,255,0.98)',
          },
          label: { show: true },
        },
        data: data.map((d, i) => ({
          name: d.category,
          value: d.value,
          itemStyle: {
            color: CATEGORY_COLORS[d.category] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          },
        })),
      },
    ],
  }

  return (
    <div style={{ height: '100%' }}>
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
