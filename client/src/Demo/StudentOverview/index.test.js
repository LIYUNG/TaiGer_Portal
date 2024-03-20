import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import StudentOverviewPage from '.';
import 'react-i18next';
import { getAllActiveStudents } from '../../api';
import axios from 'axios';
import { request } from '../../api/request';
import { useAuth } from '../../components/AuthProvider/index';
import { MemoryRouter } from 'react-router-dom';

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

class ResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

describe('StudentOverviewPage', () => {
  window.ResizeObserver = ResizeObserver;
  test('StudentOverview page not crash', async () => {
    getAllActiveStudents.mockResolvedValue({ data: mockSingleData });
    useAuth.mockReturnValue({
      user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
    });
    render(
      <MemoryRouter>
        <StudentOverviewPage />
      </MemoryRouter>
    );

    // Example
    // const buttonElement = screen.getByRole('button');
    // userEvent.click(buttonElement);
    // const outputElement = screen.getByText('good to see you', { exact: false });
    // expect(outputElement).toBeInTheDocument(1);

    await waitFor(() => {
      // TODO
      expect(screen.getByTestId('student_overview')).toHaveTextContent(
        'Agent'
      );
      // expect(1).toBe(1);
    });
  });
});
