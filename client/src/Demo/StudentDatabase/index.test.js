import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import StudentDatabase from '.';
import 'react-i18next';
import { getAllStudents, getProgramTickets } from '../../api';
import axios from 'axios';
import { request } from '../../api/request';
import { useAuth } from '../../components/AuthProvider/index';
import {
  MemoryRouter,
  Router,
  createMemoryRouter,
  useLoaderData,
  RouterProvider
} from 'react-router-dom';
const students = [
  { firstname: 'student1', lastname: 'Wang', role: 'Student' },
  { firstname: 'student2', lastname: 'Lin', role: 'Student' }
];
import { mockSingleData } from '../../test/testingStudentData';

jest.mock('axios');
jest.mock('request');
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
const mockedAxios = jest.Mocked;

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
    getAllStudents.mockResolvedValue({ data: mockSingleData });
    getProgramTickets.mockResolvedValue({ data: { success: true, data: [] } });
    useAuth.mockReturnValue({
      user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/student-database']
    });
    render(<RouterProvider router={router} />);

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
