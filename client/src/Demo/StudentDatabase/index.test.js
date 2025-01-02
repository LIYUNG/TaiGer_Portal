import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StudentDatabase from '.';
import 'react-i18next';
import { getProgramTickets } from '../../api';
import { useAuth } from '../../components/AuthProvider/index';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { mockSingleData } from '../../test/testingStudentData';
import {
    useQuery,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';

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
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn()
}));

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
        path: '/student-database',
        element: <StudentDatabase />,
        errorElement: <div>Error</div>,
        loader: () => {
            return { data: mockSingleData, essays: { data: [] } };
        }
    }
];

describe('StudentDatabase', () => {
    window.ResizeObserver = ResizeObserver;
    test('Student dashboard not crash', async () => {
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });

        useQuery.mockImplementation(() => ({
            data: mockSingleData,
            isLoading: false,
            isError: false
        }));

        const router = createMemoryRouter(routes, {
            initialEntries: ['/student-database']
        });
        renderWithQueryClient(<RouterProvider router={router} />);

        // Example
        // const buttonElement = screen.getByRole('button');
        // userEvent.click(buttonElement);
        // const outputElement = screen.getByText('good to see you', { exact: false });
        // expect(outputElement).toBeInTheDocument(1);

        await waitFor(() => {
            // TODO
            expect(screen.getByTestId('student_datdabase')).toHaveTextContent(
                'Agents'
            );
            // expect(1).toBe(1);
        });
    });
});
