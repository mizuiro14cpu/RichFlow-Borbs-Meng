import React from 'react';

/**
 * Props for the FinancialProgressBar component
 */
export interface FinancialProgressBarProps {
  /** Label describing what the progress bar represents */
  label: string;
  /** Current value (numerator) */
  currentValue: number;
  /** Total/target value (denominator) */
  totalValue: number;
  /** Currency symbol to display (e.g., "$", "€", "₱") */
  currencySymbol?: string;
  /** Optional formatted current value string (if you want custom formatting) */
  formattedCurrentValue?: string;
  /** Optional formatted total value string (if you want custom formatting) */
  formattedTotalValue?: string;
  /** Optional label for the target (e.g., "of Total Expenses") */
  targetLabel?: string;
  /** Optional custom class name */
  className?: string;
  /** Color variant for the progress fill */
  variant?: 'gold' | 'purple' | 'green' | 'red';
  /** Whether to show the percentage text */
  showPercentage?: boolean;
  /** Whether to show the current value */
  showCurrentValue?: boolean;
  /** Whether to show the target value */
  showTargetValue?: boolean;
}

/**
 * A reusable progress bar component for financial metrics.
 * 
 * Features:
 * - Calculates percentage automatically (capped at 100%)
 * - Gold/black aesthetic matching the application theme
 * - Customizable labels and formatting
 * - Multiple color variants
 * 
 * @example
 * ```tsx
 * <FinancialProgressBar
 *   label="Passive Income"
 *   currentValue={5000}
 *   totalValue={10000}
 *   currencySymbol="$"
 *   targetLabel="of Total Expenses"
 * />
 * ```
 */
const FinancialProgressBar: React.FC<FinancialProgressBarProps> = ({
  label,
  currentValue,
  totalValue,
  currencySymbol = '$',
  formattedCurrentValue,
  formattedTotalValue,
  targetLabel = 'of target',
  className = '',
  variant = 'gold',
  showPercentage = true,
  showCurrentValue = true,
  showTargetValue = true,
}) => {
  // Calculate percentage (0-100), handle division by zero
  const percentage = totalValue > 0 
    ? Math.min(100, Math.round((currentValue / totalValue) * 100)) 
    : 0;

  // Format values if not provided
  const displayCurrentValue = formattedCurrentValue ?? `${currencySymbol}${currentValue.toLocaleString()}`;
  const displayTotalValue = formattedTotalValue ?? `${currencySymbol}${totalValue.toLocaleString()}`;

  // Get specific color values
  const getColorValues = () => {
    switch (variant) {
      case 'purple':
        return { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)', fill: '#a855f7', shadow: 'rgba(168, 85, 247, 0.5)' };
      case 'green':
        return { text: '#4ade80', bg: 'rgba(74, 222, 128, 0.2)', fill: '#4ade80', shadow: 'rgba(74, 222, 128, 0.5)' };
      case 'red':
        return { text: '#f87171', bg: 'rgba(248, 113, 113, 0.2)', fill: '#f87171', shadow: 'rgba(248, 113, 113, 0.5)' };
      case 'gold':
      default:
        // Using hex for gold to ensure consistency if var isn't available
        return { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)', fill: '#fbbf24', shadow: 'rgba(251, 191, 36, 0.5)' };
    }
  };

  const colors = getColorValues();

  return (
    <div className={`w-full ${className}`.trim()}>
      {/* Header: Label and Current Value */}
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-[var(--color-text-dim)] uppercase tracking-wide opacity-80">
          {label}
        </span>
        {showCurrentValue && (
          <span 
            className="text-lg font-bold font-mono tracking-tight"
            style={{ color: colors.text }}
          >
            {displayCurrentValue}
          </span>
        )}
      </div>

      {/* Progress Track */}
      <div 
        className="relative w-full h-3 rounded-full overflow-hidden backdrop-blur-sm"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Progress Fill */}
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${percentage}%`,
            backgroundColor: colors.fill,
            boxShadow: `0 0 10px ${colors.shadow}`,
          }}
        >
          {/* Shimmer Effect */}
          <div 
            className="absolute top-0 left-0 bottom-0 right-0 w-full h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transform: 'skewX(-20deg)',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>

      {/* Footer: Percentage and Target */}
      <div className="flex justify-between items-center mt-2 text-xs">
        {showPercentage && (
          <span 
            className="font-bold py-0.5 px-1.5 rounded"
            style={{ 
              color: colors.text, 
              backgroundColor: colors.bg 
            }}
          >
            {percentage}%
          </span>
        )}
        {showTargetValue && (
          <span className="text-[var(--color-text-dim)] flex items-center gap-1">
            <span className="opacity-70">{targetLabel}</span>
            <span className="font-medium text-white/50">{displayTotalValue}</span>
          </span>
        )}
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          50% { transform: translateX(150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
};

export default FinancialProgressBar;
