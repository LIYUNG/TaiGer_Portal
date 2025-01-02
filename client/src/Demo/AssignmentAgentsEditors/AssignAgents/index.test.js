import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AssignAgents from './index';
import 'react-i18next';
import { getProgramTickets } from '../../../api';
import { useAuth } from '../../../components/AuthProvider/index';
import { createMemoryRouter } from 'react-router-dom';

import { mockTwoNoAgentNoStudentsData } from '../../../test/testingNoAgentNoEditorStudentData';
import { RouterProvider } from 'react-router-dom';

jest.mock('axios');
jest.mock('../../../api');
jest.mock('react-i18next', () => ({
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: { changeLanguage: () => new Promise(() => {}) }
        };
    },
    initReactI18next: { type: '3rdParty', init: () => {} }
}));
jest.mock('../../../components/AuthProvider');

const routes = [
    {
        path: '/assignment/agents',
        element: <AssignAgents />,
        errorElement: <div>Error</div>,
        loader: () => {
            return { data: mockTwoNoAgentNoStudentsData };
        }
    }
];

describe('Admin AssignAgents', () => {
    test('admin assign agent not crash', async () => {
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Admin', _id: '609c498ae2f954388837d2f9' }
        });

        const router = createMemoryRouter(routes, {
            initialEntries: ['/assignment/agents']
        });
        render(<RouterProvider router={router} />);

        // Example
        // const buttonElement = screen.getByRole('button');
        // userEvent.click(buttonElement);
        // const outputElement = screen.getByText('good to see you', { exact: false });
        // expect(outputElement).toBeInTheDocument(1);

        await waitFor(() => {
            // TODO
            expect(screen.getByTestId('assignment_agents')).toHaveTextContent(
                'No Agents Students'
            );
        });
    });

    test('students rendered correctly', async () => {
        getProgramTickets.mockResolvedValue({
            data: { success: true, data: [] }
        });
        useAuth.mockReturnValue({
            user: { role: 'Admin', _id: '609c498ae2f954388837d2f9' }
        });

        const router = createMemoryRouter(routes, {
            initialEntries: ['/assignment/agents']
        });
        render(<RouterProvider router={router} />);

        // Example
        // const buttonElement = screen.getByRole('button');
        // userEvent.click(buttonElement);
        // const outputElement = screen.getByText('good to see you', { exact: false });
        // expect(outputElement).toBeInTheDocument(1);

        await waitFor(() => {
            expect(
                screen.getByTestId('assignment_agents')
            ).not.toHaveTextContent('TestStudent-HasAgent-NoEditor');
            expect(screen.getByTestId('assignment_agents')).toHaveTextContent(
                'Student-NoAgent-HasEditor'
            );
        });
    });
});
