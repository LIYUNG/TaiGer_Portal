import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Button,
    Card,
    FormControl,
    Grid,
    MenuItem,
    CircularProgress,
    Select,
    TextField,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Autocomplete
} from '@mui/material';
import { is_TaiGer_Admin } from '@taiger-common/core';

import SearchableMultiSelect from '../../components/Input/searchableMuliselect';
import {
    isProgramValid,
    BINARY_STATE_ARRAY_OPTIONS,
    COUNTRIES_ARRAY_OPTIONS,
    DEGREE_CATOGARY_ARRAY_OPTIONS,
    LANGUAGES_ARRAY_OPTIONS,
    SEMESTER_ARRAY_OPTIONS,
    UNI_ASSIST_ARRAY_OPTIONS,
    YES_NO_BOOLEAN_OPTIONS,
    showFieldAlert,
    PROGRAM_SUBJECTS_DETAILED,
    SCHOOL_TAGS_DETAILED
} from '../../utils/contants';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';

const NewProgramEdit = (props) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isChanged, setIsChanged] = useState(false);
    const initProgram = props.program || { is_rl_specific: false };
    const [programChanges, setProgramChanges] = useState({});
    const program = { ...initProgram, ...programChanges };
    const [searchTerm, setSearchTerm] = useState('');
    const schoolName2Set = Array.from(
        new Set(props.programs?.map((program) => program.school))
    );

    const handleChangeByField = (field) => (value) => {
        const newState = { ...programChanges };
        if (value === initProgram[field] || (!initProgram[field] && !value)) {
            delete newState[field];
        } else {
            newState[field] = value;
        }
        setProgramChanges(newState);
        setIsChanged(Object.keys(newState).length > 0 ? true : false);
    };

    const handleChange = (e) => {
        const key = e.target?.name;
        const value =
            e.target.type === 'checkbox'
                ? e.target.checked
                : typeof e.target.value === 'string'
                  ? e.target.value.trimLeft()
                  : e.target.value;

        const newState = { ...programChanges };
        if (value === initProgram[key] || (!initProgram[key] && !value)) {
            delete newState[key];
        } else {
            newState[key] = value;
        }
        setProgramChanges(newState);
        if (e.target.id === 'school') {
            setSearchTerm(value.trimLeft());
        }
        setIsChanged(Object.keys(newState).length > 0 ? true : false);
    };

    const handleSubmit = (e, program, programChanges) => {
        if (isProgramValid(program)) {
            e.preventDefault();
            props.handleSubmit_Program({ _id: program._id, ...programChanges });
        } else {
            showFieldAlert(program);
        }
    };

    const onClickResultHandler = (result) => {
        setProgramChanges((preState) => ({
            ...preState.program,
            school: result
        }));
        setSearchTerm(result);
    };

    return (
        <>
            <Button
                color="secondary"
                onClick={() => props.handleClick()}
                size="small"
            >
                <ArrowBackIcon fontSize="small" /> Back
            </Button>
            <Card sx={{ p: 2 }}>
                <Grid container>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('School', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Autocomplete
                            freeSolo
                            noOptionsText="No results" // Message when no results are found
                            onChange={(event, value) =>
                                onClickResultHandler(value)
                            } // Handle selection
                            options={schoolName2Set} // Display filtered results
                            readOnly={
                                props.type === 'edit' && !is_TaiGer_Admin(user)
                            } // Conditional readonly
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        // readOnly: props.type === 'edit' && !is_TaiGer_Admin(user), // Conditional readonly
                                        disableUnderline: true,
                                        endAdornment:
                                            params.InputProps.endAdornment
                                    }}
                                    fullWidth
                                    id="school"
                                    name="school"
                                    onChange={(event) => handleChange(event)} // Handle input changes
                                    placeholder="National Taiwan University"
                                    type="text"
                                    value={searchTerm}
                                />
                            )}
                            size="small"
                            value={program.school}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Program', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            InputProps={{
                                readOnly:
                                    props.type === 'edit' &&
                                    !is_TaiGer_Admin(user),
                                disableUnderline: true
                            }}
                            fullWidth
                            id="program_name"
                            name="program_name"
                            onChange={(e) => handleChange(e)}
                            placeholder="Electrical Engineering"
                            size="small"
                            type="text"
                            value={program.program_name || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Program Subject tags', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <SearchableMultiSelect
                            data={PROGRAM_SUBJECTS_DETAILED}
                            label={null}
                            name="programSubjects"
                            setValue={handleChangeByField('programSubjects')}
                            value={program?.programSubjects}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Degree', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                disabled={
                                    props.type === 'edit'
                                        ? !is_TaiGer_Admin(user)
                                        : null
                                }
                                id="degree"
                                labelId="degree"
                                name="degree"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.degree || '-'}
                            >
                                {DEGREE_CATOGARY_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Semester', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                disabled={
                                    props.type === 'edit'
                                        ? !is_TaiGer_Admin(user)
                                        : null
                                }
                                id="semester"
                                labelId="semester"
                                name="semester"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.semester || '-'}
                            >
                                {SEMESTER_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Teaching Language', { ns: 'common' })}*
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="lang"
                                labelId="lang"
                                name="lang"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.lang || '-'}
                            >
                                {LANGUAGES_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Only for graduated applicant', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            program.allowOnlyGraduatedApplicant
                                        }
                                        name="allowOnlyGraduatedApplicant"
                                        onChange={(e) => handleChange(e)}
                                    />
                                }
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('GPA Requirement (German system)', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="gpa_requirement"
                            name="gpa_requirement"
                            onChange={(e) => handleChange(e)}
                            placeholder="2,5"
                            size="small"
                            type="text"
                            value={program.gpa_requirement || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Application Start (MM-DD)', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="application_start"
                            name="application_start"
                            onChange={(e) => handleChange(e)}
                            placeholder="04-01"
                            size="small"
                            type="text"
                            value={program.application_start || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Application Deadline (MM-DD)', {
                                ns: 'common'
                            })}{' '}
                            *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="application_deadline"
                            name="application_deadline"
                            onChange={(e) => handleChange(e)}
                            placeholder="05-31"
                            size="small"
                            type="text"
                            value={program.application_deadline || ''}
                        />
                    </Grid>
                    {appConfig.vpdEnable ? (
                        <>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1">
                                    {t('Need Uni-Assist?', { ns: 'common' })}
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth>
                                    <Select
                                        id="uni_assist"
                                        labelId="uni_assist"
                                        name="uni_assist"
                                        onChange={(e) => handleChange(e)}
                                        size="small"
                                        value={program.uni_assist || 'No'}
                                    >
                                        {UNI_ASSIST_ARRAY_OPTIONS.map(
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
                            </Grid>
                        </>
                    ) : null}
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('English Test Can Submit Later', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={program.englishTestHandLater}
                                        name="englishTestHandLater"
                                        onChange={(e) => handleChange(e)}
                                    />
                                }
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('TOEFL Requirement', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={2} xs={4}>
                        <TextField
                            fullWidth
                            id="toefl"
                            name="toefl"
                            onChange={(e) => handleChange(e)}
                            placeholder="88"
                            size="small"
                            type="text"
                            value={program.toefl || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="toefl_reading"
                            label={t('Reading', { ns: 'common' })}
                            name="toefl_reading"
                            onChange={(e) => handleChange(e)}
                            placeholder="21"
                            size="small"
                            type="number"
                            value={program.toefl_reading || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="toefl_listening"
                            label={t('Listening', { ns: 'common' })}
                            name="toefl_listening"
                            onChange={(e) => handleChange(e)}
                            placeholder="21"
                            size="small"
                            type="number"
                            value={program.toefl_listening || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="toefl_speaking"
                            label={t('Speaking', { ns: 'common' })}
                            name="toefl_speaking"
                            onChange={(e) => handleChange(e)}
                            placeholder="21"
                            size="small"
                            type="number"
                            value={program.toefl_speaking || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="toefl_writing"
                            label={t('Writing', { ns: 'common' })}
                            name="toefl_writing"
                            onChange={(e) => handleChange(e)}
                            placeholder="21"
                            size="small"
                            type="number"
                            value={program.toefl_writing || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('IELTS Requirement', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={2} xs={4}>
                        <TextField
                            fullWidth
                            id="ielts"
                            name="ielts"
                            onChange={(e) => handleChange(e)}
                            placeholder="6.5"
                            size="small"
                            type="text"
                            value={program.ielts || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="ielts_reading"
                            label={t('Reading', { ns: 'common' })}
                            name="ielts_reading"
                            onChange={(e) => handleChange(e)}
                            placeholder="6.5"
                            size="small"
                            type="number"
                            value={program.ielts_reading || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="ielts_listening"
                            label={t('Listening', { ns: 'common' })}
                            name="ielts_listening"
                            onChange={(e) => handleChange(e)}
                            placeholder="6.5"
                            size="small"
                            type="number"
                            value={program.ielts_listening || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="ielts_speaking"
                            label={t('Speaking', { ns: 'common' })}
                            name="ielts_speaking"
                            onChange={(e) => handleChange(e)}
                            placeholder="6.5"
                            size="small"
                            type="number"
                            value={program.ielts_speaking || ''}
                        />
                    </Grid>
                    <Grid item md={1} xs={2}>
                        <TextField
                            fullWidth
                            id="ielts_writing"
                            label={t('Writing', { ns: 'common' })}
                            name="ielts_writing"
                            onChange={(e) => handleChange(e)}
                            placeholder="6.5"
                            size="small"
                            type="number"
                            value={program.ielts_writing || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('German Test Can Submit Later', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={program.germanTestHandLater}
                                        name="germanTestHandLater"
                                        onChange={(e) => handleChange(e)}
                                    />
                                }
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('TestDaF Requirement', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="testdaf"
                            name="testdaf"
                            onChange={(e) => handleChange(e)}
                            placeholder="4"
                            size="small"
                            type="text"
                            value={program.testdaf || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('GRE Requirement', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="gre"
                            name="gre"
                            onChange={(e) => handleChange(e)}
                            placeholder="V145Q160"
                            size="small"
                            type="text"
                            value={program.gre || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('GMAT Requirement', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="gmat"
                            name="gmat"
                            onChange={(e) => handleChange(e)}
                            placeholder="640"
                            size="small"
                            type="text"
                            value={program.gmat || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('ML Required?', { ns: 'common' })}*
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="ml_required"
                                labelId="ml_required"
                                name="ml_required"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.ml_required || 'no'}
                            >
                                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('ML Requirements', { ns: 'common' })}?
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="ml_requirements"
                            multiline
                            name="ml_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="1200-1500words"
                            rows={4}
                            size="small"
                            type="text"
                            value={program.ml_requirements || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('RL Required?', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="rl_required"
                                labelId="rl_required"
                                name="rl_required"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.rl_required || ''}
                            >
                                <MenuItem value="0">no</MenuItem>
                                <MenuItem value="1">yes - 1</MenuItem>
                                <MenuItem value="2">yes - 2</MenuItem>
                                <MenuItem value="3">yes - 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('RL Program specific?', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="is_rl_specific"
                                labelId="is_rl_specific"
                                name="is_rl_specific"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.is_rl_specific}
                            >
                                {YES_NO_BOOLEAN_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('RL Requirements', { ns: 'common' })}?
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="rl_requirements"
                            multiline
                            name="rl_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="1 page"
                            rows={4}
                            size="small"
                            type="text"
                            value={program.rl_requirements || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Essay Required?', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="essay_required"
                                labelId="essay_required"
                                name="essay_required"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.essay_required || ''}
                            >
                                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Essay Requirements', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="essay_requirements"
                            multiline
                            name="essay_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="2000 words"
                            rows={4}
                            size="small"
                            type="text"
                            value={program.essay_requirements || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Portfolio Required?', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="portfolio_required"
                                labelId="portfolio_required"
                                name="portfolio_required"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.portfolio_required || ''}
                            >
                                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Portfolio Requirements', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="portfolio_requirements"
                            multiline
                            name="portfolio_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="2000 words"
                            rows={4}
                            size="small"
                            type="text"
                            value={program.portfolio_requirements || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Supplementary Form Required?', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="supplementary_form_required"
                                labelId="supplementary_form_required"
                                name="supplementary_form_required"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={
                                    program.supplementary_form_required || ''
                                }
                            >
                                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Supplementary Form Requirements', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="supplementary_form_requirements"
                            multiline
                            name="supplementary_form_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="fill the form"
                            rows={4}
                            size="small"
                            type="text"
                            value={
                                program.supplementary_form_requirements || ''
                            }
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Curriculum Analysis Required?', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="curriculum_analysis_required"
                                labelId="curriculum_analysis_required"
                                name="curriculum_analysis_required"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={
                                    program.curriculum_analysis_required || ''
                                }
                            >
                                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Curriculum Analysis Requirements', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="curriculum_analysis_requirements"
                            multiline
                            name="curriculum_analysis_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="fill the form"
                            rows={4}
                            size="small"
                            type="text"
                            value={
                                program.curriculum_analysis_requirements || ''
                            }
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Scholarship Form / ML Required?', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="scholarship_form_required"
                                labelId="scholarship_form_required"
                                name="scholarship_form_required"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.scholarship_form_required || ''}
                            >
                                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Scholarship Form / ML Requirements', {
                                ns: 'common'
                            })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="scholarship_form_requirements"
                            multiline
                            name="scholarship_form_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="fill the form"
                            rows={4}
                            size="small"
                            type="text"
                            value={program.scholarship_form_requirements || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('ECTS Requirements', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="ects_requirements"
                            multiline
                            name="ects_requirements"
                            onChange={(e) => handleChange(e)}
                            placeholder="Mathematics 20 ECTS, Electrical Engineering 15 ECTS, Computer architecture 8 ECTS..."
                            rows={4}
                            size="small"
                            type="text"
                            value={program.ects_requirements || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Special Notes', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="special_notes"
                            multiline
                            name="special_notes"
                            onChange={(e) => handleChange(e)}
                            placeholder="Hard copy"
                            rows={4}
                            size="small"
                            type="text"
                            value={program.special_notes || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Comments', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="comments"
                            multiline
                            name="comments"
                            onChange={(e) => handleChange(e)}
                            placeholder="Hard copy"
                            rows={4}
                            size="small"
                            type="text"
                            value={program.comments || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            Portal 1 link url
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="application_portal_a"
                            name="application_portal_a"
                            onChange={(e) => handleChange(e)}
                            placeholder="https://...."
                            size="small"
                            type="text"
                            value={program.application_portal_a || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            Portal 1 {appConfig.companyName} Instrution link url
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="application_portal_a_instructions"
                            name="application_portal_a_instructions"
                            onChange={(e) => handleChange(e)}
                            placeholder="https://...."
                            size="small"
                            type="text"
                            value={
                                program.application_portal_a_instructions || ''
                            }
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            Portal 2 link url
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="application_portal_b"
                            name="application_portal_b"
                            onChange={(e) => handleChange(e)}
                            placeholder="https://...."
                            size="small"
                            type="text"
                            value={program.application_portal_b || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            Portal 2 {appConfig.companyName} Instrution link url
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="application_portal_b_instructions"
                            name="application_portal_b_instructions"
                            onChange={(e) => handleChange(e)}
                            placeholder="https://...."
                            size="small"
                            type="text"
                            value={
                                program.application_portal_b_instructions || ''
                            }
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Website', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="website"
                            name="website"
                            onChange={(e) => handleChange(e)}
                            placeholder="https://...."
                            size="small"
                            type="text"
                            value={program.website || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Country', { ns: 'common' })} *
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                id="country"
                                labelId="country"
                                name="country"
                                onChange={(e) => handleChange(e)}
                                size="small"
                                value={program.country || '-'}
                            >
                                <MenuItem value="-">-</MenuItem>
                                {COUNTRIES_ARRAY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                        value={option.value}
                                    >
                                        <img
                                            alt="Logo"
                                            src={`/assets/logo/country_logo/svg/${option.value}.svg`}
                                            style={{
                                                maxWidth: 24,
                                                maxHeight: 24
                                            }}
                                        />
                                        &nbsp; &nbsp;
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('Tuition Fees', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="tuition_fees"
                            name="tuition_fees"
                            onChange={(e) => handleChange(e)}
                            placeholder="https://...."
                            size="small"
                            type="text"
                            value={program.tuition_fees || ''}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">
                            {t('School tags', { ns: 'common' })}
                        </Typography>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <SearchableMultiSelect
                            data={SCHOOL_TAGS_DETAILED}
                            label={null}
                            name="tags"
                            setValue={handleChangeByField('tags')}
                            value={program?.tags}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1">FPSO</Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            id="fpso"
                            name="fpso"
                            onChange={(e) => handleChange(e)}
                            placeholder="https://...."
                            size="small"
                            type="text"
                            value={program.fpso || ''}
                        />
                    </Grid>
                </Grid>
                <Typography variant="body1">*: Must fill fields</Typography>
                <Button
                    color="primary"
                    disabled={!isChanged || props.isSubmitting}
                    endIcon={
                        props.isSubmitting ? (
                            <CircularProgress size={24} />
                        ) : null
                    }
                    fullWidth
                    onClick={(e) => handleSubmit(e, program, programChanges)}
                    size="small"
                    sx={{ my: 1 }}
                    variant="contained"
                >
                    {props.program
                        ? t('Update', { ns: 'common' })
                        : t('Create', { ns: 'common' })}
                </Button>
                <Button
                    color="secondary"
                    fullWidth
                    onClick={() => props.handleClick()}
                    size="small"
                    variant="outlined"
                >
                    {t('Cancel', { ns: 'common' })}
                </Button>
            </Card>
        </>
    );
};
export default NewProgramEdit;
