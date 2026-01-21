import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import FinancialTable, { ColumnDefinition, FinancialTableProps } from './FinancialTable';

// Define the shape of our mock data
interface MockTransaction {
  id: string;
  description: string;
  category: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Cleared';
}

const mockTransactions: MockTransaction[] = [
  { id: '1', description: 'Apple Store', category: 'Electronics', amount: '$1,299.00', date: '2023-11-20', status: 'Cleared' },
  { id: '2', description: 'Whole Foods Market', category: 'Groceries', amount: '$142.50', date: '2023-11-21', status: 'Cleared' },
  { id: '3', description: 'Uber Trip', category: 'Transport', amount: '$24.00', date: '2023-11-22', status: 'Pending' },
  { id: '4', description: 'Netflix Subscription', category: 'Entertainment', amount: '$15.99', date: '2023-11-01', status: 'Cleared' },
];

const columns: ColumnDefinition<MockTransaction>[] = [
  { header: 'Description', accessor: 'description', align: 'left' },
  { header: 'Category', accessor: 'category', align: 'left' },
  { header: 'Date', accessor: 'date', align: 'center' },
  { 
    header: 'Status', 
    accessor: (item) => (
      <span style={{ 
        color: item.status === 'Pending' ? '#edca69' : '#4ade80',
        fontWeight: 'bold'
      }}>
        {item.status}
      </span>
    ), 
    align: 'center' 
  },
  { header: 'Amount', accessor: 'amount', align: 'right' },
];

const meta: Meta<FinancialTableProps<MockTransaction>> = {
  title: 'Components/Shared/FinancialTable',
  component: FinancialTable as unknown as React.ComponentType<FinancialTableProps<MockTransaction>>,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Standard Table with footer
export const TransactionHistory: Story = {
  args: {
    title: 'Recent Transactions',
    data: mockTransactions,
    columns: columns,
    footer: { label: 'Total', value: '$1,481.49' },
    onEdit: () => {},
    onDelete: () => {},
  },
};

// 2. Read-Only (No Actions)
export const ReadOnlyView: Story = {
  args: {
    title: 'Archived Records',
    data: mockTransactions.slice(0, 2),
    columns: columns,
    // No edit/delete handlers passed
  },
};

// 3. Compact Mode (Good for dashboards)
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Quick Glance',
    data: mockTransactions.slice(0, 3),
    columns: [
      { header: 'Desc', accessor: 'description' },
      { header: 'Amt', accessor: 'amount', align: 'right' }
    ],
    compactHeader: true,
    noCard: true, 
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', border: '1px solid #333', padding: '10px' }}>
        <Story />
      </div>
    )
  ]
};

// 4. Empty State
export const NoData: Story = {
  args: {
    title: 'Search Results',
    data: [],
    columns: columns,
    emptyMessage: 'No transactions found matching your criteria.',
  },
};
