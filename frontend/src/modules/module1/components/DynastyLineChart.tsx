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
    title: {
      text: title,
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4A4A48',
        fontFamily: 'SimHei, 黑体, 微软雅黑, Microsoft YaHei, sans-serif',
      },
      left: 8,
      top: 4,
    },
    grid: { left: 44, right: 14, top: 40, bottom: 42 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(250,247,240,0.95)',
      borderColor: 'rgba(212,191,167,0.95)',
      borderWidth: 1,
      textStyle: { color: '#4A4A48', fontFamily: 'SimSun, 宋体, serif' },
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
        color: 'rgba(74,74,72,0.72)',
        fontSize: 11,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(247,160,114,0.18)' } },
      axisLabel: { color: 'rgba(74,74,72,0.55)', fontSize: 10 },
    },
    series: [
      {
        name: '数量',
        type: 'line',
        data: y,
        smooth: true,
        symbolSize: 6,
        symbol: 'circle',
        lineStyle: { width: 2.5, color: '#F7A072' },
        itemStyle: { color: '#F7A072' },
        areaStyle:
          mode === 'area'
            ? {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(247,160,114,0.28)' },
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
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge />
    </div>
  )
}
