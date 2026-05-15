interface ResourceBarProps {
  value: number;
  color?: string;
  height?: number;
  animate?: boolean;
}

const ResourceBar = ({ value = 0, color = 'green', height = 8, animate = true }: ResourceBarProps) => {
  const safeValue = Math.min(Math.max(value, 0), 100);

  const colorMap: Record<string, string> = {
    green: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-400',
    amber: 'bg-gradient-to-r from-amber-500 to-amber-400',
    red: 'bg-gradient-to-r from-red-500 to-red-400',
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-400',
    dynamic: safeValue < 50 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : safeValue < 75 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-red-500 to-red-400',
  };

  const barColor = color === 'dynamic' ? colorMap.dynamic : (colorMap[color] || colorMap.green);

  return (
    <div className="w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden" style={{ height: `${height}px` }}>
      <div
        className={`h-full rounded-full ${barColor} ${animate ? 'transition-all duration-700 ease-out' : ''}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

export default ResourceBar;
