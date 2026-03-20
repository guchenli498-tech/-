export type ProvinceName = '安徽' | '浙江' | '江西'

export type CityHeatDatum = {
  cityId: string
  cityName: string
  province: ProvinceName
  totalBefore1911: number
  // 用于 ECharts map 的经纬度（[lon, lat]）
  geoCoord?: [number, number]
  // 用于“示意地图”的归一化坐标（SVG viewBox 坐标体系）
  center: [number, number]
}

export type DynastyCountPoint = {
  dynasty: string
  count: number
}

export type CityDynastySeries = {
  cityId: string
  cityName: string
  series: DynastyCountPoint[]
}

export type BuildingMarker = {
  id: string
  name: string
  cityId: string
  coord: [number, number] // 地图示意坐标
  // 用于 ECharts map 的经纬度（[lon, lat]）
  geoCoord?: [number, number]
  image: string // 图片 URL 或 data URL（MVP 用 mock）
  summary: string
  tags?: string[]
  dynasty?: string
  type?: string
}

export type BuildingCategoryDatum = {
  category: '民居' | '祠堂' | '牌坊' | '书院' | '亭台楼阁'
  value: number
}

export type NarrativeFilterTag = {
  id: string
  label: string
}

export type NarrativeCase = {
  id: string
  title: string
  subtitle?: string
  type: string
  era?: string
  location?: string
  description: string
  score?: number
}

export type BottomNarrativeData = {
  tags: NarrativeFilterTag[]
  cases: NarrativeCase[]
}


