import { cn, formatCurrency } from '@/lib/utils'

/**
 * BalanceChart - упрощённый график баланса в стиле Сбербанка
 * 
 * @example
 * // Базовое использование
 * <BalanceChart data={chartData} />
 * 
 * // С заголовком
 * <BalanceChart data={chartData} title="Динамика баланса" />
 * 
 * // С периодом
 * <BalanceChart data={chartData} period="Последние 30 дней" />
 * 
 * // Разные цвета
 * <BalanceChart data={chartData} color="sber" />
 * <BalanceChart data={chartData} color="blue" />
 */

export interface ChartDataPoint {
  /** Дата/метка */
  label: string
  /** Значение */
  value: number
  /** Полная дата для tooltip */
  fullDate?: string
}

export interface BalanceChartProps {
  /** Данные для графика */
  data: ChartDataPoint[]
  /** Заголовок */
  title?: string
  /** Период */
  period?: string
  /** Цвет графика */
  color?: 'sber' | 'blue' | 'purple' | 'orange'
  /** Высота графика */
  height?: number
  /** Показывать ли сетку */
  showGrid?: boolean
  /** Показывать ли легенду */
  showLegend?: boolean
  /** Формат валюты */
  currency?: string
  /** Дополнительные классы */
  className?: string
}

const colorSchemes = {
  sber: {
    line: '#21A038',
    area: 'rgba(33, 160, 56, 0.1)',
    gradient: ['#21A038', '#1A8030'],
  },
  blue: {
    line: '#007AFF',
    area: 'rgba(0, 122, 255, 0.1)',
    gradient: ['#007AFF', '#0051D5'],
  },
  purple: {
    line: '#AF52DE',
    area: 'rgba(175, 82, 222, 0.1)',
    gradient: ['#AF52DE', '#8944AB'],
  },
  orange: {
    line: '#FF9500',
    area: 'rgba(255, 149, 0, 0.1)',
    gradient: ['#FF9500', '#CC7700'],
  },
}

export function BalanceChart({
  data,
  title,
  period,
  color = 'sber',
  height = 200,
  showGrid = true,
  showLegend = true,
  currency = 'RUB',
  className,
}: BalanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn('rounded-2xl bg-white p-5 border border-gray-100', className)}>
        {title && <h3 className="text-h4 font-semibold text-dark mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[200px] text-gray-400">
          Нет данных для отображения
        </div>
      </div>
    )
  }

  const colors = colorSchemes[color]
  
  // Находим min/max для масштабирования
  const values = data.map(d => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const valueRange = maxValue - minValue || 1
  
  // Добавляем отступы
  const chartMin = minValue - valueRange * 0.1
  const chartMax = maxValue + valueRange * 0.1
  const chartRange = chartMax - chartMin

  // Создаём точки для SVG path
  const width = 100 // Используем проценты
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width
    const y = 100 - ((point.value - chartMin) / chartRange) * 100
    return { x, y, value: point.value, label: point.label }
  })

  // Создаём path для линии
  const linePath = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  // Создаём path для области под графиком
  const areaPath = `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`

  // Горизонтальные линии сетки
  const gridLines = [0, 25, 50, 75, 100]

  return (
    <div className={cn('rounded-2xl bg-white p-5 border border-gray-100', className)}>
      {/* Header */}
      {(title || period) && (
        <div className="flex items-center justify-between mb-6">
          {title && <h3 className="text-h4 font-semibold text-dark">{title}</h3>}
          {period && <span className="text-body-sm text-gray-500">{period}</span>}
        </div>
      )}

      {/* Chart */}
      <div className="relative" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full overflow-visible"
        >
          {/* Grid lines */}
          {showGrid && gridLines.map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#E0E0E0"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* Area under line */}
          <path
            d={areaPath}
            fill={colors.area}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={colors.line}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill={colors.line}
              stroke="white"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Tooltip on hover (simplified) */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-caption text-gray-400 pt-2">
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((point, i) => (
            <span key={i}>{point.label}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div>
            <p className="text-caption text-gray-500">Текущий баланс</p>
            <p className="text-h3 font-bold text-dark">
              {formatCurrency(data[data.length - 1].value, currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-caption text-gray-500">Изменение</p>
            <p className={cn(
              'text-body font-semibold',
              data[data.length - 1].value >= data[0].value ? 'text-sber' : 'text-error'
            )}>
              {data[data.length - 1].value >= data[0].value ? '+' : ''}
              {formatCurrency(data[data.length - 1].value - data[0].value, currency)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Мини-версия графика для дашборда
export interface MiniChartProps {
  data: number[]
  color?: 'sber' | 'blue' | 'purple' | 'orange'
  className?: string
}

export function MiniChart({ data, color = 'sber', className }: MiniChartProps) {
  if (!data || data.length === 0) return null

  const colors = colorSchemes[color]
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const isPositive = data[data.length - 1] >= data[0]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg viewBox="0 0 100 30" className="w-20 h-6" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={isPositive ? colors.line : '#FF3B30'}
          strokeWidth="2"
          points={points}
        />
      </svg>
      <span className={cn(
        'text-caption font-medium',
        isPositive ? 'text-sber' : 'text-error'
      )}>
        {isPositive ? '↗' : '↘'}
      </span>
    </div>
  )
}
