export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="50,5 90,25 90,75 50,95 10,75 10,25"
        stroke="#d4a373"
        strokeWidth="2"
        fill="none"
      />
      <polygon
        points="50,20 75,35 75,65 50,80 25,65 25,35"
        stroke="#d4a373"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <line x1="50" y1="5" x2="50" y2="20" stroke="#d4a373" strokeWidth="1" opacity="0.4" />
      <line x1="90" y1="25" x2="75" y2="35" stroke="#d4a373" strokeWidth="1" opacity="0.4" />
      <line x1="90" y1="75" x2="75" y2="65" stroke="#d4a373" strokeWidth="1" opacity="0.4" />
      <line x1="50" y1="95" x2="50" y2="80" stroke="#d4a373" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="75" x2="25" y2="65" stroke="#d4a373" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="25" x2="25" y2="35" stroke="#d4a373" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}
