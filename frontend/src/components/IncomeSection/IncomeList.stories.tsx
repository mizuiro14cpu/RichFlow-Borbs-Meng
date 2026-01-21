import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, fn } from '@storybook/test';
import { useState, useEffect } from 'react';
import IncomeList from './IncomeList';
import { IncomeLine } from '../../types/income.types';

const richDadIncome: IncomeLine[] = [
  { id: 101, name: 'Real Estate Cash Flow', amount: 4500, type: 'Passive' },
  { id: 102, name: 'Book Royalties', amount: 1200, type: 'Passive' },
  { id: 103, name: 'Stock Dividends', amount: 850, type: 'Portfolio' },
  { id: 104, name: 'Business Distributions', amount: 12000, type: 'Passive' },
];

const poorDadIncome: IncomeLine[] = [
  { id: 201, name: 'School Teacher Salary', amount: 3500, type: 'Earned' },
  { id: 202, name: 'Private Tutoring', amount: 400, type: 'Earned' },
  { id: 203, name: 'Bank Interest (Savings)', amount: 2.50, type: 'Portfolio' },
];

const meta = {
  title: 'Components/Income/IncomeList',
  component: IncomeList,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark', // Because the app is dark themed
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' },
  },
  // Wrapper to ensure it has some width context
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px', background: '#000' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IncomeList>;

export default meta;
type Story = StoryObj<typeof meta>;


export const WealthyProfile: Story = {
  args: {
    incomeLines: richDadIncome,
    onEdit: () => {},
    onDelete: () => {},
  },
};

// 2. The "Employee" Profile (Heavy on Earned)
export const EmployeeProfile: Story = {
  args: {
    incomeLines: poorDadIncome,
    onEdit: () => {},
    onDelete: () => {},
  },
};

// 3. Mixed Income
export const MixedProfile: Story = {
  args: {
    incomeLines: [...richDadIncome.slice(0, 1), ...poorDadIncome.slice(0, 1)],
    onEdit: () => {},
    onDelete: () => {},
  },
};

// 4. Empty State
export const NoIncome: Story = {
  args: {
    incomeLines: [],
    onEdit: () => {},
    onDelete: () => {},
  },
};

/**
 * Interaction Test Story for Play Function
 * This uses the 'play' function to simulate user behavior.
 * We use a custom 'render' function here to simulate the state change (deletion) visually.
 */
export const InteractiveDeleteTest: Story = {
  args: {
    incomeLines: richDadIncome.slice(0, 1),
    onDelete: fn(),
    onEdit: fn(),
  },
  render: (args) => {
    // We maintain local state in the story to visually show the deletion
    const [items, setItems] = useState(args.incomeLines);

    // Sync with args if they change (standard storybook practice)
    useEffect(() => {
      setItems(args.incomeLines);
    }, [args.incomeLines]);

    const handleDelete = (id: number) => {
      // 1. Fire the action so the 'Actions' panel logs it
      args.onDelete(id);
      // 2. Visually remove the item
      setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return <IncomeList {...args} incomeLines={items} onDelete={handleDelete} />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    window.confirm = () => true;

    await sleep(500);

    const rowText = canvas.getByText('Real Estate Cash Flow');
    await expect(rowText).toBeInTheDocument();

    // Hover row to reveal buttons
    await userEvent.hover(rowText);
    await sleep(800);

    // Hover delete button
    const deleteBtn = canvas.getByTitle('Delete');
    await userEvent.hover(deleteBtn);
    await sleep(800);

    // Click Delete
    await userEvent.click(deleteBtn);

    // Verify callback
    await expect(args.onDelete).toHaveBeenCalled();
    
    // Verify visual removal (wait specifically for it to be removed from the DOM)
    // We use queryByText which returns null if not found, instead of throwing
    await sleep(500); // Wait for React re-render
    const deletedRow = canvas.queryByText('Real Estate Cash Flow');
    await expect(deletedRow).not.toBeInTheDocument();
  },
};
