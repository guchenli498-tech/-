export type StructureTabKey = 'horseHeadWall' | 'patio' | 'whiteWall' | 'roof' | 'waterSystem'

export type StructureTabItem = {
  key: StructureTabKey
  label: string
  // MVP：用颜色代替图片
  color: string
}

