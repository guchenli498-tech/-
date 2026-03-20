import type { SankeyLink, SankeyNode } from '../../components/SankeyStory'
import { SankeyStory } from '../../components/SankeyStory'
import sankeyJson from '../../data/horse-head-wall/sankey.json'

const sankeyData = sankeyJson as { nodes: SankeyNode[]; links: SankeyLink[] }

const layerLegend = [
  { label: '环境因子', color: '#7a9e9f' },
  { label: '功能需求', color: '#b8c5b0' },
  { label: '类型', color: '#e6a86e' },
  { label: '结构', color: '#f2d0b0' },
  { label: '材料', color: '#d48b67' },
]

export function HorseHeadWallPage() {
  return (
    <div>
      <div style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.8, marginBottom: 10 }}>
        说明：hover 节点/流线聚焦相邻链路；点击节点/链路锁定高亮，再次点击可取消。
      </div>

      <SankeyStory nodes={sankeyData.nodes} links={sankeyData.links} height={760} />

      <div
        style={{
          display: 'flex',
          gap: 18,
          flexWrap: 'wrap',
          marginTop: 12,
          padding: '10px 6px 0',
          borderTop: '1px dashed rgba(242,239,233,0.95)',
        }}
      >
        {layerLegend.map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: l.color }} />
            <span style={{ fontSize: 12, color: 'var(--ink)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

