import { useEffect, useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import type {
  BottomNarrativeData,
  NarrativeCase,
  NarrativeFilterTag,
} from '../types'
import bottomNarrativeJson from '../data/bottom-narrative.json'
import styles from './Module1BottomNarrativePanel.module.css'

const bottomNarrative = bottomNarrativeJson as BottomNarrativeData

export function Module1BottomNarrativePanel() {
  const tags = bottomNarrative.tags.filter((t) => t.label !== '祠堂')
  const baseCases = bottomNarrative.cases.filter((c) => c.type !== '祠堂')

  const [activeTagId, setActiveTagId] = useState(tags[0]?.id ?? 't-all')
  const [activeCaseId, setActiveCaseId] = useState(baseCases[0]?.id ?? 'c-1')

  const activeTag = useMemo(
    () => tags.find((t) => t.id === activeTagId) ?? tags[0],
    [activeTagId, tags],
  )

  const cases = useMemo(() => {
    if (!activeTag) return baseCases
    if (activeTag.id === 't-all') return baseCases
    const mappedType =
      activeTag.label === '民居'
        ? '民居'
        : activeTag.label === '祠堂'
          ? '祠堂'
          : activeTag.label === '牌坊'
            ? '牌坊'
            : activeTag.label === '书院'
              ? '书院'
              : activeTag.label
    return baseCases.filter((c) => c.type === mappedType) ?? baseCases
  }, [activeTag])

  const activeCase = useMemo(
    () => cases.find((c) => c.id === activeCaseId) ?? cases[0],
    [cases, activeCaseId],
  )

  // tag 切换时，保证 activeCase 一定落在当前 cases 列表里
  useEffect(() => {
    if (!cases.length) return
    if (cases.some((c) => c.id === activeCaseId)) return
    setActiveCaseId(cases[0].id)
  }, [cases, activeCaseId])

  const timelineOption = {
    backgroundColor: 'transparent',
    xAxis: {
      type: 'category',
      data: cases.map((c) => c.era ?? ''),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: { show: false },
    tooltip: { show: false },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: cases.map((c) => c.score ?? 0.5),
        lineStyle: {
          width: 2.2,
          color: '#F7A072',
        },
        itemStyle: {
          color: '#F25C33',
          borderWidth: 1,
          borderColor: '#FDE2CF',
        },
        areaStyle: {
          color: 'rgba(247,160,114,0.28)',
        },
      } as any,
    ],
    grid: { left: 0, right: 0, top: 10, bottom: 0 },
  }

  return (
    <div className={styles.wrap} aria-label="模块一底部宽幅叙事板">
      <div className={styles.topRow}>
        <div className={styles.title}>底部宽幅叙事板（Mock）</div>
        <div className={styles.tagRow} role="tablist" aria-label="筛选标签">
          {tags.map((t: NarrativeFilterTag) => {
            const isActive = t.id === activeTagId
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
                onClick={() => setActiveTagId(t.id)}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.stripRow} aria-label="横向案例条带">
          <div className={styles.stripRail} />
          {cases.map((c: NarrativeCase) => {
            const isActive = c.id === activeCaseId
            return (
              <button
                key={c.id}
                type="button"
                className={`${styles.caseSeg} ${isActive ? styles.caseSegActive : ''}`}
                onClick={() => setActiveCaseId(c.id)}
              >
                <div className={styles.caseSegTitle}>{c.title}</div>
                <div className={styles.caseSegSub}>
                  {c.subtitle ? c.subtitle : ''}
                  {c.era ? ` · ${c.era}` : ''}
                </div>
              </button>
            )
          })}
        </div>

        <div className={styles.detailRow} aria-label="叙事详情">
          <div className={styles.detailTitle}>{activeCase?.title ?? ''}</div>
          <div className={styles.detailMeta}>
            {activeCase?.type ? `类型：${activeCase.type}` : ''}
            {activeCase?.location ? ` · 地点：${activeCase.location}` : ''}
          </div>
          <div className={styles.detailDesc}>{activeCase?.description ?? ''}</div>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineLabel}>分布节奏（Mock）</div>
          <ReactECharts option={timelineOption} style={{ width: '100%', height: 78 }} />
        </div>
      </div>
    </div>
  )
}

