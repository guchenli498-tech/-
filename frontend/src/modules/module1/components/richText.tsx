import type { ReactNode } from 'react'

/** 将 `**短语**` 转为加粗强调，无标记时原样返回 */
export function parseBoldEmphasis(
  text: string,
  emphasisClassName?: string
): ReactNode {
  if (!text.includes('**')) return text

  const nodes: ReactNode[] = []
  let rest = text
  let key = 0

  while (rest.length > 0) {
    const start = rest.indexOf('**')
    if (start === -1) {
      nodes.push(<span key={key++}>{rest}</span>)
      break
    }
    if (start > 0) {
      nodes.push(<span key={key++}>{rest.slice(0, start)}</span>)
    }
    const afterOpen = rest.slice(start + 2)
    const close = afterOpen.indexOf('**')
    if (close === -1) {
      nodes.push(<span key={key++}>{rest.slice(start)}</span>)
      break
    }
    const inner = afterOpen.slice(0, close)
    nodes.push(
      <strong key={key++} className={emphasisClassName}>
        {inner}
      </strong>
    )
    rest = afterOpen.slice(close + 2)
  }

  return <>{nodes}</>
}
