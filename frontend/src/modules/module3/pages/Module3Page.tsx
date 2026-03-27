import { ChartPanel } from '../../../components/common/ChartPanel/ChartPanel'
import styles from './Module3Page.module.css'

export function Module3Page() {
  return (
    <ChartPanel bodyClassName={styles.noPadding}>
      <iframe
        title="module3"
        className={styles.iframe}
        src="/charts/module3.html"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </ChartPanel>
  )
}

