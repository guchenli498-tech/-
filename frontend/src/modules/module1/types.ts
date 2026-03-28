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
  /** 地图散点用 SVG，如 /huizhou_map_icons/icon-village.svg */
  mapIcon?: string
  image: string // 图片 URL 或 data URL（MVP 用 mock）
  summary: string
  /** 右侧面板：地区｜类型｜年代 */
  detailMeta?: string
  /** 右侧面板：长篇介绍（优先于 summary） */
  detailBody?: string
  tags?: string[]
  dynasty?: string
  type?: string
}

export type BuildingCategoryDatum = {
  category: string
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

/** 与国保名录、环图一致的建筑类型配色键 */
export type HeritageTypeCategory =
  | '民居'
  | '祠堂'
  | '牌坊'
  | '桥梁'
  | '综合用途/建筑群'
  | '其他'

export type HeritageRiverActionId =
  | 'settle'
  | 'waterworks'
  | 'clan-public'
  | 'edict'
  | 'layout'
  | 'boom'
  | 'repair'
  | 'warfare'
  | 'other'

export type HeritageRiverSegment = {
  startYear: number
  endYear: number
  dynasty: string
  typeCategory: HeritageTypeCategory
}

export type HeritageRiverEvent = {
  year: number
  action: HeritageRiverActionId
  label: string
}

export type HeritageRiverSite = {
  id: string
  name: string
  region: string
  segments: HeritageRiverSegment[]
  events: HeritageRiverEvent[]
}

export type HeritageRiverBand = {
  id: string
  label: string
  startYear: number
  endYear: number
}

export type HeritageRiverActionLegendItem = {
  id: HeritageRiverActionId
  label: string
  color: string
}

export type HeritageRiverDataFile = {
  title: string
  timeRange: [number, number]
  dynastyBands: HeritageRiverBand[]
  actionLegend: HeritageRiverActionLegendItem[]
  sites: HeritageRiverSite[]
}


