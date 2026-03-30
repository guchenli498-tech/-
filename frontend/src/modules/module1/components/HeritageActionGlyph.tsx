import type { HeritageRiverActionId } from '../types'

type Props = {
  action: HeritageRiverActionId
  color: string
  /** 外框大小（px） */
  size?: number
}

/**
 * 沿革节点：不同 action 用不同图形区分，替代纯圆点。
 * 不依赖任何图片资源，只用 SVG，保证“图片不变”。
 */
export function HeritageActionGlyph(props: Props) {
  const { action, color, size = 14 } = props
  const vb = 16
  const strokeBg = 'rgba(251, 248, 242, 0.95)'

  const inner = (() => {
    switch (action) {
      case 'settle':
        // 初建/形成：实心圆
        return (
          <circle
            cx="8"
            cy="8"
            r="5.35"
            fill={color}
            stroke={strokeBg}
            strokeWidth="0.75"
          />
        )
      case 'waterworks':
      case 'clan-public':
      case 'layout':
      case 'boom':
        // 建设/扩展/格局定型/鼎盛：实心小圆
        return (
          <circle
            cx="8"
            cy="8"
            r="4.35"
            fill={color}
            stroke={strokeBg}
            strokeWidth="0.65"
          />
        )
      case 'warfare':
        // 损毁/战乱：实心三角
        return (
          <polygon
            points="8,2.6 14.6,13.6 1.4,13.6"
            fill={color}
            stroke={strokeBg}
            strokeWidth="0.6"
          />
        )
      case 'repair':
        // 修复/整治：空心圆
        return (
          <circle
            cx="8"
            cy="8"
            r="5"
            fill="none"
            stroke={color}
            strokeWidth="2.0"
          />
        )
      case 'edict':
      case 'other':
        // 保护/认定：方块（双圈感：外圈+内圈）
        return (
          <>
            <rect
              x="3.9"
              y="3.9"
              width="8.2"
              height="8.2"
              rx="1.35"
              fill="none"
              stroke={color}
              strokeWidth="1.9"
            />
            <rect
              x="5.2"
              y="5.2"
              width="5.6"
              height="5.6"
              rx="1.05"
              fill="none"
              stroke={strokeBg}
              strokeWidth="0.85"
            />
          </>
        )
      default:
        return (
          <circle
            cx="8"
            cy="8"
            r="4.2"
            fill={color}
            stroke={strokeBg}
            strokeWidth="0.75"
          />
        )
    }
  })()

  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} aria-hidden>
      {inner}
    </svg>
  )
}

