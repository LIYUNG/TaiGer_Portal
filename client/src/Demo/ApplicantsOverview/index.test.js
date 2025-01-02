import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ApplicantsOverview from '.';
import 'react-i18next';
import { getStudents, getProgramTickets } from '../../api';
import { useAuth } from '../../components/AuthProvider/index';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { mockSingleData } from '../../test/testingStudentData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

const routes = [
    {
        path: '/student-applications',
        element: <ApplicantsOverview />,
        errorElement: <div>Error</div>,
        loader: () => {
            return { data: mockSingleData };
        }
    }
];

describe('ApplicantsOverview', () => {
    window.ResizeObserver = ResizeObserver;
    test('ApplicationsOverview not crash', async () => {
        getStudents.mockResolvedValue({ data: mockSingleData });
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });
        const router = createMemoryRouter(routes, {
            initialEntries: ['/student-applications']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(
                screen.getByTestId('application_overview_component')
            ).toHaveTextContent('Agents');
        });
    });

    test('ApplicationsOverview switching tabs not crash', async () => {
        getStudents.mockResolvedValue({ data: mockSingleData });
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });
        const router = createMemoryRouter(routes, {
            initialEntries: ['/student-applications']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        await waitFor(() => {});
        const buttonElement = screen.getByTestId(
            'application_overview_component_application_overview_tab'
        );
        userEvent.click(buttonElement);
        // TODO
        await waitFor(() => {
            // expect(screen.getByTestId('custom_tab_panel-1')).not.toHaveTextContent(
            //   'Weihenstephan-Triesdorf University of Applied Sciences'
            // );
            // expect(screen.getByTestId('custom_tab_panel')).toHaveTextContent(
            //   'Technische Universi'
            // );
        });
    });
});
