import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Survey from '.';
import 'react-i18next';
import {
  getStudents,
  getProgramTickets,
  getMyAcademicBackground
} from '../../api';
import axios from 'axios';
import { request } from '../../api/request';
import { useAuth } from '../../components/AuthProvider/index';
import {
  MemoryRouter,
  RouterProvider,
  createMemoryRouter
} from 'react-router-dom';
const students = [
  { firstname: 'student1', lastname: 'Wang', role: 'Student' },
  { firstname: 'student2', lastname: 'Lin', role: 'Student' }
];
import { mockSingleData } from '../../test/testingStudentData';
import { SurveyProvider } from '../../components/SurveyProvider';
import { profile_name_list } from '../Utils/contants';

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

const routes = [
  {
    path: '/survey',
    element: (
      <SurveyProvider
        value={{
          academic_background: mockSingleData.data[0].academic_background,
          application_preference: mockSingleData.data[0].application_preference,
          survey_link: 'dummylink',
          student_id: mockSingleData.data[0]._id.toString()
        }}
      >
        <Survey />
      </SurveyProvider>
    ),
    errorElement: <div>Error</div>,
    loader: () => {
      return {
        data: { data: mockSingleData.data[0], survey_link: 'dummylink' }
      };
    }
  }
];

class ResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

describe('Survey', () => {
  window.ResizeObserver = ResizeObserver;
  test('student survey page not crash', async () => {
    getStudents.mockResolvedValue({ data: mockSingleData });
    getMyAcademicBackground.mockResolvedValue({
      data: {
        success: true,
        data: mockSingleData.data[0],
        survey_link: [
          { key: profile_name_list.Grading_System, link: 'some_link' }
        ]
      }
    });
    getProgramTickets.mockResolvedValue({ data: { success: true, data: [] } });
    useAuth.mockReturnValue({
      user: { role: 'Student', _id: '6366287a94358b085b0fccf7' }
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/survey']
    });
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Taipei First Girls' High School")
      ).toHaveValue('Song Shan senior high school');
      expect(screen.getByPlaceholderText('2016')).toHaveValue('2020');
      expect(
        screen.getByPlaceholderText('National Yilan University')
      ).toHaveValue('National Taichung University of Science and Technology');
    });
  });
});
