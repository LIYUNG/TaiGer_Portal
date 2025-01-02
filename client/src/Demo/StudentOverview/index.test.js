import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StudentOverviewPage from '.';
import 'react-i18next';
import { getAllActiveStudents } from '../../api';
import { useAuth } from '../../components/AuthProvider/index';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { mockSingleData } from '../../test/testingStudentData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('axios');
jest.mock('../../api');

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
        path: '/students-overview/all',
        element: <StudentOverviewPage />,
        errorElement: <div>Error</div>,
        loader: () => {
            return { data: mockSingleData, essays: { data: [] } };
        }
    }
];

describe('StudentOverviewPage', () => {
    window.ResizeObserver = ResizeObserver;
    test('StudentOverview page not crash', async () => {
        getAllActiveStudents.mockResolvedValue({ data: mockSingleData });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });
        const router = createMemoryRouter(routes, {
            initialEntries: ['/students-overview/all']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        await waitFor(() => {
            // TODO
            expect(screen.getByTestId('student_overview')).toHaveTextContent(
                'Agent'
            );
            // expect(1).toBe(1);
        });
    });
});
