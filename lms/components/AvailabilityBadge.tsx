export function AvailabilityBadge({ available }: { available: number }) {
  const color = available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  const label = available > 0 ? 'Available' : 'Unavailable'
  return <span className={`inline-block px-2 py-0.5 rounded text-xs ${color}`}>{label} ({available})</span>
}
