import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ApplicantsOverview from '.';
import 'react-i18next';
import { getStudents, getProgramTickets } from '../../api';
import axios from 'axios';
import { request } from '../../api/request';
import { useAuth } from '../../components/AuthProvider/index';
import {
  MemoryRouter,
  RouterProvider,
  createMemoryRouter
} from 'react-router-dom';

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
    path: '/student-applications',
    element: <ApplicantsOverview />,
    errorElement: <div>Error</div>,
    loader: () => {
      return { data: mockSingleData };
    }
  }
];

describe('ApplicantsOverview', () => {
  window.ResizeObserver = ResizeObserver;
  test('ApplicationsOverview not crash', async () => {
    getStudents.mockResolvedValue({ data: mockSingleData });
    getProgramTickets.mockResolvedValue({ data: { success: true, data: [] } });
    useAuth.mockReturnValue({
      user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
    });
    const router = createMemoryRouter(routes, {
      initialEntries: ['/student-applications']
    });
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      // TODO
      expect(
        screen.getByTestId('application_overview_component')
      ).toHaveTextContent('Agents');
      // expect(1).toBe(1);
    });
  });
});
