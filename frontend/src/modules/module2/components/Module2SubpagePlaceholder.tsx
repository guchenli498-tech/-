export function Module2SubpagePlaceholder(props: {
  title: string
  subtitle: string
  detail: string
}) {
  return (
    <div style={{ padding: 10, lineHeight: 1.85 }}>
      <div style={{ fontSize: 16, fontWeight: 650, letterSpacing: 1 }}>
        {props.title}
        <span style={{ marginLeft: 10, color: 'var(--muted)', fontWeight: 500, fontSize: 12 }}>
          {props.subtitle}
        </span>
      </div>
      <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 12 }}>{props.detail}</div>
    </div>
  )
}

