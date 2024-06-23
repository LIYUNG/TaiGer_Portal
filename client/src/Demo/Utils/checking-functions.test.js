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
  isProgramWithdraw,
  getRequirement,
  isLanguageInfoComplete,
  isEnglishLanguageInfoComplete,
  check_if_there_is_german_language_info,
  check_german_language_Notneeded,
  check_german_language_passed,
  check_english_language_Notneeded,
  check_english_language_passed
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

describe('getRequirement', () => {
  it('should return false if thread is not provided', () => {
    expect(getRequirement(null)).toBe(false);
    expect(getRequirement(undefined)).toBe(false);
  });

  it('should return false if fileType or program is not provided', () => {
    expect(getRequirement({})).toBe(false);
    expect(getRequirement({ file_type: 'Essay' })).toBe(false);
    expect(getRequirement({ program_id: { essay_required: 'yes' } })).toBe(
      false
    );
  });

  it('should return the correct essay requirement', () => {
    const thread = {
      file_type: 'Essay',
      program_id: { essay_required: 'yes', essay_requirements: '500 words' }
    };
    expect(getRequirement(thread)).toBe('500 words');
  });

  it('should return "No" if essay requirement is not specified', () => {
    const thread = {
      file_type: 'Essay',
      program_id: { essay_required: 'yes' }
    };
    expect(getRequirement(thread)).toBe('No');
  });

  it('should return the correct ML requirement', () => {
    const thread = {
      file_type: 'ML',
      program_id: { ml_required: 'yes', ml_requirements: 'ML requirement text' }
    };
    expect(getRequirement(thread)).toBe('ML requirement text');
  });

  it('should return the correct portfolio requirement', () => {
    const thread = {
      file_type: 'Portfolio',
      program_id: {
        portfolio_required: 'yes',
        portfolio_requirements: 'Portfolio requirement text'
      }
    };
    expect(getRequirement(thread)).toBe('Portfolio requirement text');
  });

  it('should return the correct supplementary form requirement', () => {
    const thread = {
      file_type: 'Supplementary_Form',
      program_id: {
        supplementary_form_required: 'yes',
        supplementary_form_requirements: 'Supplementary form text'
      }
    };
    expect(getRequirement(thread)).toBe('Supplementary form text');
  });

  it('should return the correct curriculum analysis requirement', () => {
    const thread = {
      file_type: 'Curriculum_Analysis',
      program_id: {
        curriculum_analysis_required: 'yes',
        curriculum_analysis_requirements: 'Curriculum analysis text'
      }
    };
    expect(getRequirement(thread)).toBe('Curriculum analysis text');
  });

  it('should return the correct scholarship form requirement', () => {
    const thread = {
      file_type: 'Scholarship_Form',
      program_id: {
        scholarship_form_required: 'yes',
        scholarship_form_requirements: 'Scholarship form text'
      }
    };
    expect(getRequirement(thread)).toBe('Scholarship form text');
  });

  it('should return the correct RL requirement', () => {
    const thread = {
      file_type: 'RL',
      program_id: { rl_required: '2', rl_requirements: 'RL requirement text' }
    };
    expect(getRequirement(thread)).toBe('RL requirement text');
  });

  it('should return "No" if RL requirement is not specified', () => {
    const thread = {
      file_type: 'RL',
      program_id: { rl_required: '2' }
    };
    expect(getRequirement(thread)).toBe('No');
  });

  it('should return "No" if file type does not match any condition', () => {
    const thread = {
      file_type: 'Unknown_Type',
      program_id: {
        unknown_required: 'yes',
        unknown_requirements: 'Unknown requirement text'
      }
    };
    expect(getRequirement(thread)).toBe('No');
  });
});

describe('isLanguageInfoComplete', () => {
  it('should return false if academic_background is not provided', () => {
    expect(isLanguageInfoComplete(null)).toBe(false);
    expect(isLanguageInfoComplete(undefined)).toBe(false);
  });

  it('should return false if academic_background.language is not provided', () => {
    const academic_background = {};
    expect(isLanguageInfoComplete(academic_background)).toBe(false);
  });

  it('should return false if both english_isPassed and german_isPassed are "-"', () => {
    const academic_background = {
      language: {
        english_isPassed: '-',
        german_isPassed: '-'
      }
    };
    expect(isLanguageInfoComplete(academic_background)).toBe(false);
  });

  it('should return true if english_isPassed is not "-"', () => {
    const academic_background = {
      language: {
        english_isPassed: 'yes',
        german_isPassed: '-'
      }
    };
    expect(isLanguageInfoComplete(academic_background)).toBe(true);
  });

  it('should return true if german_isPassed is not "-"', () => {
    const academic_background = {
      language: {
        english_isPassed: '-',
        german_isPassed: 'yes'
      }
    };
    expect(isLanguageInfoComplete(academic_background)).toBe(true);
  });

  it('should return true if both english_isPassed and german_isPassed are not "-"', () => {
    const academic_background = {
      language: {
        english_isPassed: 'yes',
        german_isPassed: 'yes'
      }
    };
    expect(isLanguageInfoComplete(academic_background)).toBe(true);
  });
});

describe('isEnglishLanguageInfoComplete', () => {
  it('should return false if academic_background is not provided', () => {
    expect(isEnglishLanguageInfoComplete(null)).toBe(false);
    expect(isEnglishLanguageInfoComplete(undefined)).toBe(false);
  });

  it('should return false if academic_background.language is not provided', () => {
    const academic_background = {};
    expect(isEnglishLanguageInfoComplete(academic_background)).toBe(false);
  });

  it('should return false if english_isPassed is "-"', () => {
    const academic_background = {
      language: {
        english_isPassed: '-'
      }
    };
    expect(isEnglishLanguageInfoComplete(academic_background)).toBe(false);
  });

  it('should return true if english_isPassed is not "-"', () => {
    const academic_background = {
      language: {
        english_isPassed: 'yes'
      }
    };
    expect(isEnglishLanguageInfoComplete(academic_background)).toBe(true);
  });

  it('should return true if english_isPassed is an empty string', () => {
    const academic_background = {
      language: {
        english_isPassed: ''
      }
    };
    expect(isEnglishLanguageInfoComplete(academic_background)).toBe(true);
  });

  it('should return true if english_isPassed is a value other than "-"', () => {
    const academic_background = {
      language: {
        english_isPassed: 'no'
      }
    };
    expect(isEnglishLanguageInfoComplete(academic_background)).toBe(true);
  });
});

describe('check_if_there_is_german_language_info', () => {
  it('should return false if academic_background is not provided', () => {
    expect(check_if_there_is_german_language_info(null)).toBe(false);
    expect(check_if_there_is_german_language_info(undefined)).toBe(false);
  });

  it('should return false if academic_background.language is not provided', () => {
    const academic_background = {};
    expect(check_if_there_is_german_language_info(academic_background)).toBe(
      false
    );
  });

  it('should return false if german_isPassed is "-"', () => {
    const academic_background = {
      language: {
        german_isPassed: '-'
      }
    };
    expect(check_if_there_is_german_language_info(academic_background)).toBe(
      false
    );
  });

  it('should return true if german_isPassed is not "-"', () => {
    const academic_background = {
      language: {
        german_isPassed: 'yes'
      }
    };
    expect(check_if_there_is_german_language_info(academic_background)).toBe(
      true
    );
  });

  it('should return true if german_isPassed is an empty string', () => {
    const academic_background = {
      language: {
        german_isPassed: ''
      }
    };
    expect(check_if_there_is_german_language_info(academic_background)).toBe(
      true
    );
  });

  it('should return true if german_isPassed is a value other than "-"', () => {
    const academic_background = {
      language: {
        german_isPassed: 'no'
      }
    };
    expect(check_if_there_is_german_language_info(academic_background)).toBe(
      true
    );
  });
});

describe('Language Check Functions', () => {
  describe('check_english_language_passed', () => {
    it('should return true if english_isPassed is "O"', () => {
      const academic_background = { language: { english_isPassed: 'O' } };
      expect(check_english_language_passed(academic_background)).toBe(true);
    });

    it('should return false if english_isPassed is not "O"', () => {
      const academic_background = { language: { english_isPassed: 'X' } };
      expect(check_english_language_passed(academic_background)).toBe(false);
    });

    it('should return false if academic_background or language is not provided', () => {
      expect(check_english_language_passed(null)).toBe(false);
      expect(check_english_language_passed(undefined)).toBe(false);
      expect(check_english_language_passed({})).toBe(false);
    });
  });

  describe('check_english_language_Notneeded', () => {
    it('should return true if english_isPassed is "--"', () => {
      const academic_background = { language: { english_isPassed: '--' } };
      expect(check_english_language_Notneeded(academic_background)).toBe(true);
    });

    it('should return false if english_isPassed is not "--"', () => {
      const academic_background = { language: { english_isPassed: 'X' } };
      expect(check_english_language_Notneeded(academic_background)).toBe(false);
    });

    it('should return false if academic_background or language is not provided', () => {
      expect(check_english_language_Notneeded(null)).toBe(false);
      expect(check_english_language_Notneeded(undefined)).toBe(false);
      expect(check_english_language_Notneeded({})).toBe(false);
    });
  });

  describe('check_german_language_passed', () => {
    it('should return true if german_isPassed is "O"', () => {
      const academic_background = { language: { german_isPassed: 'O' } };
      expect(check_german_language_passed(academic_background)).toBe(true);
    });

    it('should return false if german_isPassed is not "O"', () => {
      const academic_background = { language: { german_isPassed: 'X' } };
      expect(check_german_language_passed(academic_background)).toBe(false);
    });

    it('should return false if academic_background or language is not provided', () => {
      expect(check_german_language_passed(null)).toBe(false);
      expect(check_german_language_passed(undefined)).toBe(false);
      expect(check_german_language_passed({})).toBe(false);
    });
  });

  describe('check_german_language_Notneeded', () => {
    it('should return true if german_isPassed is "--"', () => {
      const academic_background = { language: { german_isPassed: '--' } };
      expect(check_german_language_Notneeded(academic_background)).toBe(true);
    });

    it('should return false if german_isPassed is not "--"', () => {
      const academic_background = { language: { german_isPassed: 'X' } };
      expect(check_german_language_Notneeded(academic_background)).toBe(false);
    });

    it('should return false if academic_background or language is not provided', () => {
      expect(check_german_language_Notneeded(null)).toBe(false);
      expect(check_german_language_Notneeded(undefined)).toBe(false);
      expect(check_german_language_Notneeded({})).toBe(false);
    });
  });
});