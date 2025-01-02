import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CVMLRLCenter from '.';
import 'react-i18next';
import { getCVMLRLOverview, getAllActiveEssays } from '../../api';
import { useAuth } from '../../components/AuthProvider/index';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { mockSingleStudentCVMLRLFormatData } from '../../test/testingStudentDataCVMLRLCenter';

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

class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

const routes = [
    {
        path: '/cv-ml-rl-center',
        element: <CVMLRLCenter />,
        errorElement: <div>Error</div>
    }
];

describe('CVMLRLCenter', () => {
    window.ResizeObserver = ResizeObserver;
    test('Agent: cvmlrl center not crash', async () => {
        getCVMLRLOverview.mockResolvedValue({
            data: mockSingleStudentCVMLRLFormatData
        });
        getAllActiveEssays.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });
        const router = createMemoryRouter(routes, {
            initialEntries: ['/cv-ml-rl-center']
        });
        render(<RouterProvider router={router} />);

        // Example
        // const buttonElement = screen.getByRole('button');
        // userEvent.click(buttonElement);
        // const outputElement = screen.getByText('good to see you', { exact: false });
        // expect(outputElement).toBeInTheDocument(1);

        await waitFor(() => {
            expect(
                screen.getByTestId('cvmlrlcenter_component')
            ).toHaveTextContent('Testing-Student');
            // Show attributes of students
            // expect(screen.getByTestId('chip-Demanding')).toBeInTheDocument();
        });
    });

    test('Student: cvmlrl center not crash', async () => {
        getCVMLRLOverview.mockResolvedValue({
            data: mockSingleStudentCVMLRLFormatData
        });
        getAllActiveEssays.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Student', _id: '6366287a94358b085b0fccf7' }
        });
        const router = createMemoryRouter(routes, {
            initialEntries: ['/cv-ml-rl-center']
        });
        render(<RouterProvider router={router} />);

        // Example
        // const buttonElement = screen.getByRole('button');
        // userEvent.click(buttonElement);
        // const outputElement = screen.getByText('good to see you', { exact: false });
        // expect(outputElement).toBeInTheDocument(1);

        await waitFor(() => {
            expect(
                screen.getByTestId('cvmlrlcenter_component')
            ).toHaveTextContent('若您為初次使用');

            // Not show attributes
            // expect(
            //   screen.getByTestId('cvmlrlcenter_component')
            // ).not.toHaveTextContent('U');
        });
    });
});
