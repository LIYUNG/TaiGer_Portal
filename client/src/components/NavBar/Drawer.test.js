import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomDrawer } from './Drawer'; // Update the import path accordingly
import { useAuth } from '../../components/AuthProvider/index';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
jest.mock('../../components/AuthProvider/index', () => ({
    useAuth: jest.fn()
}));

jest.mock('i18next', () => ({
    t: jest.fn((key) => key)
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

describe('CustomDrawer Component', () => {
    const mockProps = {
        open: true,
        ismobile: false,
        handleDrawerClose: jest.fn(),
        theme: { direction: 'ltr' }
    };

    beforeEach(() => {
        useAuth.mockReturnValue({
            user: {
                role: 'Student',
                _id: '639baebf8b84944b872cf648',
                firstname: 'test',
                lastname: 'student'
            } // Mock user role
        });
    });

    test('renders the correct menu items For Student', () => {
        render(
            <BrowserRouter>
                <CustomDrawer {...mockProps} />
            </BrowserRouter>
        );
        // Add assertions to check menu items
        expect(screen.getByTestId('navbar_drawer_component')).toHaveTextContent(
            'Dashboard'
        );
        expect(
            screen.getByTestId('navbar_drawer_component')
        ).not.toHaveTextContent('Program List');
        expect(
            screen.getByTestId('navbar_drawer_component')
        ).not.toHaveTextContent('User List');
        expect(
            screen.getByTestId('navbar_drawer_component')
        ).not.toHaveTextContent('My Students');
        expect(
            screen.getByTestId('navbar_drawer_component')
        ).not.toHaveTextContent('All Students');
        expect(
            screen.getByTestId('navbar_drawer_component')
        ).not.toHaveTextContent('Tools');
        expect(
            screen.getByTestId('navbar_drawer_component')
        ).not.toHaveTextContent('Public Docs');
        expect(
            screen.getByTestId('navbar_drawer_component')
        ).not.toHaveTextContent('Internal Docs');
    });
});
