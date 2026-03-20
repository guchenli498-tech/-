import { useEffect, useMemo, useState } from 'react'
import type { StructureTabItem, StructureTabKey } from '../types'
import styles from './QuarterImageSwitcher.module.css'

const CENTER_INDEX = 2

export function QuarterImageSwitcher(props: {
  value: StructureTabKey
  items: StructureTabItem[]
  onChange: (key: StructureTabKey) => void
}) {
  const { value, items, onChange } = props

  const keys = useMemo(() => items.map((i) => i.key), [items])

  const initialPos = useMemo(() => {
    // 把 value 放到中心，其余按 items 顺序铺到弧线其它位置
    const others = keys.filter((k) => k !== value)
    const pos: StructureTabKey[] = [others[0], others[1], value, others[2], others[3]]
    return pos.filter(Boolean) as StructureTabKey[]
  }, [keys, value])

  const [posKeys, setPosKeys] = useState<StructureTabKey[]>(initialPos)

  useEffect(() => {
    // 若 value 从外部变更，保证它总在中心位置（尽量不打乱其它顺序）
    setPosKeys((prev) => {
      if (prev[CENTER_INDEX] === value) return prev
      const idx = prev.indexOf(value)
      if (idx === -1) return prev
      const next = [...prev]
      const centerKey = next[CENTER_INDEX]
      next[CENTER_INDEX] = value
      next[idx] = centerKey
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const segSize = 46
  const center = { x: 86, y: 86 }
  const radius = 62
  const angleStart = -90
  const angleEnd = 0

  function keyToPosStyle(index: number) {
    const t = posKeys.length === 1 ? 0 : index / (posKeys.length - 1)
    const deg = angleStart + (angleEnd - angleStart) * t
    const rad = (deg * Math.PI) / 180
    const x = center.x + radius * Math.cos(rad)
    const y = center.y + radius * Math.sin(rad)
    const isCenter = index === CENTER_INDEX

    return {
      left: `${x - segSize / 2}px`,
      top: `${y - segSize / 2}px`,
      transform: `translateZ(0) ${isCenter ? 'scale(1.18)' : 'scale(1)'}`,
    } as const
  }

  function handleClick(clickedKey: StructureTabKey) {
    if (clickedKey === posKeys[CENTER_INDEX]) return
    const idx = posKeys.indexOf(clickedKey)
    if (idx === -1) return
    const next = [...posKeys]
    const centerKey = next[CENTER_INDEX]
    next[idx] = centerKey
    next[CENTER_INDEX] = clickedKey
    setPosKeys(next)
    onChange(clickedKey)
  }

  return (
    <div className={styles.arc} aria-label="四分之一圆图片切换器（MVP）">
      <div className={styles.ring} />
      {posKeys.map((k, index) => {
        const meta = items.find((i) => i.key === k)
        if (!meta) return null
        const isCenter = k === value
        return (
          <button
            key={k}
            type="button"
            className={`${styles.seg} ${isCenter ? styles.active : ''}`}
            style={keyToPosStyle(index)}
            title={meta.label}
            onClick={() => handleClick(k)}
          >
            <span className={styles.dot} style={{ background: meta.color }} />
            <small>{meta.label}</small>
          </button>
        )
      })}
    </div>
  )
}

