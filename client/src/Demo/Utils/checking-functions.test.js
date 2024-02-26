// import { render, screen } from '@testing-library/react';
// import App from './App/index';
import {
  is_TaiGer_role,
  is_TaiGer_AdminAgent,
  is_TaiGer_Admin,
  is_cv_assigned,
  isCVFinished,
  is_TaiGer_Editor,
  is_TaiGer_Student,
  is_TaiGer_Agent,
  calculateDisplayLength,
  truncateText,
  Bayerische_Formel,
  isProgramDecided,
  isProgramSubmitted,
  isProgramWithdraw
} from './checking-functions';

const userStudent = { role: 'Student' };
const userAgent = { role: 'Agent' };
const userEditor = { role: 'Editor' };
const userAdmin = { role: 'Admin' };

describe('Role checking', () => {
  test('is_TaiGer_role', () => {
    expect(is_TaiGer_role(userStudent)).toEqual(false);
    expect(is_TaiGer_role(userAgent)).toEqual(true);
    expect(is_TaiGer_role(userEditor)).toEqual(true);
    expect(is_TaiGer_role(userAdmin)).toEqual(true);
  });

  test('is_TaiGer_AdminAgent', () => {
    expect(is_TaiGer_AdminAgent(userStudent)).toEqual(false);
    expect(is_TaiGer_AdminAgent(userAgent)).toEqual(true);
    expect(is_TaiGer_AdminAgent(userEditor)).toEqual(false);
    expect(is_TaiGer_AdminAgent(userAdmin)).toEqual(true);
  });

  test('is_TaiGer_Admin', () => {
    expect(is_TaiGer_Admin(userStudent)).toEqual(false);
    expect(is_TaiGer_Admin(userAgent)).toEqual(false);
    expect(is_TaiGer_Admin(userEditor)).toEqual(false);
    expect(is_TaiGer_Admin(userAdmin)).toEqual(true);
  });

  test('is_TaiGer_Editor', () => {
    expect(is_TaiGer_Editor(userStudent)).toEqual(false);
    expect(is_TaiGer_Editor(userAgent)).toEqual(false);
    expect(is_TaiGer_Editor(userEditor)).toEqual(true);
    expect(is_TaiGer_Editor(userAdmin)).toEqual(false);
  });

  test('is_TaiGer_Agent', () => {
    expect(is_TaiGer_Agent(userStudent)).toEqual(false);
    expect(is_TaiGer_Agent(userAgent)).toEqual(true);
    expect(is_TaiGer_Agent(userEditor)).toEqual(false);
    expect(is_TaiGer_Agent(userAdmin)).toEqual(false);
  });

  test('is_TaiGer_Student', () => {
    expect(is_TaiGer_Student(userStudent)).toEqual(true);
    expect(is_TaiGer_Student(userAgent)).toEqual(false);
    expect(is_TaiGer_Student(userEditor)).toEqual(false);
    expect(is_TaiGer_Student(userAdmin)).toEqual(false);
  });

  test('is_cv_assigned', () => {
    const studentHasCVTask = {
      role: 'Student',
      generaldocs_threads: [{ doc_thread_id: { file_type: 'CV' } }]
    };
    const studentHasNoCVTask = {
      role: 'Student',
      generaldocs_threads: [{ doc_thread_id: { file_type: 'RL_A' } }]
    };
    expect(is_cv_assigned(studentHasCVTask)).toEqual(true);
    expect(is_cv_assigned(studentHasNoCVTask)).toEqual(false);
  });

  test('calculateDisplayLength', () => {
    const text_1 = '中文';
    const text_2 = '中文 abc';
    const text_3 = 'abc def';
    expect(calculateDisplayLength(text_1)).toEqual(4);
    expect(calculateDisplayLength(text_2)).toEqual(8);
    expect(calculateDisplayLength(text_3)).toEqual(7);
  });

  test('truncateText', () => {
    const text_1 = '中文 abc';
    const text_2 = '中文 abcabcabcabcabcabc';
    expect(truncateText(text_1, 5)).toEqual('中文 ...');
    expect(truncateText(text_2, 100)).toEqual('中文 abcabcabcabcabcabc');
  });

  test('Bayerische_Formel', () => {
    const system_1_1 = { high: 4, low: 2, my: 2 };
    const system_1_2 = { high: 4, low: 2, my: 4 };
    const system_1_3 = { high: 4, low: 2, my: 3 };
    const system_2_1 = { high: 4.3, low: 1.7, my: 4.3 };
    const system_2_2 = { high: 4.3, low: 1.7, my: 1.7 };
    const system_2_3 = { high: 4.3, low: 1.7, my: 3 };
    expect(
      parseFloat(
        Bayerische_Formel(system_1_1.high, system_1_1.low, system_1_1.my)
      )
    ).toEqual(4);
    expect(
      parseFloat(
        Bayerische_Formel(system_1_2.high, system_1_2.low, system_1_2.my)
      )
    ).toEqual(1);
    expect(
      parseFloat(
        Bayerische_Formel(system_1_3.high, system_1_3.low, system_1_3.my)
      )
    ).toEqual(2.5);
    expect(
      parseFloat(
        Bayerische_Formel(system_2_1.high, system_2_1.low, system_2_1.my)
      )
    ).toEqual(1);
    expect(
      parseFloat(
        Bayerische_Formel(system_2_2.high, system_2_2.low, system_2_2.my)
      )
    ).toEqual(4);
    expect(
      parseFloat(
        Bayerische_Formel(system_2_3.high, system_2_3.low, system_2_3.my)
      )
    ).toEqual(2.5);
  });

  test('isCVFinished', () => {
    const studentIsCVFinished = {
      role: 'Student',
      generaldocs_threads: [
        { doc_thread_id: { file_type: 'CV' }, isFinalVersion: true }
      ]
    };
    const studentIsCVNotFinished = {
      role: 'Student',
      generaldocs_threads: [{ doc_thread_id: { file_type: 'CV' } }]
    };
    expect(isCVFinished(studentIsCVFinished)).toEqual(true);
    expect(isCVFinished(studentIsCVNotFinished)).toEqual(false);
  });

  test('isProgramDecided', () => {
    const application_decided = {
      decided: 'O'
    };
    const application_not_decided_yet = {
      decided: '-'
    };
    const application_decided_no = {
      decided: '-'
    };
    expect(isProgramDecided(application_decided)).toEqual(true);
    expect(isProgramDecided(application_not_decided_yet)).toEqual(false);
    expect(isProgramDecided(application_decided_no)).toEqual(false);
  });

  test('isProgramSubmitted', () => {
    const application_closed = {
      closed: 'O'
    };
    const application_open = {
      closed: '-'
    };
    expect(isProgramSubmitted(application_open)).toEqual(false);
    expect(isProgramSubmitted(application_closed)).toEqual(true);
  });

  test('isProgramWithdraw', () => {
    const application_withdraw = {
      closed: 'X'
    };
    const application_open = {
      closed: '-'
    };
    expect(isProgramWithdraw(application_withdraw)).toEqual(true);
    expect(isProgramWithdraw(application_open)).toEqual(false);
  });
});
