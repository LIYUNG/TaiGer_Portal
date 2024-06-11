import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import CommunicationSinglePage from './CommunicationSinglePage';
import 'react-i18next';
import { getCommunicationThread } from '../../api';
import axios from 'axios';
import { useAuth } from '../../components/AuthProvider';
import { MemoryRouter, useParams } from 'react-router-dom';

import { dummyStudentMessage } from '../../test/testingCommunicationsData';

jest.mock('axios');
jest.mock('crypto');
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

jest.mock('crypto', () => ({
  ...jest.requireActual('react-router-dom'),
  getRandomValues: jest.fn()
}));

jest.mock('../../components/AuthProvider');
const mockedAxios = jest.Mocked;

class ResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

describe('Communication page checking', () => {
  window.ResizeObserver = ResizeObserver;
  // TODO
  test('Communication page not crash', async () => {
    expect(1).toBe(1);
  });
});
