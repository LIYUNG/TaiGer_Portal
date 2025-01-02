import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ArchivStudents from '.';
import 'react-i18next';
import { getArchivStudents } from '../../api';
import { useAuth } from '../../components/AuthProvider/index';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { mockSingleArchivStudentData } from '../../test/testingArchivStudentData';

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
        path: '/archiv/students',
        element: <ArchivStudents />,
        errorElement: <div>Error</div>
    }
];

describe('ArchivStudents', () => {
    window.ResizeObserver = ResizeObserver;
    test('Agent: archiv student page not crash', async () => {
        getArchivStudents.mockResolvedValue({
            data: mockSingleArchivStudentData
        });
        useAuth.mockReturnValue({
            user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
        });
        const router = createMemoryRouter(routes, {
            initialEntries: ['/archiv/students']
        });
        render(<RouterProvider router={router} />);

        // Example
        // const buttonElement = screen.getByRole('button');
        // userEvent.click(buttonElement);
        // const outputElement = screen.getByText('good to see you', { exact: false });
        // expect(outputElement).toBeInTheDocument(1);

        await waitFor(() => {
            expect(
                screen.getByTestId('archiv_student_component')
            ).toHaveTextContent('Testing-Student');
        });
    });
});
