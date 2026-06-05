"use client";

interface Props {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 120 }: Props) {
  const r = size / 2 - 10;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981";
  const label = score < 40 ? "Needs rework" : score < 70 ? "Getting there" : "Review ready";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="8"
          className="fill-none stroke-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: `rotate(90deg)`,
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fill: color,
            fontSize: size * 0.22,
            fontWeight: 700,
          }}
        >
          {score}
        </text>
      </svg>
      <p className="text-sm font-semibold" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
