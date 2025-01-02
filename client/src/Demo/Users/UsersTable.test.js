import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import UsersTable from './UsersTable';
import 'react-i18next';
import { getUsers } from '../../api';
import { useAuth } from '../../components/AuthProvider';
import { MemoryRouter } from 'react-router-dom';

import { testingUsersData } from '../../test/testingUsersData';

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

describe('Users Table page checking', () => {
    window.ResizeObserver = ResizeObserver;
    test('Users Table page not crash', async () => {
        getUsers.mockResolvedValue({ data: testingUsersData });
        useAuth.mockReturnValue({
            user: { role: 'Admin', _id: '639baebf8b84944b872cf648' }
        });

        render(
            <MemoryRouter>
                <UsersTable />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('users_table_page')).toHaveTextContent(
                'User List'
            );
        });
    });

    test('Users Table page switching tab not crash', async () => {
        getUsers.mockResolvedValue({ data: testingUsersData });
        useAuth.mockReturnValue({
            user: { role: 'Admin', _id: '639baebf8b84944b872cf648' }
        });

        render(
            <MemoryRouter>
                <UsersTable />
            </MemoryRouter>
        );
        await waitFor(() => {});
        const buttonElement = screen.getByTestId('users_table_page_agent_tab');
        userEvent.click(buttonElement);
        await waitFor(() => {
            expect(screen.getByTestId('users_table_page')).toHaveTextContent(
                'AgentFirstname'
            );
        });

        const buttonElement2 = screen.getByTestId(
            'users_table_page_editor_tab'
        );
        userEvent.click(buttonElement2);
        await waitFor(() => {
            expect(screen.getByTestId('users_table_page')).toHaveTextContent(
                'EditorFirstname'
            );
        });
        const buttonElement3 = screen.getByTestId('users_table_page_admin_tab');
        userEvent.click(buttonElement3);
        await waitFor(() => {
            expect(screen.getByTestId('users_table_page')).toHaveTextContent(
                'AdminFirstname'
            );
        });

        const buttonElement4 = screen.getByTestId(
            'users_table_page_student_tab'
        );
        userEvent.click(buttonElement4);
        await waitFor(() => {
            expect(screen.getByTestId('users_table_page')).toHaveTextContent(
                'TestStudent1'
            );
        });
    });
});
