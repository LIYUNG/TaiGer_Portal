import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './';
import 'react-i18next';
import { getProgramTickets } from '../../api';
import { useAuth } from '../../components/AuthProvider/index';
import { createMemoryRouter } from 'react-router-dom';

import { mockSingleData } from '../../test/testingStudentData';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackBarProvider } from '../../contexts/use-snack-bar';

jest.mock('axios');
jest.mock('../../api');
jest.mock('@mui/x-charts/BarChart', () => ({
    BarChart: jest.fn().mockImplementation(({ children }) => children)
}));
jest.mock('@mui/x-charts/ChartsAxis', () => ({
    axisClasses: jest.fn().mockImplementation(({ children }) => children)
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: { changeLanguage: () => new Promise(() => {}) }
        };
    },
    initReactI18next: { type: '3rdParty', init: () => {} }
}));

jest.mock('../../components/AuthProvider');
const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false // Disable retries for faster tests
            }
        }
    });

const renderWithQueryClient = (ui) => {
    const testQueryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    );
};

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useLoaderData: jest.fn()
// }));

class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

const routes = [
    {
        path: '/dashboard',
        element: (
            <SnackBarProvider>
                <Dashboard />
            </SnackBarProvider>
        ),
        errorElement: <div>Error</div>,
        loader: () => {
            return {
                studentAndEssays: { data: mockSingleData, essays: { data: [] } }
            };
        }
    }
];

describe('Dashboard', () => {
    window.ResizeObserver = ResizeObserver;
    test('agent dashboard not crash', async () => {
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });

        const router = createMemoryRouter(routes, {
            initialEntries: ['/dashboard']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        await waitFor(() => {
            // TODO
            expect(
                screen.getByTestId('dashoboard_component')
            ).toHaveTextContent('Comming soon');
            // expect(1).toBe(1);
        });
    });
});

describe('Student Dashboard', () => {
    test('student dashboard not crash', async () => {
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Student', _id: '6366287a94358b085b0fccf7' }
        });

        const router = createMemoryRouter(routes, {
            initialEntries: ['/dashboard']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        await waitFor(() => {
            // TODO
            expect(
                screen.getByTestId('dashoboard_component')
            ).toHaveTextContent('To Do Tasks');
            // expect(1).toBe(1);
        });
    });
});

describe('Editor Dashboard', () => {
    test('editor dashboard not crash', async () => {
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Editor', _id: '639d192f7b10d10a9b4ac97c' }
        });
        const router = createMemoryRouter(routes, {
            initialEntries: ['/dashboard']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        // Example
        // const buttonElement = screen.getByRole('button');
        // userEvent.click(buttonElement);
        // const outputElement = screen.getByText('good to see you', { exact: false });
        // expect(outputElement).toBeInTheDocument(1);

        await waitFor(() => {
            // TODO
            expect(
                screen.getByTestId('dashoboard_component')
            ).toHaveTextContent('Follow up');
            // expect(1).toBe(1);
        });
    });
});

describe('Admin Dashboard', () => {
    test('admin dashboard not crash', async () => {
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Admin', _id: '609c498ae2f954388837d2f9' }
        });

        const router = createMemoryRouter(routes, {
            initialEntries: ['/dashboard']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        await waitFor(() => {
            // TODO
            expect(
                screen.getByTestId('dashoboard_component')
            ).toHaveTextContent('Admin To Do Tasks');
            // expect(1).toBe(1);
        });
    });
});
