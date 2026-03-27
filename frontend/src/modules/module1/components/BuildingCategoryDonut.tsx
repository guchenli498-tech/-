import ReactECharts from 'echarts-for-react'
import type { BuildingCategoryDatum } from '../types'

export function BuildingCategoryDonut(props: {
  data: BuildingCategoryDatum[]
}) {
  const { data } = props

  const categories = data.map((d) => d.category)
  const values = data.map((d) => d.value)

  const colors = ['#8EB8B7', '#77ACA9', '#F7A072', '#F25C33', '#A9C1C0']

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(250,247,240,0.95)',
      borderColor: 'rgba(212,191,167,0.95)',
      borderWidth: 1,
      textStyle: { color: '#4A4A48', fontFamily: 'SimSun, 宋体, serif' },
      formatter: (p: any) => `<b>${p.name}</b><br/>占比数值：${p.value}`,
    },
    legend: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['40%', '78%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        labelLine: { length: 14, length2: 10, smooth: true },
        label: {
          show: true,
          formatter: (p: any) => p.name as string,
          color: 'rgba(74,74,72,0.85)',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 16,
          overflow: 'break',
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: 'rgba(252,252,252,0.95)',
          borderWidth: 2,
        },
        data: categories.map((c, i) => ({
          name: c,
          value: values[i],
          itemStyle: { color: colors[i % colors.length] },
        })),
      },
    ],
  }

  return (
    <div style={{ height: 260 }}>
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

