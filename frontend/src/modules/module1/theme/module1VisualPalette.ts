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
  民居: '#5D9EA3',
  祠堂: '#35666B',
  牌坊: '#D2B06A',
  桥梁: '#7EA9C7',
  '综合用途/建筑群': '#738B78',
  其他: '#BEB7AA',
}

/** 沿革节点图例（九类，色值互不重复） */
export const ACTION_LEGEND_COLORS: Record<HeritageRiverActionId, string> = {
  // 颜色尽量收敛：颜色只做“大类主次”，精细区分由形状完成
  settle: '#6F928C',
  waterworks: '#6F928C',
  'clan-public': '#B7925D',
  edict: '#B7925D',
  layout: '#A86F4D',
  boom: '#B7925D',
  repair: '#A86F4D',
  warfare: '#A86F4D',
  other: '#6F928C',
}
