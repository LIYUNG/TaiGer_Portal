// import { render, screen } from '@testing-library/react';
// import App from './App/index';
import { is_TaiGer_role, is_TaiGer_AdminAgent, is_TaiGer_Admin } from './checking-functions';

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
});
