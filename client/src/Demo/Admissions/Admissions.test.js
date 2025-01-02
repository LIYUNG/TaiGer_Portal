import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Admissions from './Admissions';
import 'react-i18next';
import { getAdmissions } from '../../api';
import { useAuth } from '../../components/AuthProvider';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { mockAdmissionsData } from '../../test/testingAdmissionsData';

jest.mock('axios');
jest.mock('../../api', () => ({
    ...jest.requireActual('../../api'),
    getAdmissions: jest.fn()
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

describe('Admissions page checking', () => {
    window.ResizeObserver = ResizeObserver;
    test('Admissions page not crash', async () => {
        getAdmissions.mockResolvedValue({ data: mockAdmissionsData });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });
        renderWithQueryClient(
            <MemoryRouter>
                <Admissions />
            </MemoryRouter>
        );

        await waitFor(() => {
            // TODO
            expect(screen.getByTestId('admissinos_page')).toHaveTextContent(
                'Admissions'
            );
        });
    });
});
