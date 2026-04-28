export default function RoadMotif({ className = '' }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="48"
      viewBox="0 0 400 48"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.08 }}
    >
      <line x1="0" y1="8" x2="400" y2="8" stroke="#f97316" strokeWidth="2" />
      <line x1="0" y1="40" x2="400" y2="40" stroke="#f97316" strokeWidth="2" />
      <line
        x1="0"
        y1="24"
        x2="400"
        y2="24"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="24 16"
      />
    </svg>
  )
}
