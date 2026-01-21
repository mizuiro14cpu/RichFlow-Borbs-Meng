import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, fn } from '@storybook/test';
import Header, { HeaderProps } from './Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onAddBalanceSheet: { action: 'addBalanceSheet' },
    onToggleBalanceSheet: { action: 'toggleBalanceSheet' },
    onToggleSidebar: { action: 'toggleSidebar' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
    onAddBalanceSheet: fn(),
    onToggleBalanceSheet: fn(),
    balanceSheetExists: false,
    balanceSheetVisible: false,
    hideActions: false,
    onToggleSidebar: fn(),
    sidebarOpen: false,
  },
};

export const CustomTitle: Story = {
  args: {
    ...Default.args,
    title: 'My Custom Page',
  },
};

export const NoActions: Story = {
  args: {
    ...Default.args,
    hideActions: true,
  },
};

export const BalanceSheetExistsVisible: Story = {
  args: {
    ...Default.args,
    balanceSheetExists: true,
    balanceSheetVisible: true,
  },
};

export const BalanceSheetExistsHidden: Story = {
  args: {
    ...Default.args,
    balanceSheetExists: true,
    balanceSheetVisible: false,
  },
};

export const WithSidebarOpen: Story = {
  args: {
    ...Default.args,
    sidebarOpen: true,
  },
};

export const InteractionTest: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Test sidebar toggle
    const sidebarToggle = canvas.getByLabelText('Toggle menu');
    await userEvent.click(sidebarToggle);
    await expect(args.onToggleSidebar).toHaveBeenCalled();

    await sleep(500);

    // Test add balance sheet
    const actionButton = canvas.getByTitle('Add new item');
    await userEvent.click(actionButton);

    await sleep(500);

    const addBalanceSheetButton = canvas.getByText('Add Balance Sheet');
    await userEvent.click(addBalanceSheetButton);
    await expect(args.onAddBalanceSheet).toHaveBeenCalled();
  },
};

export const InteractionTestWithBalanceSheet: Story = {
    args: {
        ...Default.args,
        balanceSheetExists: true,
        balanceSheetVisible: false,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        // Test toggle balance sheet
        const actionButton = canvas.getByTitle('Modify Balance Sheet');
        await userEvent.click(actionButton);

        await sleep(1000);

        const showBalanceSheetButton = canvas.getByText('Show Balance Sheet');
        await userEvent.hover(showBalanceSheetButton)

        await sleep(1000)

        await userEvent.click(showBalanceSheetButton);
        await expect(args.onToggleBalanceSheet).toHaveBeenCalledWith(true);
    },
};



export const SidebarToggleTest: Story = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story, context) => {
      const [isOpen, setIsOpen] = useState(false);
      
      const handleToggle = () => {
        setIsOpen((prev) => !prev);
        context.args.onToggleSidebar?.();
      };

      return (
        <Story
          args={{
            ...context.args,
            sidebarOpen: isOpen,
            onToggleSidebar: handleToggle,
          }}
        />
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const menuButton = canvas.getByLabelText('Toggle menu');

    // Click to Open
    await userEvent.click(menuButton);

    await expect(menuButton).toHaveClass('open');

    await sleep(500);

    // Click to Close
    await userEvent.click(menuButton);
    await expect(menuButton).not.toHaveClass('open');
  },
};