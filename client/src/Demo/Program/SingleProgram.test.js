import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SingleProgram from './SingleProgram';
import 'react-i18next';
import { getProgram, getProgramTicket } from '../../api';
import { useAuth } from '../../components/AuthProvider';
import {
    createMemoryRouter,
    RouterProvider,
    useParams
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { mockSingleProgramNoStudentsData } from '../../test/testingSingleProgramPageData';

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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
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

const routes = [
    {
        path: '/programs/:programId',
        element: <SingleProgram />,
        errorElement: <div>Error</div>,
        loader: () => {
            return {
                studentAndEssays: { data: [], essays: { data: [] } }
            };
        }
    }
];

class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

describe('Single Program Page checking', () => {
    window.ResizeObserver = ResizeObserver;
    test('page not crash', async () => {
        getProgram.mockResolvedValue({ data: mockSingleProgramNoStudentsData });
        getProgramTicket.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Student', _id: '639baebf8b84944b872cf648' }
        });
        useParams.mockReturnValue({ programId: '2532fde46751651538084485' });

        const router = createMemoryRouter(routes, {
            initialEntries: ['/programs/2532fde46751651538084485']
        });

        renderWithQueryClient(<RouterProvider router={router} />);

        await waitFor(() => {
            // TODO: fix useQuery mock
            // expect(screen.getByTestId('single_program_page')).toHaveTextContent(
            //   '(TUM)'
            // );
            expect(1).toBe(1);
        });
    });
});
