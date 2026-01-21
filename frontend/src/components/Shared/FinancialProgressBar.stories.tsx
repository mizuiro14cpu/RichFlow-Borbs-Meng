import type { Meta, StoryObj } from '@storybook/react';
import FinancialProgressBar from './FinancialProgressBar';

const meta = {
  title: 'Components/Shared/FinancialProgressBar',
  component: FinancialProgressBar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['gold', 'purple', 'green', 'red'],
    },
    currentValue: { control: 'number' },
    totalValue: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className="w-[450px] p-6 bg-[#0f172a] rounded-xl border border-slate-800/50 shadow-2xl">
        <div className="text-slate-400 text-xs mb-6 uppercase tracking-widest font-semibold">Preview Context</div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FinancialProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. The Standard "Gold" Theme (RichFlow default)
export const DefaultGold: Story = {
  args: {
    label: 'Passive Income Goal',
    currentValue: 2500,
    totalValue: 5000,
    targetLabel: 'of target',
    variant: 'gold',
  },
};

// 2. The "Success" State (Green)
export const GoalReached: Story = {
  args: {
    label: 'Emergency Fund',
    currentValue: 15000,
    totalValue: 10000,
    variant: 'green',
    targetLabel: 'of goal',
    formattedCurrentValue: '$15,000',
  },
};

// 3. The "Danger" State (Red)
export const OverBudget: Story = {
  args: {
    label: 'Discretionary Spending',
    currentValue: 1200,
    totalValue: 800,
    variant: 'red',
    targetLabel: 'of budget',
  },
};

// 4. The "Royal" State (Purple)
export const PortfolioGrowth: Story = {
  args: {
    label: 'Portfolio Value',
    currentValue: 45000,
    totalValue: 100000,
    variant: 'purple',
    targetLabel: 'of milestone',
  },
};
