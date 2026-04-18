import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-gray-100 shadow-sm',
      padding && 'p-6',
      className
    )}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'emerald' | 'amber' | 'red' | 'blue' | 'purple';
  suffix?: string;
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
  red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', text: 'text-red-600' },
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
};

export function StatCard({ title, value, icon, trend, color = 'indigo', suffix }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn('rounded-2xl p-5 border border-gray-100 shadow-sm bg-white relative overflow-hidden')}>
      <div className={cn('absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -mr-10 -mt-10', c.bg)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString('fr-MA') : value}
            {suffix && <span className="text-base font-normal text-gray-500 ml-1">{suffix}</span>}
          </p>
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium',
              trend.value >= 0 ? 'text-emerald-600' : 'text-red-600')}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', c.icon)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
