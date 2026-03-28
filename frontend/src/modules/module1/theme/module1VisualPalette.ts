import type { HeritageRiverActionId, HeritageTypeCategory } from '../types'

/**
 * 用户提供的蓝系 + 灰蓝/桃点缀（与地图、生命之河共用，避免两处漂移）
 */
export const BLUE = {
  navy: '#254e7a',
  steel: '#517fab',
  sky: '#7ebce7',
  pale: '#c5e1ef',
  cream: '#f4f2eb',
  midBlue: '#76a1d1',
  blueGrey: '#adbfdd',
  lavenderGrey: '#c8cedf',
  peach: '#f5d8c8',
  grey: '#e1e1e1',
} as const

/**
 * 地图热力：截止 1911 各地徽派建筑总数量，越多越深（浅→深）
 * 深→浅依次为 #4a848a、#67b8bf、#81e8ef、#e1f8fa
 */
export const HEAT_MAP_GRADIENT = [
  '#e1f8fa',
  '#81e8ef',
  '#67b8bf',
  '#4a848a',
] as const

/** ECharts 地图：底图、标注、图钉（与热力同系青绿） */
export const MAP_GEO_THEME = {
  land: HEAT_MAP_GRADIENT[0],
  ink: '#2a4f53',
  border: 'rgba(74, 132, 138, 0.2)',
  focus: '#4a848a',
  hoverLine: 'rgba(103, 184, 191, 0.92)',
  pinDefault: '#67b8bf',
  pinHover: '#81e8ef',
  pinSel: '#4a848a',
  pinBorder: '#ffffff',
  pinAccent: '#f0a070',
} as const

/** 遗存类型（六类） */
export const TYPE_COLOR: Record<HeritageTypeCategory, string> = {
  民居: '#76a1d1',
  祠堂: '#254e7a',
  牌坊: '#f5d8c8',
  桥梁: '#7ebce7',
  '综合用途/建筑群': '#517fab',
  其他: '#c8cedf',
}

/** 沿革节点图例（九类，色值互不重复） */
export const ACTION_LEGEND_COLORS: Record<HeritageRiverActionId, string> = {
  settle: '#76a1d1',
  waterworks: '#c5e1ef',
  'clan-public': '#517fab',
  edict: '#f5d8c8',
  layout: '#254e7a',
  boom: '#7ebce7',
  repair: '#adbfdd',
  warfare: '#c8cedf',
  other: '#e1e1e1',
}
