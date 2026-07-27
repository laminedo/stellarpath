interface EnergyBarProps {
  label: string;
  value: number; // -1 to 1
  color: string;
}

export function EnergyBar({ label, value, color }: EnergyBarProps) {
  const pct = Math.round(((value + 1) / 2) * 100);
  return (
    <div className="w-full" role="img" aria-label={`${label}: ${pct} percent`}>
      <div className="mb-1 flex justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}
