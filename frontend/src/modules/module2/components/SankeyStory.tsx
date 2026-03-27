import { useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'

export type SankeyNode = {
  name: string
  itemStyle?: { color?: string }
  description?: string
}

export type SankeyLink = {
  source: string
  target: string
  value: number
  id?: string | number
}

export function SankeyStory(props: {
  nodes: SankeyNode[]
  links: SankeyLink[]
  height?: number
}) {
  const { nodes, links, height = 720 } = props

  const [selectedLinkIds, setSelectedLinkIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [selectedNodeNames, setSelectedNodeNames] = useState<Set<string>>(
    () => new Set(),
  )

  const nodeColorMap = useMemo(() => {
    const map = new Map<string, string>()
    nodes.forEach((n) => {
      if (n.itemStyle?.color) map.set(n.name, n.itemStyle.color)
    })
    return map
  }, [nodes])

  const getNodeColor = (name: string) => nodeColorMap.get(name) ?? '#e0d4c3'

  // ECharts sankey option
  const option = useMemo(() => {
    const defaultLinkColor = '#e0d4c3'

    const resolvedLinks = links.map((l, idx) => {
      const linkId = String(l.id ?? idx)
      const isLinkSelected = selectedLinkIds.has(linkId)
      const isNodeRelated =
        selectedNodeNames.has(l.source) || selectedNodeNames.has(l.target)

      const highlight = isLinkSelected || isNodeRelated
      return {
        ...l,
        id: linkId,
        lineStyle: {
          color: highlight ? getNodeColor(l.source) : defaultLinkColor,
          opacity: highlight ? 0.9 : 0.4,
          width: highlight ? 3 : 1.5,
          curveness: 0.1,
        },
      }
    })

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: 'rgba(250,247,240,0.95)',
        borderColor: 'rgba(212,191,167,0.95)',
        borderWidth: 1,
        textStyle: { color: '#d48b67', fontFamily: 'SimSun, 宋体, serif' },
        formatter: (params: any) => {
          const dt = params?.dataType
          if (dt === 'node') {
            const nodeName = params?.name ?? '未知节点'
            const node = nodes.find((n) => n.name === nodeName)
            return `<b>${nodeName}</b><br/>类别：${node?.description ?? '—'}`
          }
          // edge/link
          const source = params?.data?.source ?? params?.source ?? '未知源节点'
          const target = params?.data?.target ?? params?.target ?? '未知目标节点'
          const value = params?.data?.value ?? params?.value ?? 0
          return `<b>影响链路</b><br/>${source} → ${target}<br/>影响权重：${value}`
        },
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          nodeWidth: 25,
          nodeGap: 15,
          draggable: true,
          data: nodes.map((n) => ({
            name: n.name,
            itemStyle: n.itemStyle,
            description: n.description,
            draggable: true,
          })),
          links: resolvedLinks.map((l) => ({
            source: l.source,
            target: l.target,
            value: l.value,
            id: l.id,
            lineStyle: l.lineStyle,
          })),
          emphasis: {
            focus: 'adjacency',
            itemStyle: {
              shadowBlur: 6,
              shadowColor: 'rgba(212, 139, 103, 0.3)',
              borderWidth: 1.5,
              borderColor: '#d48b67',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.9,
              width: 3,
            },
          },
          lineStyle: {
            color: defaultLinkColor,
            curveness: 0.1,
            opacity: 0.4,
            width: 1.5,
          },
        },
      ],
    }
  }, [getNodeColor, links, nodes, selectedLinkIds, selectedNodeNames])

  return (
    <div style={{ height }}>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        notMerge={true}
        lazyUpdate={false}
        onEvents={{
          click: (params: any) => {
            if (!params) return

            const dt = params.dataType
            if (dt === 'edge' || dt === 'link') {
              const linkIdRaw = params?.data?.id ?? params?.data?.linkId
              const linkId = String(linkIdRaw ?? '')
              if (!linkId) return
              setSelectedNodeNames(new Set())
              setSelectedLinkIds((prev) => {
                const next = new Set(prev)
                if (next.has(linkId)) {
                  next.delete(linkId)
                } else {
                  next.clear()
                  next.add(linkId)
                }
                return next
              })
              return
            }

            if (dt === 'node') {
              const nodeName = params?.name
              if (!nodeName) return
              setSelectedLinkIds(new Set())
              setSelectedNodeNames((prev) => {
                const next = new Set(prev)
                if (next.has(nodeName)) next.delete(nodeName)
                else {
                  next.clear()
                  next.add(nodeName)
                }
                return next
              })
            }
          },
          mouseover: () => {},
        }}
      />
    </div>
  )
}

