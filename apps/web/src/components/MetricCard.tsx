'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'red' | 'yellow';
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  color,
}: MetricCardProps) {
  const bgColor = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  }[color];

  const iconColor = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  }[color];

  return (
    <div className={`${bgColor} border rounded-lg p-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        <div className={`${iconColor} text-2xl`}>{icon}</div>
      </div>
    </div>
  );
}
