export function FermentationZoneStatus({
  zone,
  warning,
}: {
  zone: string
  warning: string | null
}) {
  const capitalizedZone = zone.charAt(0).toUpperCase() + zone.slice(1)

  return (
    <>
      <p role="status">
        Fermentation zone: <strong>{capitalizedZone}</strong>
      </p>
      {warning && <p role="alert">{warning}</p>}
    </>
  )
}
