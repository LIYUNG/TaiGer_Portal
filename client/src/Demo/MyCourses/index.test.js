import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import MyCourses from './index';
import 'react-i18next';
import { getMycourses } from '../../api';
import axios from 'axios';
import { request } from '../../api/request';
import { useAuth } from '../../components/AuthProvider';
import { MemoryRouter, useParams } from 'react-router-dom';

import { exampleCourse } from '../../test/testingCourseData';

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

jest.mock('../../components/AuthProvider');
const mockedAxios = jest.Mocked;

class ResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

describe('Course input pag checking', () => {
  window.ResizeObserver = ResizeObserver;
  test('render not crashed', () => {
    expect(1).toEqual(1);
  });
  test('dashboard not crash', async () => {
    getMycourses.mockResolvedValue({ data: exampleCourse });
    useAuth.mockReturnValue({
      user: { role: 'Agent', _id: '639baebf8b84944b872cf648' }
    });
    useParams.mockReturnValue({ student_id: '6483036b87c9c3e8823755ec' });
    render(
      <MemoryRouter>
        <MyCourses />
      </MemoryRouter>
    );

    // Example
    // const buttonElement = screen.getByRole('button');
    // userEvent.click(buttonElement);
    // const outputElement = screen.getByText('good to see you', { exact: false });
    // expect(outputElement).toBeInTheDocument(1);

    await waitFor(() => {
      // TODO
      expect(screen.getByTestId('student_course_view')).toHaveTextContent(
        '請把'
      );
      // expect(1).toBe(1);
    });
  });
});