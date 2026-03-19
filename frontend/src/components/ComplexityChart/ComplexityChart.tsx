import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { ComplexityInfo } from '../../types/review.types';
import { getCyclomaticLabel, getCyclomaticColor } from '../../utils/formatResponse';
import { Activity } from 'lucide-react';

interface ComplexityChartProps {
  complexity: ComplexityInfo;
}

const COMPLEXITY_ORDER = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)', 'O(n!)'];

function complexityToScore(notation: string): number {
  const idx = COMPLEXITY_ORDER.indexOf(notation);
  if (idx === -1) return 50;
  // Map 0..7 → 100..5 (lower complexity = higher score)
  return Math.max(5, 100 - idx * 14);
}

function complexityColor(notation: string): string {
  const idx = COMPLEXITY_ORDER.indexOf(notation);
  if (idx <= 1) return '#22c55e';
  if (idx <= 3) return '#eab308';
  if (idx <= 5) return '#f97316';
  return '#ef4444';
}

export function ComplexityChart({ complexity }: ComplexityChartProps) {
  const timeScore = complexityToScore(complexity.time);
  const spaceScore = complexityToScore(complexity.space);
  const timeColor = complexityColor(complexity.time);

  const chartData = [
    { name: 'Time', value: timeScore, fill: timeColor },
    { name: 'Space', value: spaceScore, fill: '#3b82f6' },
  ];

  const cyclomaticMax = 30;
  const cyclomaticPct = Math.min(100, (complexity.cyclomatic / cyclomaticMax) * 100);

  return (
    <div className="panel">
      <div className="panel-header">
        <Activity size={14} className="text-brand-400" />
        <span className="text-xs font-medium text-surface-100">Complexity Analysis</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Radial chart */}
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="30%" outerRadius="90%"
              data={chartData}
              startAngle={90} endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{ fill: '#21262d' }} cornerRadius={4} />
              <Tooltip
                contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#8b949e' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-700/50 rounded-lg p-3 border border-surface-400/30 space-y-1">
            <p className="text-xs text-surface-200">Time</p>
            <p className="text-lg font-mono font-semibold" style={{ color: timeColor }}>
              {complexity.time}
            </p>
          </div>
          <div className="bg-surface-700/50 rounded-lg p-3 border border-surface-400/30 space-y-1">
            <p className="text-xs text-surface-200">Space</p>
            <p className="text-lg font-mono font-semibold text-blue-400">{complexity.space}</p>
          </div>
        </div>

        {/* Cyclomatic complexity bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-surface-200">Cyclomatic Complexity</span>
            <span className={`text-xs font-mono font-medium ${getCyclomaticColor(complexity.cyclomatic)}`}>
              {complexity.cyclomatic} — {getCyclomaticLabel(complexity.cyclomatic)}
            </span>
          </div>
          <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${cyclomaticPct}%`,
                background: complexity.cyclomatic <= 10 ? '#22c55e' : complexity.cyclomatic <= 20 ? '#f97316' : '#ef4444',
              }}
            />
          </div>
        </div>

        {/* LOC */}
        <div className="flex justify-between text-xs">
          <span className="text-surface-200">Lines of Code</span>
          <span className="font-mono text-surface-100">{complexity.linesOfCode}</span>
        </div>

        {/* Details */}
        <p className="text-xs text-surface-200 leading-relaxed border-t border-surface-400/30 pt-3">
          {complexity.details}
        </p>
      </div>
    </div>
  );
}
