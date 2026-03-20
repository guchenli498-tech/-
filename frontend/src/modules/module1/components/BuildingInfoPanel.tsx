import type { BuildingMarker, CityHeatDatum } from '../types'
import { appTheme } from '../../../theme/tokens'

const DEFAULT_OVERVIEW_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#E1F8FA"/>
          <stop offset="1" stop-color="#F7A072"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="600" height="420" rx="26" fill="url(#g)"/>
      <path d="M110 290 C190 170, 280 150, 340 210 C400 270, 490 280, 520 190"
            fill="none" stroke="#4A4A48" stroke-opacity="0.35" stroke-width="6" stroke-linecap="round"/>
      <text x="52" y="130" font-family="serif" font-size="30" fill="#4A4A48" fill-opacity="0.72">徽派建筑</text>
      <text x="52" y="170" font-family="serif" font-size="18" fill="#4A4A48" fill-opacity="0.55">整体脉络 · 山水营建 · 荣衔延续</text>
    </svg>
  `)

export function BuildingInfoPanel(props: {
  city?: CityHeatDatum
  building?: BuildingMarker
  overviewTitle: string
  overviewContent: string
}) {
  const { city, building, overviewTitle, overviewContent } = props

  if (building) {
    return (
      <div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 150,
              height: 110,
              borderRadius: 14,
              border: '1px solid rgba(242,239,233,0.95)',
              overflow: 'hidden',
              background: 'rgba(252,252,252,0.8)',
              flexShrink: 0,
            }}
          >
            <img
              src={building.image}
              alt={building.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 650, letterSpacing: 1 }}>
              {building.name}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6, lineHeight: 1.8 }}>
              <div>{city?.cityName ? `地点：${city.cityName}` : `地点：${building.cityId}`}</div>
              <div>
                {building.type ? `类型：${building.type}` : '类型：—'}
                {building.dynasty ? ` · 朝代：${building.dynasty}` : ''}
              </div>
            </div>
            <div style={{ marginTop: 10, color: appTheme.textSecondary, lineHeight: 1.8 }}>
              {building.summary}
            </div>

            {building.tags?.length ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {building.tags.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: '1px solid rgba(242,239,233,0.95)',
                      background: 'rgba(242,239,233,0.65)',
                      color: 'var(--ink)',
                      fontSize: 12,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  if (city) {
    return (
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>
          {city.cityName}
          <span style={{ color: 'var(--muted)', fontWeight: 500, marginLeft: 10, fontSize: 12 }}>
            （{city.province} · 截止1911总量 {city.totalBefore1911}）
          </span>
        </div>
        <div style={{ marginTop: 12, color: appTheme.textSecondary, lineHeight: 1.8 }}>
          点击城市后，折线图会显示该城市在不同朝代的徽派建筑数量趋势；再次点击重点建筑点位，可切换到建筑叙事介绍。
        </div>
        <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 12, lineHeight: 1.8 }}>
          提示：你也可以在地图上悬停城市/建筑查看名称与数值。
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 150,
            height: 110,
            borderRadius: 14,
            border: '1px solid rgba(242,239,233,0.95)',
            overflow: 'hidden',
            background: 'rgba(252,252,252,0.8)',
            flexShrink: 0,
          }}
        >
          <img
            src={DEFAULT_OVERVIEW_IMAGE}
            alt={overviewTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 650, letterSpacing: 1 }}>{overviewTitle}</div>
          <div style={{ marginTop: 10, color: appTheme.textSecondary, lineHeight: 1.9, fontSize: 13 }}>
            {overviewContent}
          </div>
          <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 12, lineHeight: 1.8 }}>
            点击地图城市进入“历朝数量”联动；点击重点建筑进入“建筑叙事”。
          </div>
        </div>
      </div>
    </div>
  )
}

