import ReactECharts from 'echarts-for-react'

// 各朝代总量（默认）
const dynastyTotals = [
  { label: '唐以前', value: 10 },
  { label: '宋', value: 18 },
  { label: '元', value: 19 },
  { label: '明', value: 185 },
  { label: '清', value: 540 },
]

// 各区县朝代数据
const regionData: Record<string, { label: string; value: number }[]> = {
  sheXian: [
    { label: '唐以前', value: 7 },
    { label: '宋', value: 10 },
    { label: '元', value: 5 },
    { label: '明', value: 81 },
    { label: '清', value: 126 },
  ],
  xiuNing: [
    { label: '唐以前', value: 0 },
    { label: '宋', value: 0 },
    { label: '元', value: 1 },
    { label: '明', value: 22 },
    { label: '清', value: 17 },
  ],
  jiXi: [
    { label: '唐以前', value: 0 },
    { label: '宋', value: 2 },
    { label: '元', value: 2 },
    { label: '明', value: 15 },
    { label: '清', value: 62 },
  ],
  huiZhouQu: [
    { label: '唐以前', value: 0 },
    { label: '宋', value: 1 },
    { label: '元', value: 2 },
    { label: '明', value: 21 },
    { label: '清', value: 9 },
  ],
  wuYuan: [
    { label: '唐以前', value: 1 },
    { label: '宋', value: 5 },
    { label: '元', value: 3 },
    { label: '明', value: 22 },
    { label: '清', value: 203 },
  ],
  yiXian: [
    { label: '唐以前', value: 1 },
    { label: '宋', value: 0 },
    { label: '元', value: 1 },
    { label: '明', value: 17 },
    { label: '清', value: 48 },
  ],
  qiMen: [
    { label: '唐以前', value: 0 },
    { label: '宋', value: 0 },
    { label: '元', value: 2 },
    { label: '明', value: 6 },
    { label: '清', value: 14 },
  ],
  huangShanQu: [
    { label: '唐以前', value: 1 },
    { label: '宋', value: 0 },
    { label: '元', value: 3 },
    { label: '明', value: 1 },
    { label: '清', value: 6 },
  ],
  tunXiQu: [
    { label: '唐以前', value: 0 },
    { label: '宋', value: 0 },
    { label: '元', value: 1 },
    { label: '明', value: 3 },
    { label: '清', value: 12 },
  ],
}

const cityNames: Record<string, string> = {
  sheXian: '歙县',
  xiuNing: '休宁县',
  jiXi: '绩溪县',
  huiZhouQu: '徽州区',
  wuYuan: '婺源县',
  yiXian: '黟县',
  qiMen: '祁门县',
  huangShanQu: '黄山区',
  tunXiQu: '屯溪区',
}

export function DynastyLineChart(props: {
  selectedCityId?: string
  height?: number
  mode?: 'area' | 'line'
}) {
  const { selectedCityId, height = 220, mode = 'area' } = props

  const cityData = selectedCityId ? regionData[selectedCityId] : null
  const points = cityData ?? dynastyTotals
  const title = cityData
    ? `${cityNames[selectedCityId!] ?? selectedCityId} · 历朝建筑数量`
    : '历朝徽派古建筑留存数量'

  const x = points.map((p) => p.label)
  const y = points.map((p) => p.value)

  const option = {
    backgroundColor: 'transparent',
    // 标题由外层 ChartPanel 统一渲染
    grid: { left: 52, right: 14, top: 18, bottom: 26, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(251, 248, 242, 0.98)',
      borderColor: 'rgba(222, 215, 203, 0.95)',
      borderWidth: 1,
      textStyle: { color: '#4B463F', fontFamily: 'SimSun, 宋体, serif' },
      formatter: (params: any) => {
        const p = params?.[0]
        if (!p) return ''
        return `<b>${p.axisValueLabel}</b>：${p.data} 处`
      },
    },
    xAxis: {
      type: 'category',
      data: x,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(124,116,104,0.95)',
        fontSize: 10,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: { color: '#E8E1D6', width: 1 },
      },
      axisLabel: { color: 'rgba(124,116,104,0.85)', fontSize: 10 },
      splitNumber: 3,
    },
    series: [
      {
        name: '数量',
        type: 'line',
        data: y,
        smooth: true,
        symbolSize: 4,
        symbol: 'circle',
        lineStyle: { width: 3, color: '#67B8BF' },
        itemStyle: { color: '#67B8BF' },
        areaStyle:
          mode === 'area'
            ? {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(103,184,191,0.2)' },
                    { offset: 1, color: 'rgba(103,184,191,0.04)' },
                  ],
                },
              }
            : undefined,
      },
    ],
  }

  return (
    <div style={{ height: '100%', width: '100%', padding: 6, boxSizing: 'border-box' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge />
    </div>
  )
}
