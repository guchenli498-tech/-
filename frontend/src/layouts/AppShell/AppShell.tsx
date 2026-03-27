import { Outlet } from 'react-router-dom'
import { TopNav } from '../../components/common/TopNav/TopNav'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.page}>
      <TopNav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

