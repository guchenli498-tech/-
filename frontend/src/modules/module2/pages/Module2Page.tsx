import styles from './Module2Page.module.css'

export function Module2Page() {
  return (
    <div className={styles.fullBleed}>
      <iframe
        title="module2"
        className={styles.iframe}
        src="/charts/module2.html"
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

