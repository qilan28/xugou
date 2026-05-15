import { ReactNode } from 'react';

interface StatusItem {
  icon: ReactNode;
  label: string;
  value: number;
  bgColor?: string;
  iconColor?: string;
}

interface StatusSummaryCardProps {
  title: string;
  items: StatusItem[];
}

const StatusSummaryCard = ({ title, items }: StatusSummaryCardProps) => {
  return (
    <div className="glass relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 rounded-r-sm" />
      <div className="p-5">
        <h3 className="text-base font-semibold mb-3 text-slate-900 dark:text-white">{title}</h3>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between px-3 py-2.5 rounded-lg"
              style={{ backgroundColor: item.bgColor || 'rgba(148,163,184,0.1)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/60 dark:bg-white/10"
                  style={{ color: item.iconColor }}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: item.iconColor || '#64748b' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusSummaryCard;
