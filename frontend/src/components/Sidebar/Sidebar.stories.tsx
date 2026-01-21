import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within, expect } from '@storybook/test';
import Sidebar from './Sidebar';
import { AuthProvider } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

const meta = {
    title: 'Components/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    argTypes: {
        onOpenAssistant: { action: 'openAssistant' },
        onOpenActivity: { action: 'openActivity' },
        onToggleSidebar: { action: 'toggleSidebar' },
    },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeWithMockAuth = (initialEntries: string[]) => (StoryComponent: any) => {
    React.useEffect(() => {
        const originalFetch = (globalThis as any).fetch;

        try {
            localStorage.setItem('hasSession', 'true');
        } catch { }

        (globalThis as any).fetch = async (input: RequestInfo, init?: RequestInit) => {
            const url = typeof input === 'string' ? input : (input as Request).url;

            if (url.endsWith('/auth/refresh')) {
                return new Response(JSON.stringify({ accessToken: 'fake-token' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            if (url.endsWith('/auth/profile') || url.includes('/auth/profile')) {
                return new Response(JSON.stringify({ user: { id: 1, name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date().toISOString() } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            if (url.endsWith('/auth/logout')) {
                return new Response(null, { status: 200 });
            }

            return originalFetch ? originalFetch(input, init) : new Response(null, { status: 404 });
        };

        return () => {
            try {
                localStorage.removeItem('hasSession');
            } catch { }
            (globalThis as any).fetch = originalFetch;
        };
    }, []);

    return (
        <MemoryRouter initialEntries={initialEntries}>
            <AuthProvider>
                <div style={{ width: 320 }}>
                    <StoryComponent />
                </div>
            </AuthProvider>
        </MemoryRouter>
    );
};

const WithMockAuth = makeWithMockAuth(['/']);
const WithMockAuthAnalysis = makeWithMockAuth(['/analysis']);
const WithMockAuthDashboard = makeWithMockAuth(['/dashboard']);

export const Default: Story = {
    decorators: [WithMockAuth],
    args: {
        mobileOpen: false,
        onOpenAssistant: fn(),
        onOpenActivity: fn(),
        onToggleSidebar: fn(),
    },
};

export const MobileOpen: Story = {
    decorators: [WithMockAuth],
    args: {
        ...Default.args,
        mobileOpen: true,
    },
};

export const AnalysisPage: Story = {
    decorators: [WithMockAuthAnalysis],
    args: {
        ...Default.args,
        mobileOpen: true,
    },
};

export const AnalysisNavigationTest: Story = {
    decorators: [WithMockAuthDashboard],
    args: {
        ...Default.args,
        mobileOpen: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        await sleep(1500);
        // click analysis btn
        const analysisButton = canvas.getByText('Analysis');
        await userEvent.click(analysisButton);

        await sleep(1000);

        await canvas.findByText('Dashboard');

        // check if sidebar content changes
        await expect(canvas.queryByText('Saki Assistant')).toBeNull();
        await expect(canvas.queryByText('Recent Activity')).toBeNull();
    },
};
