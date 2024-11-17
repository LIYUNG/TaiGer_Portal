import React, { useState } from 'react';
import {
  Box,
  Button,
  Breadcrumbs,
  Card,
  Chip,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  BACHELOR_GRADUATE_STATUS_OPTIONS,
  DEGREE_ARRAY_OPTIONS,
  DUAL_STATE_OPTIONS,
  ENGLISH_CERTIFICATE_ARRAY_OPTIONS,
  GERMAN_CERTIFICATE_ARRAY_OPTIONS,
  GMAT_CERTIFICATE_OPTIONS,
  GRE_CERTIFICATE_ARRAY_OPTIONS,
  HIG_SCHOOL_TRI_STATE_OPTIONS,
  IS_PASSED_OPTIONS,
  LANGUAGES_PREFERENCE_ARRAY_OPTIONS,
  SEMESTER_ARRAY_OPTIONS,
  TRI_STATE_OPTIONS,
  convertDate
} from '../Utils/contants';
import {
  check_academic_background_filled,
  check_languages_filled,
  check_application_preference_filled,
  is_TaiGer_Admin,
  is_TaiGer_Student,
  Bayerische_Formel,
  MissingSurveyFieldsListArray
} from '../Utils/checking-functions';
import {
  APPLICATION_YEARS_FUTURE,
  EXPECTATION_APPLICATION_YEARS,
  profile_name_list,
  getNumberOfDays
} from '../Utils/contants';
import Banner from '../../components/Banner/Banner';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { useSurvey } from '../../components/SurveyProvider';

const SurveyEditableComponent = (props) => {
  const {
    handleChangeAcademic,
    handleChangeLanguage,
    handleChangeApplicationPreference,
    handleAcademicBackgroundSubmit,
    handleSurveyLanguageSubmit,
    handleApplicationPreferenceSubmit,
    updateDocLink,
    onChangeURL,
    survey
  } = useSurvey();
  const [surveyEditableComponentState, setSurveyEditableComponentState] =
    useState({
      baseDocsflagOffcanvas: false,
      baseDocsflagOffcanvasButtonDisable: false
    });
  const { user } = useAuth();
  const { t } = useTranslation();

  const closeOffcanvasWindow = () => {
    setSurveyEditableComponentState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: false
    }));
  };

  const openOffcanvasWindow = () => {
    setSurveyEditableComponentState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: true
    }));
  };

  const handleUpdateDocLink = (e) => {
    e.preventDefault();
    setSurveyEditableComponentState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    updateDocLink(survey.survey_link, profile_name_list.Grading_System); // props.k is the grading system name
    setSurveyEditableComponentState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  const names = [
    'ACC-FIN',
    'AG-FOR',
    'ANA-PHYS',
    'ANTH',
    'ARCH',
    'ARCH-BE',
    'ART-DES',
    'ARTH',
    'BIO-SCI',
    'BUS-MGMT',
    'CHEM',
    'CLAH',
    'COMM-MEDIA',
    'CSIS',
    'DS-AI',
    'DENT',
    'DEV-STUD',
    'EAR-MAR-SCI',
    'ECON',
    'EDU-TRAIN',
    'CHEM-ENG',
    'CIV-STR-ENG',
    'ELEC-ENG',
    'MECH-ENG',
    'MIN-MIN-ENG',
    'PETRO-ENG',
    'ELL',
    'ENV-SCI',
    'GEO',
    'GEOL',
    'GEOPH',
    'HIST',
    'HOSP-MGMT',
    'LAW',
    'LIB-INFO',
    'LING',
    'MKT',
    'MAT-SCI',
    'MATH',
    'MED',
    'MOD-LANG',
    'MUS',
    'NURS',
    'PERF-ART',
    'PHARM',
    'PHIL',
    'PHYS-ASTRO',
    'POL',
    'PSYCH',
    'SOC-POL',
    'SOC',
    'SPORT',
    'STAT-OR',
    'THEO',
    'VET-SCI'
  ];
  const [personName, setPersonName] = React.useState([]);
  const handleChangeTest = (event) => {
    const {
      target: { value }
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  // const renderTooltipApplicationYear = (props) => (
  //   <Tooltip id="tooltip-disabled" {...props}>
  //     請填上預計申請入學年度，您的申請必須要在這個預計入學年度和預計入學學期前完成。各學校申請截止
  //     Deadline 會依照你的預計入學年度和學期為您做計算。
  //   </Tooltip>
  // );

  // const renderTooltipApplicationSemester = (props) => (
  //   <Tooltip id="tooltip-disabled" {...props}>
  //     請填上預計入學學期，您的申請必須會在這個時間之前結束。各學校申請截止
  //     Deadline 會依照你的預計入學年度和學期為您做計算。
  //   </Tooltip>
  // );
  return (
    <Box>
      {is_TaiGer_Student(user) && (
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.DASHBOARD_LINK}`}
          >
            {appConfig.companyName}
          </Link>
          <Typography color="text.primary">
            {t('Profile', { ns: 'common' })}
          </Typography>
        </Breadcrumbs>
      )}
      {(!check_academic_background_filled(survey.academic_background) ||
        !check_application_preference_filled(
          survey.application_preference
        )) && (
        <Card sx={{ padding: 2 }}>
          <Typography fontWeight="bold">
            {t('The followings information are still missing')}
          </Typography>
          {MissingSurveyFieldsListArray({
            academic_background: survey.academic_background,
            application_preference: survey.application_preference
          })?.map((field) => (
            <li key={field}>{t(field)}</li>
          ))}
        </Card>
      )}
      {!check_languages_filled(survey.academic_background) && (
        <Card sx={{ padding: 2 }}>
          <Typography fontWeight="bold">
            {t(
              'Your language skills and certificates information are still missing or not up-to-date'
            )}
          </Typography>
          {survey.academic_background?.language?.english_isPassed === '-' ||
          !survey.academic_background?.language?.english_isPassed ? (
            <li>{t('Do you need English Test')}?</li>
          ) : survey.academic_background?.language?.english_isPassed === 'X' &&
            getNumberOfDays(
              survey.academic_background?.language?.english_test_date,
              new Date()
            ) > 1 ? (
            <li>{t('English Passed ? (IELTS 6.5 / TOEFL 88)')}</li>
          ) : survey.academic_background?.language?.english_isPassed === 'X' &&
            survey.academic_background?.language?.english_test_date === '' ? (
            <li>English Test Date missing !</li>
          ) : (
            <></>
          )}
          {survey.academic_background?.language?.german_isPassed === '-' ||
          !survey.academic_background?.language?.german_isPassed ? (
            <li>
              {t(
                'German Passed ? (Set Not need if applying English taught programs.)'
              )}
            </li>
          ) : survey.academic_background?.language?.german_isPassed === 'X' &&
            getNumberOfDays(
              survey.academic_background?.language?.german_test_date,
              new Date()
            ) > 1 ? (
            <li>
              {t(
                'German Passed ? (Set Not need if applying English taught programs.)'
              )}
            </li>
          ) : survey.academic_background?.language?.german_isPassed === 'X' &&
            survey.academic_background?.language?.german_test_date === '' ? (
            <li>{t('Expected German Test Date')}</li>
          ) : (
            <></>
          )}
          {survey.academic_background?.language?.gre_isPassed === '-' ||
          !survey.academic_background?.language?.gre_isPassed ? (
            <li>{t('Do you need GRE Test')}</li>
          ) : survey.academic_background?.language?.gre_isPassed === 'X' &&
            getNumberOfDays(
              survey.academic_background?.language?.gre_test_date,
              new Date()
            ) > 1 ? (
            <li>{t('GRE Test passed ?')}</li>
          ) : survey.academic_background?.language?.gre_isPassed === 'X' &&
            survey.academic_background?.language?.gre_test_date === '' ? (
            <li>GRE Test Date not given</li>
          ) : (
            <></>
          )}
          {survey.academic_background?.language?.gmat_isPassed === '-' ||
          !survey.academic_background?.language?.gmat_isPassed ? (
            <li>{t('Do you need GMAT Test')}?</li>
          ) : survey.academic_background?.language?.gmat_isPassed === 'X' &&
            getNumberOfDays(
              survey.academic_background?.language?.gmat_test_date,
              new Date()
            ) > 1 ? (
            <li>{t('GMAT Test passed ?')}</li>
          ) : survey.academic_background?.language?.gmat_isPassed === 'X' &&
            survey.academic_background?.language?.gmat_test_date === '' ? (
            <li>GMAT Test Date not given</li>
          ) : (
            <></>
          )}
        </Card>
      )}
      <Box>
        <Card sx={{ mt: 2, padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t('Academic Background Survey')}
              </Typography>
              <Typography variant="body1">{t('High School')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="attended_high_school"
                name="attended_high_school"
                error={
                  survey.academic_background?.university
                    ?.attended_high_school === ''
                }
                helperText={
                  survey.academic_background?.university
                    ?.attended_high_school === '' &&
                  'Please provide High school name'
                }
                label={t('High School Name (English)')}
                variant="outlined"
                placeholder="Taipei First Girls' High School"
                value={
                  survey.academic_background?.university
                    ?.attended_high_school || ''
                }
                onChange={(e) => handleChangeAcademic(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="high_school_isGraduated"
                name="high_school_isGraduated"
                id="high_school_isGraduated"
                error={
                  survey.academic_background?.university
                    ?.high_school_isGraduated === '-'
                }
                helperText={
                  survey.academic_background?.university
                    ?.high_school_isGraduated === '-' &&
                  'Please provide High school graduation info'
                }
                select
                value={
                  survey.academic_background?.university
                    ?.high_school_isGraduated || '-'
                }
                label={t('High School already graduated')}
                onChange={(e) => handleChangeAcademic(e)}
              >
                {HIG_SCHOOL_TRI_STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label, { ns: 'common' })}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              {survey.academic_background?.university
                ?.high_school_isGraduated !== '-' && (
                <>
                  <TextField
                    fullWidth
                    id="high_school_graduated_year"
                    name="high_school_graduated_year"
                    label={`${
                      survey.academic_background?.university
                        .high_school_isGraduated === 'Yes'
                        ? t('High School Graduate Year')
                        : survey.academic_background?.university
                            .high_school_isGraduated === 'No'
                        ? t('High School Graduate leaved Year')
                        : survey.academic_background?.university
                            ?.high_school_isGraduated === 'pending' &&
                          t('Expected High School Graduate Year')
                    }`}
                    variant="outlined"
                    placeholder="2016"
                    value={
                      survey.academic_background?.university
                        ?.high_school_graduated_year
                        ? survey.academic_background.university
                            .high_school_graduated_year
                        : ''
                    }
                    onChange={(e) => handleChangeAcademic(e)}
                  />
                  <br />
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {t('University (Bachelor degree)', { ns: 'survey' })}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="isGraduated"
                name="isGraduated"
                id="isGraduated"
                error={
                  survey.academic_background?.university?.isGraduated === '-'
                }
                helperText={
                  survey.academic_background?.university?.isGraduated === '-' &&
                  'Please provide Bachelor info.'
                }
                select
                value={
                  survey.academic_background?.university?.isGraduated || '-'
                }
                label={t('Already Bachelor graduated ?')}
                onChange={(e) => handleChangeAcademic(e)}
              >
                {BACHELOR_GRADUATE_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {['Yes', 'pending'].includes(
              survey.academic_background?.university?.isGraduated
            ) && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="attended_university"
                    name="attended_university"
                    error={
                      survey.academic_background?.university
                        ?.attended_university === ''
                    }
                    helperText={
                      survey.academic_background?.university
                        ?.attended_university === '' &&
                      'Please provide University name info.'
                    }
                    label={t('University Name (Bachelor degree)')}
                    variant="outlined"
                    placeholder="National Yilan University"
                    value={
                      survey.academic_background?.university
                        ?.attended_university || ''
                    }
                    onChange={(e) => handleChangeAcademic(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="attended_university_program"
                    name="attended_university_program"
                    label={t('Program Name')}
                    error={
                      survey.academic_background?.university
                        ?.attended_university_program === ''
                    }
                    helperText={
                      survey.academic_background?.university
                        ?.attended_university_program === '' &&
                      'Please provide program name info.'
                    }
                    variant="outlined"
                    placeholder="B.Sc. Electrical Engineering"
                    value={
                      survey.academic_background?.university
                        ?.attended_university_program || ''
                    }
                    onChange={(e) => handleChangeAcademic(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {survey.academic_background?.university?.isGraduated !==
                    '-' &&
                    survey.academic_background?.university?.isGraduated !==
                      'No' && (
                      <TextField
                        fullWidth
                        labelid="expected_grad_date"
                        name="expected_grad_date"
                        id="expected_grad_date"
                        error={
                          survey.academic_background?.university
                            ?.expected_grad_date === '-'
                        }
                        helperText={
                          survey.academic_background?.university
                            ?.expected_grad_date === '-' &&
                          'Please provide graduate date info.'
                        }
                        select
                        value={
                          survey.academic_background?.university
                            ?.expected_grad_date || '-'
                        }
                        label={`${
                          survey?.academic_background?.university
                            .isGraduated === 'No'
                            ? t('Leaved Year')
                            : survey?.academic_background?.university
                                .isGraduated === 'Yes'
                            ? t('Graduated Year')
                            : t('Expected Graduate Year')
                        }`}
                        onChange={(e) => handleChangeAcademic(e)}
                      >
                        {APPLICATION_YEARS_FUTURE().map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    labelid="Has_Exchange_Experience"
                    name="Has_Exchange_Experience"
                    id="Has_Exchange_Experience"
                    error={
                      survey.academic_background?.university
                        ?.Has_Exchange_Experience === '-'
                    }
                    helperText={
                      survey.academic_background?.university
                        ?.Has_Exchange_Experience === '-' &&
                      'Please provide university exchange student info.'
                    }
                    select
                    value={
                      survey.academic_background?.university
                        ?.Has_Exchange_Experience || '-'
                    }
                    label={t('Exchange Student Experience ?')}
                    onChange={(e) => handleChangeAcademic(e)}
                  >
                    {DUAL_STATE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="Highest_GPA_Uni"
                    name="Highest_GPA_Uni"
                    error={
                      survey.academic_background?.university
                        ?.Highest_GPA_Uni === '0' ||
                      survey.academic_background?.university
                        ?.Highest_GPA_Uni === null
                    }
                    helperText={
                      (survey.academic_background?.university
                        ?.Highest_GPA_Uni === '0' ||
                        survey.academic_background?.university
                          ?.Highest_GPA_Uni === null) &&
                      'Please provide highest GPA from your university.'
                    }
                    label={t('Highest Score GPA of your university program')}
                    type="number"
                    placeholder="4.3"
                    defaultValue={
                      survey.academic_background?.university?.Highest_GPA_Uni ||
                      0
                    }
                    onChange={(e) => handleChangeAcademic(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="Passing_GPA_Uni"
                    name="Passing_GPA_Uni"
                    error={
                      survey.academic_background?.university
                        ?.Passing_GPA_Uni === '0' ||
                      survey.academic_background?.university
                        ?.Passing_GPA_Uni === null
                    }
                    helperText={
                      (survey.academic_background?.university
                        ?.Passing_GPA_Uni === '0' ||
                        survey.academic_background?.university
                          ?.Passing_GPA_Uni === null) &&
                      'Please provide passing GPA from your university.'
                    }
                    label={t('Passing Score GPA of your university program')}
                    type="number"
                    placeholder="1.7"
                    defaultValue={
                      survey.academic_background?.university?.Passing_GPA_Uni ||
                      0
                    }
                    onChange={(e) => handleChangeAcademic(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="My_GPA_Uni"
                    name="My_GPA_Uni"
                    label={t('My GPA')}
                    type="number"
                    placeholder="3.7"
                    error={
                      survey.academic_background?.university?.My_GPA_Uni ===
                        '0' ||
                      survey.academic_background?.university?.My_GPA_Uni ===
                        null
                    }
                    helperText={
                      (survey.academic_background?.university?.My_GPA_Uni ===
                        '0' ||
                        survey.academic_background?.university?.My_GPA_Uni ===
                          null) &&
                      'Please provide passing GPA from your university.'
                    }
                    defaultValue={
                      survey.academic_background?.university?.My_GPA_Uni || 0
                    }
                    onChange={(e) => handleChangeAcademic(e)}
                  />
                </Grid>
              </>
            )}

            {['Yes'].includes(
              survey.academic_background?.university?.isGraduated
            ) && (
              <>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {t('Second degree (Another Bachelor or Master)', {
                      ns: 'survey'
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    labelid="isSecondGraduated"
                    name="isSecondGraduated"
                    id="isSecondGraduated"
                    error={
                      survey.academic_background?.university
                        ?.isSecondGraduated === '-'
                    }
                    helperText={
                      survey.academic_background?.university
                        ?.isSecondGraduated === '-' &&
                      'Please provide Second Degree info.'
                    }
                    select
                    value={
                      survey.academic_background?.university
                        ?.isSecondGraduated || '-'
                    }
                    label={t('Already Second Degree graduated ?')}
                    onChange={(e) => handleChangeAcademic(e)}
                  >
                    {BACHELOR_GRADUATE_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {['Yes', 'pending'].includes(
                  survey.academic_background?.university?.isSecondGraduated
                ) && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="attendedSecondDegreeUniversity"
                        name="attendedSecondDegreeUniversity"
                        error={
                          survey.academic_background?.university
                            ?.attendedSecondDegreeUniversity === ''
                        }
                        helperText={
                          survey.academic_background?.university
                            ?.attendedSecondDegreeUniversity === '' &&
                          'Please provide University name info.'
                        }
                        label={t('University Name')}
                        variant="outlined"
                        placeholder="National Taipei University"
                        value={
                          survey.academic_background?.university
                            ?.attendedSecondDegreeUniversity || ''
                        }
                        onChange={(e) => handleChangeAcademic(e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="attendedSecondDegreeProgram"
                        name="attendedSecondDegreeProgram"
                        label={t('Program Name')}
                        error={
                          survey.academic_background?.university
                            ?.attendedSecondDegreeProgram === ''
                        }
                        helperText={
                          survey.academic_background?.university
                            ?.attendedSecondDegreeProgram === '' &&
                          'Please provide program name info.'
                        }
                        variant="outlined"
                        placeholder="M.Sc. Electrical Engineering"
                        value={
                          survey.academic_background?.university
                            ?.attendedSecondDegreeProgram || ''
                        }
                        onChange={(e) => handleChangeAcademic(e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {survey.academic_background?.university
                        ?.isSecondGraduated !== '-' &&
                        survey.academic_background?.university
                          ?.isSecondGraduated !== 'No' && (
                          <TextField
                            fullWidth
                            labelid="expectedSecondDegreeGradDate"
                            name="expectedSecondDegreeGradDate"
                            id="expectedSecondDegreeGradDate"
                            error={
                              survey.academic_background?.university
                                ?.expectedSecondDegreeGradDate === '-'
                            }
                            helperText={
                              survey.academic_background?.university
                                ?.expectedSecondDegreeGradDate === '-' &&
                              'Please provide graduate date info.'
                            }
                            select
                            value={
                              survey.academic_background?.university
                                ?.expectedSecondDegreeGradDate || '-'
                            }
                            label={`${
                              survey?.academic_background?.university
                                .isSecondGraduated === 'No'
                                ? t('Leaved Year')
                                : survey?.academic_background?.university
                                    .isSecondGraduated === 'Yes'
                                ? t('Graduated Year')
                                : t('Expected Graduate Year')
                            }`}
                            onChange={(e) => handleChangeAcademic(e)}
                          >
                            {APPLICATION_YEARS_FUTURE().map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="highestSecondDegreeGPA"
                        name="highestSecondDegreeGPA"
                        error={
                          survey.academic_background?.university
                            ?.highestSecondDegreeGPA === '0' ||
                          survey.academic_background?.university
                            ?.highestSecondDegreeGPA === null
                        }
                        helperText={
                          (survey.academic_background?.university
                            ?.highestSecondDegreeGPA === '0' ||
                            survey.academic_background?.university
                              ?.highestSecondDegreeGPA === null) &&
                          'Please provide highest GPA from your university.'
                        }
                        label={t(
                          'Second Degree highest Score GPA of your university program'
                        )}
                        type="number"
                        placeholder="4.3"
                        defaultValue={
                          survey.academic_background?.university
                            ?.highestSecondDegreeGPA || 0
                        }
                        onChange={(e) => handleChangeAcademic(e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="passingSecondDegreeGPA"
                        name="passingSecondDegreeGPA"
                        error={
                          survey.academic_background?.university
                            ?.passingSecondDegreeGPA === '0' ||
                          survey.academic_background?.university
                            ?.passingSecondDegreeGPA === null
                        }
                        helperText={
                          (survey.academic_background?.university
                            ?.passingSecondDegreeGPA === '0' ||
                            survey.academic_background?.university
                              ?.passingSecondDegreeGPA === null) &&
                          'Please provide passing GPA from your university.'
                        }
                        label={t(
                          'Second Degree passing Score GPA of your university program'
                        )}
                        type="number"
                        placeholder="1.7"
                        defaultValue={
                          survey.academic_background?.university
                            ?.passingSecondDegreeGPA || 0
                        }
                        onChange={(e) => handleChangeAcademic(e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="mySecondDegreeGPA"
                        name="mySecondDegreeGPA"
                        label={t('My Second Degree GPA')}
                        type="number"
                        placeholder="3.7"
                        error={
                          survey.academic_background?.university
                            ?.mySecondDegreeGPA === '0' ||
                          survey.academic_background?.university
                            ?.mySecondDegreeGPA === null
                        }
                        helperText={
                          (survey.academic_background?.university
                            ?.mySecondDegreeGPA === '0' ||
                            survey.academic_background?.university
                              ?.mySecondDegreeGPA === null) &&
                          'Please provide passing GPA from your university.'
                        }
                        defaultValue={
                          survey.academic_background?.university
                            ?.mySecondDegreeGPA || 0
                        }
                        onChange={(e) => handleChangeAcademic(e)}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
            <Grid item xs={12}>
              <Typography variant="body1">
                {t('Practical Experience', { ns: 'survey' })}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="Has_Internship_Experience"
                name="Has_Internship_Experience"
                id={t('Internship Experience ?')}
                error={
                  survey.academic_background?.university
                    ?.Has_Internship_Experience === '-'
                }
                helperText={
                  survey.academic_background?.university
                    ?.Has_Internship_Experience === '-' &&
                  'Please provide internship experience info.'
                }
                select
                value={
                  survey.academic_background?.university
                    ?.Has_Internship_Experience || '-'
                }
                label={t('Internship Experience ?')}
                onChange={(e) => handleChangeAcademic(e)}
              >
                {DUAL_STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="Has_Working_Experience"
                id="Full-TimeJobExperience"
                error={
                  survey.academic_background?.university
                    ?.Has_Working_Experience === '-'
                }
                helperText={
                  survey.academic_background?.university
                    ?.Has_Working_Experience === '-' &&
                  'Please provide full-time working experience info.'
                }
                select
                value={
                  survey.academic_background?.university
                    ?.Has_Working_Experience || '-'
                }
                label={t('Full-Time Job Experience ?')}
                onChange={(e) => handleChangeAcademic(e)}
              >
                {DUAL_STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography>
                {t(
                  'About Higest GPA / Lowest passed GPA and my GPA, please follow this:'
                )}
              </Typography>
              <a
                href={
                  survey.survey_link && survey.survey_link != ''
                    ? survey.survey_link
                    : '/'
                }
                target="_blank"
                className="text-info"
                rel="noreferrer"
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<LinkIcon />}
                >
                  {t('Explanation')}
                </Button>
              </a>
              {is_TaiGer_Admin(user) && (
                <Button
                  onClick={openOffcanvasWindow}
                  style={{ cursor: 'pointer' }}
                >
                  {t('Edit', { ns: 'common' })}
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography>{t('Corresponding German GPA System')}:</Typography>
              <Typography>
                {survey.academic_background?.university?.My_GPA_Uni &&
                survey.academic_background?.university?.Passing_GPA_Uni &&
                survey.academic_background?.university?.Highest_GPA_Uni ? (
                  <>
                    <b>
                      {Bayerische_Formel(
                        survey.academic_background.university.Highest_GPA_Uni,
                        survey.academic_background.university.Passing_GPA_Uni,
                        survey.academic_background.university.My_GPA_Uni
                      )}
                    </b>{' '}
                    = 1 + (3 * (highest - my)) / (highest - passing) = 1 + (3 *
                    ({survey.academic_background?.university?.Highest_GPA_Uni} -{' '}
                    {survey.academic_background?.university?.My_GPA_Uni})) / (
                    {survey.academic_background?.university?.Highest_GPA_Uni} -{' '}
                    {survey.academic_background?.university?.Passing_GPA_Uni})
                  </>
                ) : (
                  0
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {t('Last update at')}:{' '}
                {survey.academic_background?.university?.updatedAt
                  ? convertDate(
                      survey.academic_background?.university.updatedAt
                    )
                  : ''}
                {user.archiv !== true && (
                  <>
                    <br />
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      disabled={!survey.changed_academic}
                      onClick={(e) =>
                        handleAcademicBackgroundSubmit(
                          e,
                          survey.academic_background.university
                        )
                      }
                      sx={{ mt: 2 }}
                    >
                      {t('Update', { ns: 'common' })}
                    </Button>
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ mt: 2, padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t('Application Preference')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip
                title={t(
                  'If you want to change this, please contact your agent.'
                )}
                placement="top"
              >
                <TextField
                  fullWidth
                  labelid="expected_application_date"
                  name="expected_application_date"
                  id="expected_application_date"
                  error={
                    survey.application_preference?.expected_application_date ===
                    ''
                  }
                  helperText={
                    survey.application_preference?.expected_application_date ===
                      '' && 'Please provide the info.'
                  }
                  disabled={is_TaiGer_Student(user)}
                  select
                  value={
                    survey.application_preference?.expected_application_date ||
                    ''
                  }
                  label={`${t('Expected Application Year')} (${t('Agent fill', {
                    ns: 'survey'
                  })})`}
                  onChange={(e) => handleChangeApplicationPreference(e)}
                >
                  {EXPECTATION_APPLICATION_YEARS().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip
                title={t(
                  'If you want to change this, please contact your agent.'
                )}
                placement="top"
              >
                <TextField
                  fullWidth
                  labelid="expected_application_semester"
                  name="expected_application_semester"
                  id="expected_application_semester"
                  error={
                    survey.application_preference
                      ?.expected_application_semester === ''
                  }
                  helperText={
                    survey.application_preference
                      ?.expected_application_semester === '' &&
                    'Please provide the info.'
                  }
                  disabled={is_TaiGer_Student(user)}
                  select
                  value={
                    survey?.application_preference
                      ?.expected_application_semester || ''
                  }
                  label={`${t('Expected Application Semester')} (${t(
                    'Agent fill',
                    { ns: 'survey' }
                  )})`}
                  onChange={(e) => handleChangeApplicationPreference(e)}
                >
                  {SEMESTER_ARRAY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="target-application-subject-label">
                  Target Application Subjects
                </InputLabel>
                <Select
                  labelId="target-application-subject-label"
                  id="target-application-subject"
                  multiple
                  value={personName}
                  onChange={handleChangeTest}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} variant="outlined" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <TextField
                fullWidth
                id="target-application-subject"
                name="target-application-subject"
                helperText={
                  survey.application_preference?.target_application_field ===
                    '' && 'Please provide the info.'
                }
                label={t('Target Application Subject')}
                variant="outlined"
                value={
                  survey.application_preference?.target_application_field || ''
                }
                onChange={(e) => handleChangeApplicationPreference(e)}
              /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                // To be deprecated
                disabled
                fullWidth
                id="target_application_field"
                name="target_application_field"
                helperText={
                  survey.application_preference?.target_application_field ===
                    '' && 'Please provide the info.'
                }
                label={t('Target Application Fields')}
                variant="outlined"
                placeholder="Data Science, Comupter Science, etc. (max. 40 characters)"
                value={
                  survey.application_preference?.target_application_field || ''
                }
                onChange={(e) => handleChangeApplicationPreference(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="target_degree"
                name="target_degree"
                id="target_degree"
                error={survey.application_preference?.target_degree === ''}
                helperText={
                  survey.application_preference?.target_degree === '' &&
                  'Please provide the info.'
                }
                select
                label={t('Target Degree Programs')}
                value={survey.application_preference?.target_degree || ''}
                onChange={(e) => handleChangeApplicationPreference(e)}
              >
                {DEGREE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="target_program_language"
                name="target_program_language"
                id="target_program_language"
                error={!survey.application_preference?.target_program_language}
                helperText={
                  !survey.application_preference?.target_program_language &&
                  'Please provide the info.'
                }
                select
                label={t('Target Program Language')}
                value={
                  survey.application_preference?.target_program_language || ''
                }
                onChange={(e) => handleChangeApplicationPreference(e)}
              >
                {LANGUAGES_PREFERENCE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="application_outside_germany"
                name="application_outside_germany"
                id="application_outside_germany"
                error={
                  survey.application_preference?.application_outside_germany ===
                  '-'
                }
                helperText={
                  survey.application_preference?.application_outside_germany ===
                    '-' && 'Please provide the info.'
                }
                select
                label={t('Considering universities outside Germany?')}
                value={
                  survey?.application_preference?.application_outside_germany ||
                  '-'
                }
                onChange={(e) => handleChangeApplicationPreference(e)}
              >
                {TRI_STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="considered_privat_universities"
                name="considered_privat_universities"
                id="considered_privat_universities"
                error={
                  survey.application_preference
                    ?.considered_privat_universities === '-'
                }
                helperText={
                  survey.application_preference
                    ?.considered_privat_universities === '-' &&
                  'Please provide the info.'
                }
                select
                label={t(
                  'Considering private universities? (Tuition Fee: ~15000 EURO/year)'
                )}
                value={
                  survey.application_preference
                    ?.considered_privat_universities || ''
                }
                onChange={(e) => handleChangeApplicationPreference(e)}
              >
                {TRI_STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="special_wished"
                name="special_wished"
                label={t('Other wish', { ns: 'survey' })}
                variant="outlined"
                multiline
                inputProps={{ maxLength: 600 }}
                placeholder="Example: QS Ranking 300, 只要德國"
                value={survey.application_preference?.special_wished || ''}
                onChange={(e) => handleChangeApplicationPreference(e)}
                minRows={5}
              />
              <Badge>
                {survey?.application_preference?.special_wished?.length || 0}
                /600
              </Badge>
            </Grid>
            {/* <Grid item xs={12} sm={6}></Grid> */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {t('Last update at')}:{' '}
                {survey.application_preference?.updatedAt
                  ? convertDate(survey.application_preference.updatedAt)
                  : ''}
              </Typography>
            </Grid>
          </Grid>
          {user.archiv !== true && (
            <>
              <br />
              <Button
                fullWidth
                color="primary"
                variant="contained"
                disabled={!survey.changed_application_preference}
                onClick={(e) =>
                  handleApplicationPreferenceSubmit(
                    e,
                    survey.application_preference
                  )
                }
              >
                {t('Update', { ns: 'common' })}
              </Button>
            </>
          )}
        </Card>
        <Card sx={{ mt: 2, padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t('Languages Test and Certificates')}
              </Typography>
              <Banner
                ReadOnlyMode={true}
                bg={'primary'}
                title={'warning'}
                path={'/'}
                text={
                  '若還沒考過，請在 Passed 處選 No，並填上檢定以及預計考試時間。若不需要（如德語），請填 Not Needed。方便顧問了解你的進度。'
                }
                link_name={''}
                removeBanner={<></>}
                notification_key={undefined}
              />
              {(survey.academic_background?.language?.english_isPassed ===
                'X' ||
                survey.academic_background?.language?.german_isPassed === 'X' ||
                survey.academic_background?.language?.gre_isPassed === 'X' ||
                survey.academic_background?.language?.gmat_isPassed ===
                  'X') && (
                <Banner
                  ReadOnlyMode={true}
                  bg={'danger'}
                  title={'warning'}
                  path={'/'}
                  text={
                    <>
                      報名考試時，請確認 <b>護照</b> 有無過期。
                    </>
                  }
                  link_name={''}
                  removeBanner={<></>}
                  notification_key={undefined}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                error={
                  survey.academic_background?.language?.english_isPassed === '-'
                }
                helperText={
                  survey.academic_background?.language?.english_isPassed ===
                    '-' && 'Please provide English info.'
                }
                select
                labelid="english_isPassed"
                id="english_isPassed"
                name="english_isPassed"
                value={
                  survey.academic_background?.language?.english_isPassed || '-'
                }
                label={t('English Passed ? (IELTS 6.5 / TOEFL 88)')}
                onChange={handleChangeLanguage}
              >
                {IS_PASSED_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {(survey?.academic_background?.language?.english_isPassed === 'O' ||
              survey?.academic_background?.language?.english_isPassed ===
                'X') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="english_certificate">
                    {t('English Certificate')}
                  </InputLabel>
                  <Select
                    id="english_certificate"
                    name="english_certificate"
                    value={
                      survey.academic_background?.language
                        ?.english_certificate || ''
                    }
                    label={t('English Certificate')}
                    onChange={handleChangeLanguage}
                  >
                    {ENGLISH_CERTIFICATE_ARRAY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {survey?.academic_background?.language?.english_isPassed ===
              'O' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="english_score"
                  name="english_score"
                  label="Overall"
                  type="number"
                  placeholder={`${
                    survey.academic_background.language.english_certificate ===
                    'IELTS'
                      ? '6.5'
                      : '92'
                  } `}
                  value={
                    survey.academic_background?.language?.english_score || ''
                  }
                  disabled={
                    survey.academic_background.language &&
                    survey.academic_background.language.english_certificate ===
                      'No'
                      ? true
                      : false
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            {survey?.academic_background?.language?.english_isPassed ===
              'O' && (
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  id="english_score_reading"
                  name="english_score_reading"
                  label="Reading"
                  type="number"
                  placeholder={`${
                    survey.academic_background.language.english_certificate ===
                    'IELTS'
                      ? '6.5'
                      : '21'
                  } `}
                  value={
                    survey.academic_background?.language
                      ?.english_score_reading || ''
                  }
                  disabled={
                    survey.academic_background?.language
                      ?.english_certificate === 'No'
                      ? true
                      : false
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            {survey?.academic_background?.language?.english_isPassed ===
              'O' && (
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  id="english_score_listening"
                  name="english_score_listening"
                  label="Listening"
                  type="number"
                  placeholder={`${
                    survey.academic_background.language.english_certificate ===
                    'IELTS'
                      ? '6.5'
                      : '21'
                  } `}
                  value={
                    survey.academic_background?.language
                      ?.english_score_listening || ''
                  }
                  disabled={
                    survey.academic_background?.language
                      ?.english_certificate === 'No'
                      ? true
                      : false
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            {survey?.academic_background?.language?.english_isPassed ===
              'O' && (
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  id="english_score_writing"
                  name="english_score_writing"
                  label="Writing"
                  type="number"
                  placeholder={`${
                    survey.academic_background.language.english_certificate ===
                    'IELTS'
                      ? '6.5'
                      : '21'
                  } `}
                  value={
                    survey.academic_background?.language
                      ?.english_score_writing || ''
                  }
                  disabled={
                    survey.academic_background?.language
                      ?.english_certificate === 'No'
                      ? true
                      : false
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            {survey?.academic_background?.language?.english_isPassed ===
              'O' && (
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  id="english_score_speaking"
                  name="english_score_speaking"
                  label="Speaking"
                  type="number"
                  placeholder={`${
                    survey.academic_background.language.english_certificate ===
                    'IELTS'
                      ? '6.5'
                      : '21'
                  } `}
                  value={
                    survey.academic_background?.language
                      ?.english_score_speaking || ''
                  }
                  disabled={
                    survey.academic_background?.language
                      ?.english_certificate === 'No'
                      ? true
                      : false
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            {survey?.academic_background?.language?.english_isPassed ===
              'X' && (
              <Grid item xs={12} lg={12} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="english_test_date"
                  name="english_test_date"
                  label={t('Expected English Test Date')}
                  type="date"
                  value={
                    survey.academic_background?.language?.english_test_date ||
                    ''
                  }
                  disabled={
                    survey.academic_background?.language
                      ?.english_certificate === 'No'
                      ? true
                      : false
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                labelid="german_isPassed"
                id="german_isPassed"
                name="german_isPassed"
                error={
                  survey.academic_background?.language?.german_isPassed === '-'
                }
                helperText={
                  survey.academic_background?.language?.german_isPassed ===
                    '-' && 'Please provide German test info.'
                }
                select
                value={survey.academic_background?.language?.german_isPassed}
                label={t(
                  'German Passed ? (Set Not need if applying English taught programs.)'
                )}
                onChange={handleChangeLanguage}
              >
                {IS_PASSED_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {(survey?.academic_background?.language?.german_isPassed === 'O' ||
              survey?.academic_background?.language?.german_isPassed ===
                'X') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="german_certificate">
                    {t('German Certificate')}
                  </InputLabel>
                  <Select
                    id="german_certificate"
                    name="german_certificate"
                    value={
                      survey.academic_background?.language
                        ?.german_certificate || ''
                    }
                    label={t('German Certificate')}
                    onChange={handleChangeLanguage}
                  >
                    {GERMAN_CERTIFICATE_ARRAY_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {survey?.academic_background?.language?.german_isPassed === 'O' && (
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  id="german_score"
                  name="german_score"
                  label={t('German Test Score')}
                  placeholder="(i.e. TestDaF: 4, or DSH: 2) "
                  value={
                    survey.academic_background?.language?.german_score || ''
                  }
                  disabled={
                    survey.academic_background?.language?.german_certificate ===
                    'No'
                      ? true
                      : false
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            {survey?.academic_background?.language?.german_isPassed === 'X' && (
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  id="german_test_date"
                  name="german_test_date"
                  label={t('Expected German Test Date')}
                  type="date"
                  value={
                    survey.academic_background?.language?.german_test_date || ''
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                error={
                  survey.academic_background?.language?.gre_isPassed === '-'
                }
                helperText={
                  survey.academic_background?.language?.gre_isPassed === '-' &&
                  'Please provide GRE info.'
                }
                labelid="gre_isPassed"
                select
                id="gre_isPassed"
                name="gre_isPassed"
                value={survey.academic_background?.language?.gre_isPassed}
                label="GRE Test ? (At least V145 Q160 )"
                onChange={handleChangeLanguage}
              >
                {IS_PASSED_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {(survey.academic_background?.language?.gre_isPassed === 'O' ||
              survey.academic_background?.language?.gre_isPassed === 'X') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="gre_certificate">{t('GRE Test')}</InputLabel>
                  <Select
                    id="gre_certificate"
                    name="gre_certificate"
                    value={
                      survey.academic_background?.language?.gre_certificate ||
                      ''
                    }
                    label="GRE Test"
                    onChange={handleChangeLanguage}
                  >
                    {GRE_CERTIFICATE_ARRAY_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {survey.academic_background?.language?.gre_isPassed === 'O' &&
              survey.academic_background?.language?.gre_certificate !== '' && (
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    id="gre_score"
                    name="gre_score"
                    label={t('GRE Test Score')}
                    variant="outlined"
                    placeholder="(i.e. V152Q167A3.5) "
                    value={
                      survey.academic_background?.language?.gre_score || ''
                    }
                    disabled={
                      survey.academic_background?.language?.gre_certificate ===
                      'No'
                        ? true
                        : false
                    }
                    onChange={(e) => handleChangeLanguage(e)}
                  />
                </Grid>
              )}
            {survey.academic_background?.language.gre_isPassed === 'X' && (
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  type="date"
                  name="gre_test_date"
                  label={t('Expected GRE Test Date')}
                  value={
                    survey.academic_background?.language?.gre_test_date || ''
                  }
                  placeholder="Date of GRE General/Subject Test"
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                labelid="gmat_isPassed"
                error={
                  survey.academic_background?.language?.gmat_isPassed === '-'
                }
                helperText={
                  survey.academic_background?.language?.gmat_isPassed === '-' &&
                  'Please provide GMAT info.'
                }
                id="gmat_isPassed"
                name="gmat_isPassed"
                value={survey.academic_background?.language?.gmat_isPassed}
                label="GMAT Test ? (At least 600 )"
                onChange={handleChangeLanguage}
              >
                {IS_PASSED_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {(survey.academic_background?.language?.gmat_isPassed === 'O' ||
              survey.academic_background?.language?.gmat_isPassed === 'X') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="gmat_certificate">
                    {t('GMAT Test')}
                  </InputLabel>
                  <Select
                    id="gmat_certificate"
                    name="gmat_certificate"
                    value={
                      survey.academic_background?.language?.gmat_certificate ||
                      ''
                    }
                    label="GMAT Test"
                    onChange={handleChangeLanguage}
                  >
                    {GMAT_CERTIFICATE_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {survey.academic_background?.language?.gmat_isPassed === 'O' &&
              survey.academic_background?.language?.gmat_certificate !== '' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="gmat_score"
                    name="gmat_score"
                    label={t('GMAT Test Score')}
                    variant="outlined"
                    placeholder="(i.e. 550, 620) "
                    value={
                      survey.academic_background?.language?.gmat_score || ''
                    }
                    disabled={
                      survey.academic_background?.language?.gmat_certificate ===
                      'No'
                        ? true
                        : false
                    }
                    onChange={(e) => handleChangeLanguage(e)}
                  />
                </Grid>
              )}
            {survey.academic_background?.language?.gmat_isPassed === 'X' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  id="gmat_test_date"
                  name="gmat_test_date"
                  label={t('Expected Test Date')}
                  type="date"
                  value={
                    survey.academic_background?.language?.gmat_test_date || ''
                  }
                  onChange={(e) => handleChangeLanguage(e)}
                />
              </Grid>
            )}
          </Grid>
          <Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('Last update at')}:
              {survey.academic_background?.language &&
              survey.academic_background?.language.updatedAt
                ? convertDate(survey.academic_background?.language.updatedAt)
                : ''}
              {user.archiv !== true && (
                <>
                  <br />
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    disabled={!survey.changed_language}
                    onClick={(e) =>
                      handleSurveyLanguageSubmit(
                        e,
                        survey.academic_background.language
                      )
                    }
                    sx={{ mt: 2 }}
                  >
                    {t('Update', { ns: 'common' })}
                  </Button>
                </>
              )}{' '}
            </Typography>
          </Box>
        </Card>
      </Box>
      <Dialog
        open={surveyEditableComponentState.baseDocsflagOffcanvas}
        onClose={closeOffcanvasWindow}
      >
        <DialogTitle>{t('Edit', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <TextField
            label={`Documentation Link for ${props.docName}`}
            placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
            value={survey.survey_link}
            onChange={(e) => onChangeURL(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => handleUpdateDocLink(e)}
            disabled={survey.baseDocsflagOffcanvasButtonDisable}
          >
            {t('Save', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SurveyEditableComponent;
