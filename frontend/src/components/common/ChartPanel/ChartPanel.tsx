import type { ReactNode } from 'react'
import styles from './ChartPanel.module.css'

export function ChartPanel(props: {
  title?: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  const { title, children, className, bodyClassName } = props
  return (
    <section className={`${styles.panel} ${className ?? ''}`}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <div className={`${styles.body} ${bodyClassName ?? ''}`}>{children}</div>
    </section>
  )
}

