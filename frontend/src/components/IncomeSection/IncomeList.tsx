import React from 'react';
import { IncomeLine } from '../../types/income.types';

export interface Props {
  incomeLines: IncomeLine[];
  onEdit: (income: IncomeLine) => void;
  onDelete: (id: number) => void;
}

const IncomeList: React.FC<Props> = ({ incomeLines, onEdit, onDelete }) => {
  // Group income lines by type
  const groupedIncome = incomeLines.reduce((groups, income) => {
    if (!groups[income.type]) {
      groups[income.type] = [];
    }
    groups[income.type].push(income);
    return groups;
  }, {} as Record<string, IncomeLine[]>);

  // Sort income types in preferred order
  const incomeTypes = ['Earned', 'Portfolio', 'Passive'].filter(
    type => groupedIncome[type]?.length > 0
  );

  if (incomeLines.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-bg)]/50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-card)] mb-4 text-3xl">
          💸
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Income Sources Yet</h3>
        <p className="text-[var(--color-text-dim)] mb-6 max-w-sm mx-auto">
          Start building your wealth column by adding your first income source.
          Remember: The rich buy assets that produce income.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {incomeTypes.map(type => (
        <div key={type} className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-lg transition-transform hover:scale-[1.01] duration-300">
          {/* Header */}
          <div className="px-6 py-4 bg-[rgba(255,255,255,0.03)] border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-8 rounded-full ${
                type === 'Earned' ? 'bg-blue-500' : 
                type === 'Portfolio' ? 'bg-[var(--color-purple)]' : 
                'bg-[var(--color-gold)]'
              }`} />
              <h3 className="text-xl font-bold tracking-tight text-white">
                {type} <span className="text-[var(--color-text-dim)] font-normal opacity-70">Income</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-[var(--color-text-dim)]">Total {type}</span>
              <span className={`font-mono font-bold text-lg ${
                type === 'Earned' ? 'text-blue-400' : 
                type === 'Portfolio' ? 'text-[var(--color-purple-light)]' : 
                'text-[var(--color-gold)]'
              }`}>
                ${groupedIncome[type].reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-[var(--color-border)]">
            {groupedIncome[type].map((income, index) => (
              <div 
                key={income.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                  <div className="w-8 h-8 rounded bg-[var(--color-bg)] flex items-center justify-center text-sm font-bold text-[var(--color-text-dim)]">
                    {index + 1}
                  </div>
                  <div>
                    <span className="block text-[var(--color-text)] font-medium group-hover:text-white transition-colors text-lg">
                      {income.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <span className="font-mono text-xl font-bold text-[var(--color-text)]">
                    ${income.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  
                  <div className="flex gap-2 opacity-100 sm:opacity-0 sm:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                    <button
                      className="p-2 text-[var(--color-text-dim)] hover:text-white hover:bg-[var(--color-purple)] rounded-lg transition-all"
                      onClick={() => onEdit(income)}
                      aria-label="Edit"
                      title="Edit"
                    >
                      <span className="block w-5 h-5 text-center leading-5">✎</span>
                    </button>
                    <button
                      className="p-2 text-[var(--color-text-dim)] hover:text-white hover:bg-red-500 rounded-lg transition-all"
                      onClick={() => {
                        // eslint-disable-next-line no-restricted-globals
                        if (confirm('Delete this income?')) onDelete(income.id);
                      }}
                      aria-label="Delete"
                      title="Delete"
                    >
                      <span className="block w-5 h-5 text-center leading-5">×</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncomeList;