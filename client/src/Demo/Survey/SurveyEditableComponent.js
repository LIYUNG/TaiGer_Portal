import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
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
    Stack,
    Popover,
    IconButton
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import LinkIcon from '@mui/icons-material/Link';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Bayerische_Formel,
    is_TaiGer_Admin,
    is_TaiGer_Student
} from '@taiger-common/core';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { differenceInDays } from 'date-fns';

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
    PROGRAM_SUBJECTS_DETAILED,
    convertDate
} from '../../utils/contants';
import {
    check_academic_background_filled,
    check_languages_filled,
    check_application_preference_filled,
    MissingSurveyFieldsListArray
} from '../Utils/checking-functions';
import {
    APPLICATION_YEARS_FUTURE,
    EXPECTATION_APPLICATION_YEARS
} from '../../utils/contants';
import Banner from '../../components/Banner/Banner';
import SearchableMultiSelect from '../../components/Input/searchableMuliselect';
import { useAuth } from '../../components/AuthProvider';
import { useSurvey } from '../../components/SurveyProvider';
import { grey } from '@mui/material/colors';
import i18next from 'i18next';

const SurveyEditableComponent = (props) => {
    const {
        handleChangeAcademic,
        handleTestDate,
        handleChangeLanguage,
        handleChangeApplicationPreference,
        setApplicationPreferenceByField,
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
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleRowClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

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
        updateDocLink(survey.survey_link, 'Grading_System'); // props.k is the grading system name
        setSurveyEditableComponentState((prevState) => ({
            ...prevState,
            baseDocsflagOffcanvasButtonDisable: false,
            baseDocsflagOffcanvas: false
        }));
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
            {!check_academic_background_filled(survey.academic_background) ||
            !check_application_preference_filled(
                survey.application_preference
            ) ? (
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
            ) : null}
            {!check_languages_filled(survey.academic_background) ? (
                <Card sx={{ padding: 2 }}>
                    <Typography fontWeight="bold">
                        {t(
                            'Your language skills and certificates information are still missing or not up-to-date'
                        )}
                    </Typography>
                    {survey.academic_background?.language?.english_isPassed ===
                        '-' ||
                    !survey.academic_background?.language?.english_isPassed ? (
                        <li>{t('Do you need English Test')}?</li>
                    ) : survey.academic_background?.language
                          ?.english_isPassed === 'X' &&
                      differenceInDays(
                          new Date(),
                          survey.academic_background?.language
                              ?.english_test_date
                      ) > 1 ? (
                        <li>{t('English Passed ? (IELTS 6.5 / TOEFL 88)')}</li>
                    ) : survey.academic_background?.language
                          ?.english_isPassed !== '--' &&
                      survey.academic_background?.language
                          ?.english_test_date === '' ? (
                        <li>{t('English Test Date missing !')}</li>
                    ) : null}
                    {survey.academic_background?.language?.german_isPassed ===
                        '-' ||
                    !survey.academic_background?.language?.german_isPassed ? (
                        <li>
                            {t(
                                'German Passed ? (Set Not need if applying English taught programs.)'
                            )}
                        </li>
                    ) : survey.academic_background?.language
                          ?.german_isPassed === 'X' &&
                      differenceInDays(
                          new Date(),
                          survey.academic_background?.language?.german_test_date
                      ) > 1 ? (
                        <li>
                            {t(
                                'German Passed ? (Set Not need if applying English taught programs.)'
                            )}
                        </li>
                    ) : survey.academic_background?.language
                          ?.german_isPassed === 'X' &&
                      survey.academic_background?.language?.german_test_date ===
                          '' ? (
                        <li>{t('Expected German Test Date')}</li>
                    ) : null}
                    {survey.academic_background?.language?.gre_isPassed ===
                        '-' ||
                    !survey.academic_background?.language?.gre_isPassed ? (
                        <li>{t('Do you need GRE Test')}</li>
                    ) : survey.academic_background?.language?.gre_isPassed ===
                          'X' &&
                      differenceInDays(
                          new Date(),
                          survey.academic_background?.language?.gre_test_date
                      ) > 1 ? (
                        <li>{t('GRE Test passed ?')}</li>
                    ) : survey.academic_background?.language?.gre_isPassed ===
                          'X' &&
                      survey.academic_background?.language?.gre_test_date ===
                          '' ? (
                        <li>GRE Test Date not given</li>
                    ) : null}
                    {survey.academic_background?.language?.gmat_isPassed ===
                        '-' ||
                    !survey.academic_background?.language?.gmat_isPassed ? (
                        <li>{t('Do you need GMAT Test')}?</li>
                    ) : survey.academic_background?.language?.gmat_isPassed ===
                          'X' &&
                      differenceInDays(
                          new Date(),
                          survey.academic_background?.language?.gmat_test_date
                      ) > 1 ? (
                        <li>{t('GMAT Test passed ?')}</li>
                    ) : survey.academic_background?.language?.gmat_isPassed ===
                          'X' &&
                      survey.academic_background?.language?.gmat_test_date ===
                          '' ? (
                        <li>GMAT Test Date not given</li>
                    ) : null}
                </Card>
            ) : null}
            <Box>
                <Card sx={{ mt: 2, padding: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                {t('Academic Background Survey')}
                            </Typography>
                            <Typography variant="body1">
                                {t('High School')}
                            </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.university
                                        ?.attended_high_school === ''
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.university
                                        ?.attended_high_school === ''
                                        ? 'Please provide High school name'
                                        : null
                                }
                                id="attended_high_school"
                                label={t('High School Name (English)')}
                                name="attended_high_school"
                                onChange={(e) => handleChangeAcademic(e)}
                                placeholder="Taipei First Girls' High School"
                                value={
                                    survey.academic_background?.university
                                        ?.attended_high_school || ''
                                }
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.university
                                        ?.high_school_isGraduated === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.university
                                        ?.high_school_isGraduated === '-'
                                        ? 'Please provide High school graduation info'
                                        : null
                                }
                                id="high_school_isGraduated"
                                label={t('High School already graduated')}
                                labelid="high_school_isGraduated"
                                name="high_school_isGraduated"
                                onChange={(e) => handleChangeAcademic(e)}
                                select
                                value={
                                    survey.academic_background?.university
                                        ?.high_school_isGraduated || '-'
                                }
                            >
                                {HIG_SCHOOL_TRI_STATE_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {t(option.label, { ns: 'common' })}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            {survey.academic_background?.university
                                ?.high_school_isGraduated !== '-' ? (
                                <>
                                    <TextField
                                        fullWidth
                                        id="high_school_graduated_year"
                                        label={`${
                                            survey.academic_background
                                                ?.university
                                                .high_school_isGraduated ===
                                            'Yes'
                                                ? t('High School Graduate Year')
                                                : survey.academic_background
                                                        ?.university
                                                        .high_school_isGraduated ===
                                                    'No'
                                                  ? t(
                                                        'High School Graduate leaved Year'
                                                    )
                                                  : survey.academic_background
                                                        ?.university
                                                        ?.high_school_isGraduated ===
                                                        'pending' &&
                                                    t(
                                                        'Expected High School Graduate Year'
                                                    )
                                        }`}
                                        name="high_school_graduated_year"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        placeholder="2016"
                                        value={
                                            survey.academic_background
                                                ?.university
                                                ?.high_school_graduated_year
                                                ? survey.academic_background
                                                      .university
                                                      .high_school_graduated_year
                                                : ''
                                        }
                                        variant="outlined"
                                    />
                                    <br />
                                </>
                            ) : null}
                        </Grid>
                        <Grid item sm={6} xs={12} />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography sx={{ mt: 2 }} variant="body1">
                                {t('University (Bachelor degree)', {
                                    ns: 'survey'
                                })}
                            </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.university
                                        ?.isGraduated === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.university
                                        ?.isGraduated === '-'
                                        ? 'Please provide Bachelor info.'
                                        : null
                                }
                                id="isGraduated"
                                label={t('Already Bachelor graduated ?')}
                                labelid="isGraduated"
                                name="isGraduated"
                                onChange={(e) => handleChangeAcademic(e)}
                                select
                                value={
                                    survey.academic_background?.university
                                        ?.isGraduated || '-'
                                }
                            >
                                {BACHELOR_GRADUATE_STATUS_OPTIONS.map(
                                    (option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        </Grid>
                        {['Yes', 'pending'].includes(
                            survey.academic_background?.university?.isGraduated
                        ) ? (
                            <>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        error={
                                            survey.academic_background
                                                ?.university
                                                ?.attended_university === ''
                                        }
                                        fullWidth
                                        helperText={
                                            survey.academic_background
                                                ?.university
                                                ?.attended_university === ''
                                                ? 'Please provide University name info.'
                                                : null
                                        }
                                        id="attended_university"
                                        label={t(
                                            'University Name (Bachelor degree)'
                                        )}
                                        name="attended_university"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        placeholder="National Yilan University"
                                        value={
                                            survey.academic_background
                                                ?.university
                                                ?.attended_university || ''
                                        }
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        error={
                                            survey.academic_background
                                                ?.university
                                                ?.attended_university_program ===
                                            ''
                                        }
                                        fullWidth
                                        helperText={
                                            survey.academic_background
                                                ?.university
                                                ?.attended_university_program ===
                                            ''
                                                ? 'Please provide program name info.'
                                                : null
                                        }
                                        id="attended_university_program"
                                        label={t('Program Name')}
                                        name="attended_university_program"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        placeholder="B.Sc. Electrical Engineering"
                                        value={
                                            survey.academic_background
                                                ?.university
                                                ?.attended_university_program ||
                                            ''
                                        }
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    {survey.academic_background?.university
                                        ?.isGraduated !== '-' &&
                                    survey.academic_background?.university
                                        ?.isGraduated !== 'No' ? (
                                        <TextField
                                            error={
                                                survey.academic_background
                                                    ?.university
                                                    ?.expected_grad_date === '-'
                                            }
                                            fullWidth
                                            helperText={
                                                survey.academic_background
                                                    ?.university
                                                    ?.expected_grad_date === '-'
                                                    ? 'Please provide graduate date info.'
                                                    : null
                                            }
                                            id="expected_grad_date"
                                            label={`${
                                                survey?.academic_background
                                                    ?.university.isGraduated ===
                                                'No'
                                                    ? t('Leaved Year')
                                                    : survey
                                                            ?.academic_background
                                                            ?.university
                                                            .isGraduated ===
                                                        'Yes'
                                                      ? t('Graduated Year')
                                                      : t(
                                                            'Expected Graduate Year'
                                                        )
                                            }`}
                                            labelid="expected_grad_date"
                                            name="expected_grad_date"
                                            onChange={(e) =>
                                                handleChangeAcademic(e)
                                            }
                                            select
                                            value={
                                                survey.academic_background
                                                    ?.university
                                                    ?.expected_grad_date || '-'
                                            }
                                        >
                                            {APPLICATION_YEARS_FUTURE().map(
                                                (option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>
                                    ) : null}
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        error={
                                            survey.academic_background
                                                ?.university
                                                ?.Has_Exchange_Experience ===
                                            '-'
                                        }
                                        fullWidth
                                        helperText={
                                            survey.academic_background
                                                ?.university
                                                ?.Has_Exchange_Experience ===
                                            '-'
                                                ? 'Please provide university exchange student info.'
                                                : null
                                        }
                                        id="Has_Exchange_Experience"
                                        label={t(
                                            'Exchange Student Experience ?'
                                        )}
                                        labelid="Has_Exchange_Experience"
                                        name="Has_Exchange_Experience"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        select
                                        value={
                                            survey.academic_background
                                                ?.university
                                                ?.Has_Exchange_Experience || '-'
                                        }
                                    >
                                        {DUAL_STATE_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        defaultValue={
                                            survey.academic_background
                                                ?.university?.Highest_GPA_Uni ||
                                            0
                                        }
                                        error={
                                            survey.academic_background
                                                ?.university
                                                ?.Highest_GPA_Uni === '0' ||
                                            survey.academic_background
                                                ?.university
                                                ?.Highest_GPA_Uni === null
                                        }
                                        fullWidth
                                        helperText={
                                            survey.academic_background
                                                ?.university
                                                ?.Highest_GPA_Uni === '0' ||
                                            survey.academic_background
                                                ?.university
                                                ?.Highest_GPA_Uni === null
                                                ? 'Please provide highest GPA from your university.'
                                                : null
                                        }
                                        id="Highest_GPA_Uni"
                                        label={t(
                                            'Highest Score GPA of your university program'
                                        )}
                                        name="Highest_GPA_Uni"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        placeholder="4.3"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        defaultValue={
                                            survey.academic_background
                                                ?.university?.Passing_GPA_Uni ||
                                            0
                                        }
                                        error={
                                            survey.academic_background
                                                ?.university
                                                ?.Passing_GPA_Uni === '0' ||
                                            survey.academic_background
                                                ?.university
                                                ?.Passing_GPA_Uni === null
                                        }
                                        fullWidth
                                        helperText={
                                            survey.academic_background
                                                ?.university
                                                ?.Passing_GPA_Uni === '0' ||
                                            survey.academic_background
                                                ?.university
                                                ?.Passing_GPA_Uni === null
                                                ? 'Please provide passing GPA from your university.'
                                                : null
                                        }
                                        id="Passing_GPA_Uni"
                                        label={t(
                                            'Passing Score GPA of your university program'
                                        )}
                                        name="Passing_GPA_Uni"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        placeholder="1.7"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        defaultValue={
                                            survey.academic_background
                                                ?.university?.My_GPA_Uni || 0
                                        }
                                        error={
                                            survey.academic_background
                                                ?.university?.My_GPA_Uni ===
                                                '0' ||
                                            survey.academic_background
                                                ?.university?.My_GPA_Uni ===
                                                null
                                        }
                                        fullWidth
                                        helperText={
                                            survey.academic_background
                                                ?.university?.My_GPA_Uni ===
                                                '0' ||
                                            survey.academic_background
                                                ?.university?.My_GPA_Uni ===
                                                null
                                                ? 'Please provide passing GPA from your university.'
                                                : null
                                        }
                                        id="My_GPA_Uni"
                                        label={t('My GPA')}
                                        name="My_GPA_Uni"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        placeholder="3.7"
                                        type="number"
                                    />
                                </Grid>
                            </>
                        ) : null}
                        <Grid item sm={6} xs={12}>
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                spacing={1}
                            >
                                <Typography>
                                    {t('Corresponding German GPA System')}:{' '}
                                </Typography>
                                <Typography>
                                    {survey.academic_background?.university
                                        ?.My_GPA_Uni &&
                                    survey.academic_background?.university
                                        ?.Passing_GPA_Uni &&
                                    survey.academic_background?.university
                                        ?.Highest_GPA_Uni ? (
                                        <b>
                                            {Bayerische_Formel(
                                                survey.academic_background
                                                    .university.Highest_GPA_Uni,
                                                survey.academic_background
                                                    .university.Passing_GPA_Uni,
                                                survey.academic_background
                                                    .university.My_GPA_Uni
                                            )}
                                        </b>
                                    ) : (
                                        0
                                    )}
                                </Typography>
                                <HelpIcon
                                    onClick={handleRowClick}
                                    style={{ color: grey[400] }}
                                    title={i18next.t('explanation', {
                                        ns: 'common'
                                    })}
                                />
                                <Popover
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left'
                                    }}
                                    onClose={handleClose}
                                    open={open}
                                >
                                    <Typography sx={{ m: 2 }}>
                                        <b>
                                            {Bayerische_Formel(
                                                survey.academic_background
                                                    .university.Highest_GPA_Uni,
                                                survey.academic_background
                                                    .university.Passing_GPA_Uni,
                                                survey.academic_background
                                                    .university.My_GPA_Uni
                                            )}
                                        </b>{' '}
                                        = 1 + (3 * (highest - my)) / (highest -
                                        passing) = 1 + (3 * (
                                        {
                                            survey.academic_background
                                                ?.university?.Highest_GPA_Uni
                                        }{' '}
                                        -{' '}
                                        {
                                            survey.academic_background
                                                ?.university?.My_GPA_Uni
                                        }
                                        )) / (
                                        {
                                            survey.academic_background
                                                ?.university?.Highest_GPA_Uni
                                        }{' '}
                                        -{' '}
                                        {
                                            survey.academic_background
                                                ?.university?.Passing_GPA_Uni
                                        }
                                        )
                                    </Typography>
                                </Popover>
                            </Stack>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={1}
                            >
                                <Typography variant="body1">
                                    {t('gpa-instructions')}
                                </Typography>
                                <IconButton
                                    component={LinkDom}
                                    rel="noopener noreferrer"
                                    size="small"
                                    target="_blank"
                                    to={
                                        survey.survey_link &&
                                        survey.survey_link != ''
                                            ? survey.survey_link
                                            : '/'
                                    }
                                    variant="outlined"
                                >
                                    <LinkIcon fontSize="small" />
                                </IconButton>
                                {is_TaiGer_Admin(user) ? (
                                    <Button
                                        onClick={openOffcanvasWindow}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {t('Edit', { ns: 'common' })}
                                    </Button>
                                ) : null}
                            </Stack>
                        </Grid>
                        {['Yes'].includes(
                            survey.academic_background?.university?.isGraduated
                        ) ? (
                            <>
                                <Grid item xs={12}>
                                    <Typography sx={{ mt: 2 }} variant="body1">
                                        {t(
                                            'Second degree (Another Bachelor or Master)',
                                            {
                                                ns: 'survey'
                                            }
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        error={
                                            survey.academic_background
                                                ?.university
                                                ?.isSecondGraduated === '-'
                                        }
                                        fullWidth
                                        helperText={
                                            survey.academic_background
                                                ?.university
                                                ?.isSecondGraduated === '-'
                                                ? 'Please provide Second Degree info.'
                                                : null
                                        }
                                        id="isSecondGraduated"
                                        label={t(
                                            'Already Second Degree graduated ?'
                                        )}
                                        labelid="isSecondGraduated"
                                        name="isSecondGraduated"
                                        onChange={(e) =>
                                            handleChangeAcademic(e)
                                        }
                                        select
                                        value={
                                            survey.academic_background
                                                ?.university
                                                ?.isSecondGraduated || '-'
                                        }
                                    >
                                        {BACHELOR_GRADUATE_STATUS_OPTIONS.map(
                                            (option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </Grid>
                                {['Yes', 'pending'].includes(
                                    survey.academic_background?.university
                                        ?.isSecondGraduated
                                ) ? (
                                    <>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                error={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.attendedSecondDegreeUniversity ===
                                                    ''
                                                }
                                                fullWidth
                                                helperText={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.attendedSecondDegreeUniversity ===
                                                    ''
                                                        ? 'Please provide University name info.'
                                                        : null
                                                }
                                                id="attendedSecondDegreeUniversity"
                                                label={t('University Name')}
                                                name="attendedSecondDegreeUniversity"
                                                onChange={(e) =>
                                                    handleChangeAcademic(e)
                                                }
                                                placeholder="National Taipei University"
                                                value={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.attendedSecondDegreeUniversity ||
                                                    ''
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                error={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.attendedSecondDegreeProgram ===
                                                    ''
                                                }
                                                fullWidth
                                                helperText={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.attendedSecondDegreeProgram ===
                                                    ''
                                                        ? 'Please provide program name info.'
                                                        : null
                                                }
                                                id="attendedSecondDegreeProgram"
                                                label={t('Program Name')}
                                                name="attendedSecondDegreeProgram"
                                                onChange={(e) =>
                                                    handleChangeAcademic(e)
                                                }
                                                placeholder="M.Sc. Electrical Engineering"
                                                value={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.attendedSecondDegreeProgram ||
                                                    ''
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            {survey.academic_background
                                                ?.university
                                                ?.isSecondGraduated !== '-' &&
                                            survey.academic_background
                                                ?.university
                                                ?.isSecondGraduated !== 'No' ? (
                                                <TextField
                                                    error={
                                                        survey
                                                            .academic_background
                                                            ?.university
                                                            ?.expectedSecondDegreeGradDate ===
                                                        '-'
                                                    }
                                                    fullWidth
                                                    helperText={
                                                        survey
                                                            .academic_background
                                                            ?.university
                                                            ?.expectedSecondDegreeGradDate ===
                                                        '-'
                                                            ? 'Please provide graduate date info.'
                                                            : null
                                                    }
                                                    id="expectedSecondDegreeGradDate"
                                                    label={`${
                                                        survey
                                                            ?.academic_background
                                                            ?.university
                                                            .isSecondGraduated ===
                                                        'No'
                                                            ? t('Leaved Year')
                                                            : survey
                                                                    ?.academic_background
                                                                    ?.university
                                                                    .isSecondGraduated ===
                                                                'Yes'
                                                              ? t(
                                                                    'Graduated Year'
                                                                )
                                                              : t(
                                                                    'Expected Graduate Year'
                                                                )
                                                    }`}
                                                    labelid="expectedSecondDegreeGradDate"
                                                    name="expectedSecondDegreeGradDate"
                                                    onChange={(e) =>
                                                        handleChangeAcademic(e)
                                                    }
                                                    select
                                                    value={
                                                        survey
                                                            .academic_background
                                                            ?.university
                                                            ?.expectedSecondDegreeGradDate ||
                                                        '-'
                                                    }
                                                >
                                                    {APPLICATION_YEARS_FUTURE().map(
                                                        (option) => (
                                                            <MenuItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </TextField>
                                            ) : null}
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                defaultValue={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.highestSecondDegreeGPA ||
                                                    0
                                                }
                                                error={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.highestSecondDegreeGPA ===
                                                        '0' ||
                                                    survey.academic_background
                                                        ?.university
                                                        ?.highestSecondDegreeGPA ===
                                                        null
                                                }
                                                fullWidth
                                                helperText={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.highestSecondDegreeGPA ===
                                                        '0' ||
                                                    survey.academic_background
                                                        ?.university
                                                        ?.highestSecondDegreeGPA ===
                                                        null
                                                        ? 'Please provide highest GPA from your university.'
                                                        : null
                                                }
                                                id="highestSecondDegreeGPA"
                                                label={t(
                                                    'Second Degree highest Score GPA of your university program'
                                                )}
                                                name="highestSecondDegreeGPA"
                                                onChange={(e) =>
                                                    handleChangeAcademic(e)
                                                }
                                                placeholder="4.3"
                                                type="number"
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                defaultValue={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.passingSecondDegreeGPA ||
                                                    0
                                                }
                                                error={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.passingSecondDegreeGPA ===
                                                        '0' ||
                                                    survey.academic_background
                                                        ?.university
                                                        ?.passingSecondDegreeGPA ===
                                                        null
                                                }
                                                fullWidth
                                                helperText={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.passingSecondDegreeGPA ===
                                                        '0' ||
                                                    survey.academic_background
                                                        ?.university
                                                        ?.passingSecondDegreeGPA ===
                                                        null
                                                        ? 'Please provide passing GPA from your university.'
                                                        : null
                                                }
                                                id="passingSecondDegreeGPA"
                                                label={t(
                                                    'Second Degree passing Score GPA of your university program'
                                                )}
                                                name="passingSecondDegreeGPA"
                                                onChange={(e) =>
                                                    handleChangeAcademic(e)
                                                }
                                                placeholder="1.7"
                                                type="number"
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                defaultValue={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.mySecondDegreeGPA || 0
                                                }
                                                error={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.mySecondDegreeGPA ===
                                                        '0' ||
                                                    survey.academic_background
                                                        ?.university
                                                        ?.mySecondDegreeGPA ===
                                                        null
                                                }
                                                fullWidth
                                                helperText={
                                                    survey.academic_background
                                                        ?.university
                                                        ?.mySecondDegreeGPA ===
                                                        '0' ||
                                                    survey.academic_background
                                                        ?.university
                                                        ?.mySecondDegreeGPA ===
                                                        null
                                                        ? 'Please provide passing GPA from your university.'
                                                        : null
                                                }
                                                id="mySecondDegreeGPA"
                                                label={t(
                                                    'My Second Degree GPA'
                                                )}
                                                name="mySecondDegreeGPA"
                                                onChange={(e) =>
                                                    handleChangeAcademic(e)
                                                }
                                                placeholder="3.7"
                                                type="number"
                                            />
                                        </Grid>
                                    </>
                                ) : null}
                            </>
                        ) : null}
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                {t('Practical Experience', { ns: 'survey' })}
                            </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.university
                                        ?.Has_Internship_Experience === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.university
                                        ?.Has_Internship_Experience === '-'
                                        ? 'Please provide internship experience info.'
                                        : null
                                }
                                id={t('Internship Experience ?')}
                                label={t('Internship Experience ?')}
                                labelid="Has_Internship_Experience"
                                name="Has_Internship_Experience"
                                onChange={(e) => handleChangeAcademic(e)}
                                select
                                value={
                                    survey.academic_background?.university
                                        ?.Has_Internship_Experience || '-'
                                }
                            >
                                {DUAL_STATE_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.university
                                        ?.Has_Working_Experience === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.university
                                        ?.Has_Working_Experience === '-'
                                        ? 'Please provide full-time working experience info.'
                                        : null
                                }
                                id="Full-TimeJobExperience"
                                label={t('Full-Time Job Experience ?')}
                                name="Has_Working_Experience"
                                onChange={(e) => handleChangeAcademic(e)}
                                select
                                value={
                                    survey.academic_background?.university
                                        ?.Has_Working_Experience || '-'
                                }
                            >
                                {DUAL_STATE_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ mt: 2 }} variant="body2">
                                {t('Last update at')}:{' '}
                                {survey.academic_background?.university
                                    ?.updatedAt
                                    ? convertDate(
                                          survey.academic_background?.university
                                              .updatedAt
                                      )
                                    : ''}
                                {user.archiv !== true ? (
                                    <>
                                        <br />
                                        <Button
                                            color="primary"
                                            disabled={!survey.changed_academic}
                                            fullWidth
                                            onClick={(e) =>
                                                handleAcademicBackgroundSubmit(
                                                    e,
                                                    survey.academic_background
                                                        .university
                                                )
                                            }
                                            sx={{ mt: 2 }}
                                            variant="contained"
                                        >
                                            {t('Update', { ns: 'common' })}
                                        </Button>
                                    </>
                                ) : null}
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
                        <Grid item sm={6} xs={12}>
                            <Tooltip
                                placement="top"
                                title={t(
                                    'If you want to change this, please contact your agent.'
                                )}
                            >
                                <TextField
                                    disabled={is_TaiGer_Student(user)}
                                    error={
                                        survey.application_preference
                                            ?.expected_application_date === ''
                                    }
                                    fullWidth
                                    helperText={
                                        survey.application_preference
                                            ?.expected_application_date === ''
                                            ? 'Please provide the info.'
                                            : null
                                    }
                                    id="expected_application_date"
                                    label={`${t('Expected Application Year')} (${t(
                                        'Agent fill',
                                        {
                                            ns: 'survey'
                                        }
                                    )})`}
                                    labelid="expected_application_date"
                                    name="expected_application_date"
                                    onChange={(e) =>
                                        handleChangeApplicationPreference(e)
                                    }
                                    select
                                    value={
                                        survey.application_preference
                                            ?.expected_application_date || ''
                                    }
                                >
                                    {EXPECTATION_APPLICATION_YEARS().map(
                                        (option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            </Tooltip>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Tooltip
                                placement="top"
                                title={t(
                                    'If you want to change this, please contact your agent.'
                                )}
                            >
                                <TextField
                                    disabled={is_TaiGer_Student(user)}
                                    error={
                                        survey.application_preference
                                            ?.expected_application_semester ===
                                        ''
                                    }
                                    fullWidth
                                    helperText={
                                        survey.application_preference
                                            ?.expected_application_semester ===
                                        ''
                                            ? 'Please provide the info.'
                                            : null
                                    }
                                    id="expected_application_semester"
                                    label={`${t('Expected Application Semester')} (${t(
                                        'Agent fill',
                                        { ns: 'survey' }
                                    )})`}
                                    labelid="expected_application_semester"
                                    name="expected_application_semester"
                                    onChange={(e) =>
                                        handleChangeApplicationPreference(e)
                                    }
                                    select
                                    value={
                                        survey?.application_preference
                                            ?.expected_application_semester ||
                                        ''
                                    }
                                >
                                    {SEMESTER_ARRAY_OPTIONS.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Tooltip>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <SearchableMultiSelect
                                data={PROGRAM_SUBJECTS_DETAILED}
                                label={t('Target Application Subjects')}
                                name="target-application-subjects"
                                setValue={setApplicationPreferenceByField(
                                    'targetApplicationSubjects'
                                )}
                                value={
                                    survey.application_preference
                                        ?.targetApplicationSubjects
                                }
                            />
                        </Grid>
                        {survey.application_preference
                            ?.target_application_field != '' ? (
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    disabled
                                    fullWidth
                                    helperText={
                                        survey.application_preference
                                            ?.target_application_field === ''
                                            ? 'Please provide the info.'
                                            : null
                                    }
                                    id="target_application_field"
                                    label={t('Target Application Fields')}
                                    name="target_application_field"
                                    onChange={(e) =>
                                        handleChangeApplicationPreference(e)
                                    }
                                    placeholder="Data Science, Comupter Science, etc. (max. 40 characters)"
                                    value={
                                        survey.application_preference
                                            ?.target_application_field || ''
                                    }
                                    variant="outlined"
                                />
                            </Grid>
                        ) : null}

                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.application_preference
                                        ?.target_degree === ''
                                }
                                fullWidth
                                helperText={
                                    survey.application_preference
                                        ?.target_degree === ''
                                        ? 'Please provide the info.'
                                        : null
                                }
                                id="target_degree"
                                label={t('Target Degree Programs')}
                                labelid="target_degree"
                                name="target_degree"
                                onChange={(e) =>
                                    handleChangeApplicationPreference(e)
                                }
                                select
                                value={
                                    survey.application_preference
                                        ?.target_degree || ''
                                }
                            >
                                {DEGREE_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    !survey.application_preference
                                        ?.target_program_language
                                }
                                fullWidth
                                helperText={
                                    !survey.application_preference
                                        ?.target_program_language
                                        ? 'Please provide the info.'
                                        : null
                                }
                                id="target_program_language"
                                label={t('Target Program Language')}
                                labelid="target_program_language"
                                name="target_program_language"
                                onChange={(e) =>
                                    handleChangeApplicationPreference(e)
                                }
                                select
                                value={
                                    survey.application_preference
                                        ?.target_program_language || ''
                                }
                            >
                                {LANGUAGES_PREFERENCE_ARRAY_OPTIONS.map(
                                    (option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {t(option.label)}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.application_preference
                                        ?.application_outside_germany === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.application_preference
                                        ?.application_outside_germany === '-'
                                        ? 'Please provide the info.'
                                        : null
                                }
                                id="application_outside_germany"
                                label={t(
                                    'Considering universities outside Germany?'
                                )}
                                labelid="application_outside_germany"
                                name="application_outside_germany"
                                onChange={(e) =>
                                    handleChangeApplicationPreference(e)
                                }
                                select
                                value={
                                    survey?.application_preference
                                        ?.application_outside_germany || '-'
                                }
                            >
                                {TRI_STATE_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                error={
                                    survey.application_preference
                                        ?.considered_privat_universities === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.application_preference
                                        ?.considered_privat_universities === '-'
                                        ? 'Please provide the info.'
                                        : null
                                }
                                id="considered_privat_universities"
                                label={t(
                                    'Considering private universities? (Tuition Fee: ~15000 EURO/year)'
                                )}
                                labelid="considered_privat_universities"
                                name="considered_privat_universities"
                                onChange={(e) =>
                                    handleChangeApplicationPreference(e)
                                }
                                select
                                value={
                                    survey.application_preference
                                        ?.considered_privat_universities || ''
                                }
                            >
                                {TRI_STATE_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                id="special_wished"
                                inputProps={{ maxLength: 600 }}
                                label={t('Other wish', { ns: 'survey' })}
                                minRows={5}
                                multiline
                                name="special_wished"
                                onChange={(e) =>
                                    handleChangeApplicationPreference(e)
                                }
                                placeholder="Example: QS Ranking 300, 只要德國"
                                value={
                                    survey.application_preference
                                        ?.special_wished || ''
                                }
                                variant="outlined"
                            />
                            <Badge>
                                {survey?.application_preference?.special_wished
                                    ?.length || 0}
                                /600
                            </Badge>
                        </Grid>
                        {/* <Grid item xs={12} sm={6}></Grid> */}
                        <Grid item sm={6} xs={12}>
                            <Typography sx={{ mt: 2 }} variant="body2">
                                {t('Last update at')}:{' '}
                                {survey.application_preference?.updatedAt
                                    ? convertDate(
                                          survey.application_preference
                                              .updatedAt
                                      )
                                    : ''}
                            </Typography>
                        </Grid>
                    </Grid>
                    {user.archiv !== true ? (
                        <>
                            <br />
                            <Button
                                color="primary"
                                disabled={
                                    !survey.changed_application_preference
                                }
                                fullWidth
                                onClick={(e) =>
                                    handleApplicationPreferenceSubmit(
                                        e,
                                        survey.application_preference
                                    )
                                }
                                variant="contained"
                            >
                                {t('Update', { ns: 'common' })}
                            </Button>
                        </>
                    ) : null}
                </Card>
                <Card sx={{ mt: 2, padding: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                {t('Languages Test and Certificates')}
                            </Typography>
                            <Banner
                                ReadOnlyMode={true}
                                bg="primary"
                                link_name=""
                                notification_key={undefined}
                                path="/"
                                removeBanner={null}
                                text="若還沒考過，請在 Passed 處選 No，並填上檢定以及預計考試時間。若不需要（如德語），請填 Not Needed。方便顧問了解你的進度。"
                                title="warning"
                            />
                            {survey.academic_background?.language
                                ?.english_isPassed === 'X' ||
                            survey.academic_background?.language
                                ?.german_isPassed === 'X' ||
                            survey.academic_background?.language
                                ?.gre_isPassed === 'X' ||
                            survey.academic_background?.language
                                ?.gmat_isPassed === 'X' ? (
                                <Banner
                                    ReadOnlyMode={true}
                                    bg="danger"
                                    link_name=""
                                    notification_key={undefined}
                                    path="/"
                                    removeBanner={null}
                                    text={
                                        <>
                                            報名考試時，請確認 <b>護照</b>{' '}
                                            有無過期。
                                        </>
                                    }
                                    title="warning"
                                />
                            ) : null}
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.language
                                        ?.english_isPassed === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.language
                                        ?.english_isPassed === '-'
                                        ? 'Please provide English info.'
                                        : null
                                }
                                id="english_isPassed"
                                label={t(
                                    'English Passed ? (IELTS 6.5 / TOEFL 88)'
                                )}
                                labelid="english_isPassed"
                                name="english_isPassed"
                                onChange={handleChangeLanguage}
                                select
                                sx={{ mt: 1 }}
                                value={
                                    survey.academic_background?.language
                                        ?.english_isPassed || '-'
                                }
                            >
                                {IS_PASSED_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            {survey?.academic_background?.language
                                ?.english_isPassed === 'O' ||
                            survey?.academic_background?.language
                                ?.english_isPassed === 'X' ? (
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel id="english_certificate">
                                        {t('English Certificate')}
                                    </InputLabel>
                                    <Select
                                        id="english_certificate"
                                        label={t('English Certificate')}
                                        name="english_certificate"
                                        onChange={handleChangeLanguage}
                                        value={
                                            survey.academic_background?.language
                                                ?.english_certificate || ''
                                        }
                                    >
                                        {ENGLISH_CERTIFICATE_ARRAY_OPTIONS.map(
                                            (option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            ) : null}
                        </Grid>
                        <Grid item lg={4} sx={{ mb: 2 }} xs={12}>
                            {['O', 'X'].includes(
                                survey?.academic_background?.language
                                    ?.english_isPassed
                            ) ? (
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        format="D. MMM. YYYY"
                                        label={
                                            survey?.academic_background
                                                ?.language?.english_isPassed ===
                                            'X'
                                                ? t(
                                                      'Expected English Test Date'
                                                  )
                                                : t('English Test Date')
                                        }
                                        name="english_test_date"
                                        onChange={(newValue) =>
                                            handleTestDate(
                                                'english_test_date',
                                                newValue
                                            )
                                        }
                                        value={dayjs(
                                            survey.academic_background?.language
                                                ?.english_test_date || ''
                                        )}
                                    />
                                </LocalizationProvider>
                            ) : null}
                        </Grid>
                        {survey?.academic_background?.language
                            ?.english_isPassed === 'O' ? (
                            <>
                                <Grid item sm={4} xs={12}>
                                    <TextField
                                        disabled={
                                            survey.academic_background
                                                .language &&
                                            survey.academic_background.language
                                                .english_certificate === 'No'
                                                ? true
                                                : false
                                        }
                                        fullWidth
                                        id="english_score"
                                        label="Overall"
                                        name="english_score"
                                        onChange={(e) =>
                                            handleChangeLanguage(e)
                                        }
                                        placeholder={`${
                                            survey.academic_background.language
                                                .english_certificate === 'IELTS'
                                                ? '6.5'
                                                : '92'
                                        } `}
                                        type="number"
                                        value={
                                            survey.academic_background?.language
                                                ?.english_score || ''
                                        }
                                    />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                    <TextField
                                        disabled={
                                            survey.academic_background?.language
                                                ?.english_certificate === 'No'
                                                ? true
                                                : false
                                        }
                                        fullWidth
                                        id="english_score_reading"
                                        label="Reading"
                                        name="english_score_reading"
                                        onChange={(e) =>
                                            handleChangeLanguage(e)
                                        }
                                        placeholder={`${
                                            survey.academic_background.language
                                                .english_certificate === 'IELTS'
                                                ? '6.5'
                                                : '21'
                                        } `}
                                        type="number"
                                        value={
                                            survey.academic_background?.language
                                                ?.english_score_reading || ''
                                        }
                                    />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                    <TextField
                                        disabled={
                                            survey.academic_background?.language
                                                ?.english_certificate === 'No'
                                                ? true
                                                : false
                                        }
                                        fullWidth
                                        id="english_score_listening"
                                        label="Listening"
                                        name="english_score_listening"
                                        onChange={(e) =>
                                            handleChangeLanguage(e)
                                        }
                                        placeholder={`${
                                            survey.academic_background.language
                                                .english_certificate === 'IELTS'
                                                ? '6.5'
                                                : '21'
                                        } `}
                                        type="number"
                                        value={
                                            survey.academic_background?.language
                                                ?.english_score_listening || ''
                                        }
                                    />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                    <TextField
                                        disabled={
                                            survey.academic_background?.language
                                                ?.english_certificate === 'No'
                                                ? true
                                                : false
                                        }
                                        fullWidth
                                        id="english_score_writing"
                                        label="Writing"
                                        name="english_score_writing"
                                        onChange={(e) =>
                                            handleChangeLanguage(e)
                                        }
                                        placeholder={`${
                                            survey.academic_background.language
                                                .english_certificate === 'IELTS'
                                                ? '6.5'
                                                : '21'
                                        } `}
                                        type="number"
                                        value={
                                            survey.academic_background?.language
                                                ?.english_score_writing || ''
                                        }
                                    />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                    <TextField
                                        disabled={
                                            survey.academic_background?.language
                                                ?.english_certificate === 'No'
                                                ? true
                                                : false
                                        }
                                        fullWidth
                                        id="english_score_speaking"
                                        label="Speaking"
                                        name="english_score_speaking"
                                        onChange={(e) =>
                                            handleChangeLanguage(e)
                                        }
                                        placeholder={`${
                                            survey.academic_background.language
                                                .english_certificate === 'IELTS'
                                                ? '6.5'
                                                : '21'
                                        } `}
                                        type="number"
                                        value={
                                            survey.academic_background?.language
                                                ?.english_score_speaking || ''
                                        }
                                    />
                                </Grid>
                            </>
                        ) : null}
                        <Grid item sm={4} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.language
                                        ?.german_isPassed === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.language
                                        ?.german_isPassed === '-'
                                        ? 'Please provide German test info.'
                                        : null
                                }
                                id="german_isPassed"
                                label={t(
                                    'German Passed ? (Set Not need if applying English taught programs.)'
                                )}
                                labelid="german_isPassed"
                                name="german_isPassed"
                                onChange={handleChangeLanguage}
                                select
                                sx={{ mt: 1 }}
                                value={
                                    survey.academic_background?.language
                                        ?.german_isPassed
                                }
                            >
                                {IS_PASSED_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {survey?.academic_background?.language
                            ?.german_isPassed === 'O' ||
                        survey?.academic_background?.language
                            ?.german_isPassed === 'X' ? (
                            <Grid item sm={4} xs={12}>
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel id="german_certificate">
                                        {t('German Certificate')}
                                    </InputLabel>
                                    <Select
                                        id="german_certificate"
                                        label={t('German Certificate')}
                                        name="german_certificate"
                                        onChange={handleChangeLanguage}
                                        value={
                                            survey.academic_background?.language
                                                ?.german_certificate || ''
                                        }
                                    >
                                        {GERMAN_CERTIFICATE_ARRAY_OPTIONS.map(
                                            (option) => (
                                                <MenuItem
                                                    disabled={option.disabled}
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : null}
                        <Grid item sm={4} xs={12}>
                            {['O', 'X'].includes(
                                survey?.academic_background?.language
                                    ?.german_isPassed
                            ) ? (
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        format="D. MMM. YYYY"
                                        label={
                                            survey?.academic_background
                                                ?.language?.german_isPassed ===
                                            'X'
                                                ? t('Expected German Test Date')
                                                : t('German Test Date')
                                        }
                                        name="german_test_date"
                                        onChange={(newValue) =>
                                            handleTestDate(
                                                'german_test_date',
                                                newValue
                                            )
                                        }
                                        value={dayjs(
                                            survey.academic_background?.language
                                                ?.german_test_date || ''
                                        )}
                                    />
                                </LocalizationProvider>
                            ) : null}
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            {survey?.academic_background?.language
                                ?.german_isPassed === 'O' ? (
                                <TextField
                                    disabled={
                                        survey.academic_background?.language
                                            ?.german_certificate === 'No'
                                            ? true
                                            : false
                                    }
                                    id="german_score"
                                    label={t('German Test Score')}
                                    name="german_score"
                                    onChange={(e) => handleChangeLanguage(e)}
                                    placeholder="(i.e. TestDaF: 4, or DSH: 2) "
                                    value={
                                        survey.academic_background?.language
                                            ?.german_score || ''
                                    }
                                />
                            ) : null}
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.language
                                        ?.gre_isPassed === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.language
                                        ?.gre_isPassed === '-'
                                        ? 'Please provide GRE info.'
                                        : null
                                }
                                id="gre_isPassed"
                                label="GRE Test ? (At least V145 Q160 )"
                                labelid="gre_isPassed"
                                name="gre_isPassed"
                                onChange={handleChangeLanguage}
                                select
                                sx={{ mt: 1 }}
                                value={
                                    survey.academic_background?.language
                                        ?.gre_isPassed
                                }
                            >
                                {IS_PASSED_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            {survey.academic_background?.language
                                ?.gre_isPassed === 'O' ||
                            survey.academic_background?.language
                                ?.gre_isPassed === 'X' ? (
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel id="gre_certificate">
                                        {t('GRE Test')}
                                    </InputLabel>
                                    <Select
                                        id="gre_certificate"
                                        label="GRE Test"
                                        name="gre_certificate"
                                        onChange={handleChangeLanguage}
                                        value={
                                            survey.academic_background?.language
                                                ?.gre_certificate || ''
                                        }
                                    >
                                        {GRE_CERTIFICATE_ARRAY_OPTIONS.map(
                                            (option) => (
                                                <MenuItem
                                                    disabled={option.disabled}
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            ) : null}
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            {['O', 'X'].includes(
                                survey.academic_background?.language
                                    .gre_isPassed
                            ) ? (
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        format="D. MMM. YYYY"
                                        label={
                                            survey.academic_background?.language
                                                .gre_isPassed === 'X'
                                                ? t('Expected GRE Test Date')
                                                : t('GRE Test Date')
                                        }
                                        name="gre_test_date"
                                        onChange={(newValue) =>
                                            handleTestDate(
                                                'gre_test_date',
                                                newValue
                                            )
                                        }
                                        value={dayjs(
                                            survey.academic_background?.language
                                                ?.gre_test_date || ''
                                        )}
                                    />
                                </LocalizationProvider>
                            ) : null}
                        </Grid>
                        {survey.academic_background?.language?.gre_isPassed ===
                            'O' &&
                        survey.academic_background?.language
                            ?.gre_certificate !== '' ? (
                            <Grid item sm={12} xs={12}>
                                <TextField
                                    disabled={
                                        survey.academic_background?.language
                                            ?.gre_certificate === 'No'
                                            ? true
                                            : false
                                    }
                                    fullWidth
                                    id="gre_score"
                                    label={t('GRE Test Score')}
                                    name="gre_score"
                                    onChange={(e) => handleChangeLanguage(e)}
                                    placeholder="(i.e. V152Q167A3.5) "
                                    value={
                                        survey.academic_background?.language
                                            ?.gre_score || ''
                                    }
                                    variant="outlined"
                                />
                            </Grid>
                        ) : null}

                        <Grid item sm={4} xs={12}>
                            <TextField
                                error={
                                    survey.academic_background?.language
                                        ?.gmat_isPassed === '-'
                                }
                                fullWidth
                                helperText={
                                    survey.academic_background?.language
                                        ?.gmat_isPassed === '-'
                                        ? 'Please provide GMAT info.'
                                        : null
                                }
                                id="gmat_isPassed"
                                label="GMAT Test ? (At least 600 )"
                                labelid="gmat_isPassed"
                                name="gmat_isPassed"
                                onChange={handleChangeLanguage}
                                select
                                sx={{ mt: 1 }}
                                value={
                                    survey.academic_background?.language
                                        ?.gmat_isPassed
                                }
                            >
                                {IS_PASSED_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {survey.academic_background?.language?.gmat_isPassed ===
                            'O' ||
                        survey.academic_background?.language?.gmat_isPassed ===
                            'X' ? (
                            <Grid item sm={4} xs={12}>
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel id="gmat_certificate">
                                        {t('GMAT Test')}
                                    </InputLabel>
                                    <Select
                                        id="gmat_certificate"
                                        label="GMAT Test"
                                        name="gmat_certificate"
                                        onChange={handleChangeLanguage}
                                        value={
                                            survey.academic_background?.language
                                                ?.gmat_certificate || ''
                                        }
                                    >
                                        {GMAT_CERTIFICATE_OPTIONS.map(
                                            (option) => (
                                                <MenuItem
                                                    disabled={option.disabled}
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : null}
                        <Grid item sm={4} xs={12}>
                            {['O', 'X'].includes(
                                survey.academic_background?.language
                                    ?.gmat_isPassed
                            ) ? (
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        format="D. MMM. YYYY"
                                        label={
                                            survey.academic_background?.language
                                                ?.gmat_isPassed === 'X'
                                                ? t('Expected GMAT Test Date')
                                                : t('GMAT Test Date')
                                        }
                                        name="gmat_test_date"
                                        onChange={(newValue) =>
                                            handleTestDate(
                                                'gmat_test_date',
                                                newValue
                                            )
                                        }
                                        value={dayjs(
                                            survey.academic_background?.language
                                                ?.gmat_test_date || ''
                                        )}
                                    />
                                </LocalizationProvider>
                            ) : null}
                        </Grid>
                        {survey.academic_background?.language?.gmat_isPassed ===
                            'O' &&
                        survey.academic_background?.language
                            ?.gmat_certificate !== '' ? (
                            <Grid item sm={12} xs={12}>
                                <TextField
                                    disabled={
                                        survey.academic_background?.language
                                            ?.gmat_certificate === 'No'
                                            ? true
                                            : false
                                    }
                                    fullWidth
                                    id="gmat_score"
                                    label={t('GMAT Test Score')}
                                    name="gmat_score"
                                    onChange={(e) => handleChangeLanguage(e)}
                                    placeholder="(i.e. 550, 620) "
                                    type="number"
                                    value={
                                        survey.academic_background?.language
                                            ?.gmat_score || ''
                                    }
                                    variant="outlined"
                                />
                            </Grid>
                        ) : null}
                    </Grid>
                    <Box>
                        <Typography sx={{ mt: 2 }} variant="body2">
                            {t('Last update at')}:
                            {survey.academic_background?.language &&
                            survey.academic_background?.language.updatedAt
                                ? convertDate(
                                      survey.academic_background?.language
                                          .updatedAt
                                  )
                                : ''}
                            {user.archiv !== true ? (
                                <>
                                    <br />
                                    <Button
                                        color="primary"
                                        disabled={!survey.changed_language}
                                        fullWidth
                                        onClick={(e) =>
                                            handleSurveyLanguageSubmit(
                                                e,
                                                survey.academic_background
                                                    .language
                                            )
                                        }
                                        sx={{ mt: 2 }}
                                        variant="contained"
                                    >
                                        {t('Update', { ns: 'common' })}
                                    </Button>
                                </>
                            ) : null}{' '}
                        </Typography>
                    </Box>
                </Card>
            </Box>
            <Dialog
                onClose={closeOffcanvasWindow}
                open={surveyEditableComponentState.baseDocsflagOffcanvas}
            >
                <DialogTitle>{t('Edit', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <TextField
                        label={`Documentation Link for ${props.docName}`}
                        onChange={(e) => onChangeURL(e)}
                        placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
                        value={survey.survey_link}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={survey.baseDocsflagOffcanvasButtonDisable}
                        onClick={(e) => handleUpdateDocLink(e)}
                    >
                        {t('Save', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SurveyEditableComponent;
