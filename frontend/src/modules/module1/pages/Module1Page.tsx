import { useMemo, useState } from 'react'
import { ChartPanel } from '../../../components/common/ChartPanel/ChartPanel'
import { ProvinceHeatMap } from '../components/ProvinceHeatMap'
import { DynastyLineChart } from '../components/DynastyLineChart'
import { BuildingInfoPanel } from '../components/BuildingInfoPanel'
import { BuildingCategoryDonut } from '../components/BuildingCategoryDonut'
import { RegionInsetMap } from '../components/RegionInsetMap'
import { Module1BottomNarrativePanel } from '../components/Module1BottomNarrativePanel'
import type { BuildingCategoryDatum, BuildingMarker, CityDynastySeries, CityHeatDatum } from '../types'
import citiesJson from '../data/cities.json'
import dynastySeriesJson from '../data/dynasty-series.json'
import buildingMarkersJson from '../data/building-markers.json'
import buildingCategoriesJson from '../data/building-categories.json'
import { module1Overview } from '../data/overview'
import styles from './Module1Page.module.css'

export function Module1Page() {
  const cities = citiesJson as CityHeatDatum[]
  const dynastySeries = dynastySeriesJson as CityDynastySeries[]
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

  const activeLine = useMemo(
    () => dynastySeries.find((s) => s.cityId === selectedCityId),
    [dynastySeries, selectedCityId],
  )
  const lineForChart = activeLine ?? dynastySeries[0]

  const overallTotal = useMemo(() => {
    return cities.reduce((sum, c) => sum + c.totalBefore1911, 0)
  }, [cities])

  return (
    <div className={styles.module1Page}>
      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <ChartPanel className={styles.leftCard} bodyClassName={styles.noPadding}>
            <BuildingCategoryDonut data={buildingCategories} />
          </ChartPanel>

          <ChartPanel bodyClassName={styles.noPadding}>
            <div style={{ padding: 6 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 6 }}>
                城市历朝徽派建筑数量变化 · 点击地图城市联动
                <span style={{ marginLeft: 10, color: 'rgba(74,74,72,0.65)' }}>
                  截止1911总量：{overallTotal}
                </span>
              </div>
              <DynastyLineChart data={lineForChart} height={200} mode="area" />
            </div>
          </ChartPanel>
        </div>

        <div className={styles.centerCol}>
          <div className={styles.centerInset}>
            <RegionInsetMap cities={cities} buildings={buildings} selectedCityId={selectedCityId} />
          </div>

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
            <BuildingInfoPanel
              overviewTitle={module1Overview.title}
              overviewContent={module1Overview.content}
              city={selectedCity}
              building={selectedBuilding}
            />
          </ChartPanel>
        </div>
      </div>

      <div className={styles.bottomWrap}>
        <Module1BottomNarrativePanel />
      </div>
    </div>
  )
}

