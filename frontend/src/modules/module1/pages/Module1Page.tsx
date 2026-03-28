import { useMemo, useRef, useEffect, useState } from 'react'
import { ChartPanel } from '../../../components/common/ChartPanel/ChartPanel'
import { ProvinceHeatMap } from '../components/ProvinceHeatMap'
import { DynastyLineChart } from '../components/DynastyLineChart'
import { BuildingInfoPanel } from '../components/BuildingInfoPanel'
import { BuildingCategoryDonut } from '../components/BuildingCategoryDonut'
import { HeritageRiverTimeline } from '../components/HeritageRiverTimeline'
import type { BuildingCategoryDatum, BuildingMarker, CityHeatDatum } from '../types'
import citiesJson from '../data/cities.json'
import buildingMarkersJson from '../data/building-markers.json'
import buildingCategoriesJson from '../data/building-categories.json'
import styles from './Module1Page.module.css'

export function Module1Page() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function fit() {
      if (!wrapRef.current) return
      const navEl = document.querySelector('header') as HTMLElement | null
      const navH = navEl ? navEl.getBoundingClientRect().height : 58
      wrapRef.current.style.height = `${window.innerHeight - navH}px`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const cities = citiesJson as CityHeatDatum[]
  const buildings = buildingMarkersJson as BuildingMarker[]
  const buildingCategories = buildingCategoriesJson as BuildingCategoryDatum[]


  const [selectedCityId, setSelectedCityId] = useState<string | undefined>(
    undefined,
  )
  const [hoveredCityId, setHoveredCityId] = useState<string | undefined>(
    undefined,
  )

  const [selectedBuildingId, setSelectedBuildingId] = useState<
    string | undefined
  >(undefined)
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | undefined>(
    undefined,
  )

  const selectedCity = useMemo(
    () => cities.find((c) => c.cityId === selectedCityId),
    [cities, selectedCityId],
  )

  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === selectedBuildingId),
    [buildings, selectedBuildingId],
  )

  return (
    <div ref={wrapRef} className={styles.module1Page}>
      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <ChartPanel className={styles.leftCard} bodyClassName={styles.noPadding}>
            <BuildingCategoryDonut data={buildingCategories} />
          </ChartPanel>

          <ChartPanel bodyClassName={styles.noPadding}>
            <div style={{ padding: 6 }}>
              <DynastyLineChart selectedCityId={selectedCityId} height={280} mode="area" />
            </div>
          </ChartPanel>
        </div>

        <div className={styles.centerCol}>
          <ChartPanel className={styles.leftCard} bodyClassName={styles.noPadding}>
            <ProvinceHeatMap
              cities={cities}
              buildings={buildings}
              selectedCityId={selectedCityId}
              hoveredCityId={hoveredCityId}
              selectedBuildingId={selectedBuildingId}
              hoveredBuildingId={hoveredBuildingId}
              onCityHover={(cityId) => setHoveredCityId(cityId)}
              onCityClick={(cityId) => {
                setSelectedCityId(cityId)
                setSelectedBuildingId(undefined)
              }}
              onBuildingHover={(buildingId) => setHoveredBuildingId(buildingId)}
              onBuildingClick={(buildingId) => {
                const b = buildings.find((x) => x.id === buildingId)
                setSelectedBuildingId(buildingId)
                setSelectedCityId(b?.cityId)
              }}
            />
          </ChartPanel>
        </div>

        <div className={styles.rightCol}>
          <ChartPanel>
            <BuildingInfoPanel city={selectedCity} building={selectedBuilding} />
          </ChartPanel>
        </div>
      </div>

      <div className={styles.bottomWrap}>
        <HeritageRiverTimeline />
      </div>
    </div>
  )
}

