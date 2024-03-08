import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Admissions from './Admissions';
import 'react-i18next';
import { getAdmissions } from '../../api';
import axios from 'axios';
import { request } from '../../api/request';
import { useAuth } from '../../components/AuthProvider';
import { MemoryRouter, useParams } from 'react-router-dom';

import { mockAdmissionsData } from '../../test/testingAdmissionsData';

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

describe('Admissions page checking', () => {
  window.ResizeObserver = ResizeObserver;
  test('Admissions page not crash', async () => {
    getAdmissions.mockResolvedValue({ data: mockAdmissionsData });
    useAuth.mockReturnValue({
      user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
    });
    render(
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
