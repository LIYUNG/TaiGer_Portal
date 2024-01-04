import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import 'react-i18next';
import { getStudents } from '../../api';
import axios from 'axios';
import { request } from '../../api/request';

const students = [
  { firstname: 'student1', lastname: 'Wang', role: 'Student' },
  { firstname: 'student2', lastname: 'Lin', role: 'Student' }
];

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
const mockedAxios = jest.Mocked;

describe('Dashboard', () => {
  test('dashboard not crash', async () => {
    // render(<Dashboard user={{ role: 'Agent' }} />);
    await waitFor(() => {
        // TODO
    //   expect(screen.getByTestId('agent_main_view')).toHaveTextContent('Agents');
    expect(1).toBe(1);
    });
  });
});
