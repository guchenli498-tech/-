import type { ReactNode } from 'react'
import styles from './ChartPanel.module.css'

export function ChartPanel(props: {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  const { title, subtitle, children, className, bodyClassName } = props
  return (
    <section className={`${styles.panel} ${className ?? ''}`}>
      {title ? (
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
        </div>
      ) : null}
      <div className={`${styles.body} ${bodyClassName ?? ''}`}>{children}</div>
    </section>
  )
}

