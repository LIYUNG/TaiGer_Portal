import React, { useState, useRef, useEffect } from 'react';
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
  Checkbox
} from '@mui/material';

import {
  isProgramValid,
  BINARY_STATE_ARRAY_OPTIONS,
  COUNTRIES_ARRAY_OPTIONS,
  DEGREE_CATOGARY_ARRAY_OPTIONS,
  LANGUAGES_ARRAY_OPTIONS,
  SEMESTER_ARRAY_OPTIONS,
  UNI_ASSIST_ARRAY_OPTIONS,
  YES_NO_BOOLEAN_OPTIONS,
  showFieldAlert
} from '../Utils/contants';
import { appConfig } from '../../config';
import { is_TaiGer_Admin } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';

function NewProgramEdit(props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isChanged, setIsChanged] = useState(false);
  const initProgram = props.program || { is_rl_specific: false };
  const [programChanges, setProgramChanges] = useState({});
  const program = { ...initProgram, ...programChanges };
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const searchContainerRef = useRef(null);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const schoolNameSet = new Set(
    props.programs?.map((program) => program.school)
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
      }
    }, 300); // Adjust the delay as needed
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);

  const fetchSearchResults = () => {
    setSearchResults(
      [...schoolNameSet].filter((school) =>
        school.toLowerCase().includes(program.school.toLowerCase())
      )
    );
    setIsResultsVisible(true);
  };
  const handleClickOutside = (event) => {
    // Check if the click target is outside of the search container and result list
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      // Clicked outside, hide the result list
      setIsResultsVisible(false);
    }
  };
  const handleChange = (e) => {
    // e.preventDefault();
    console.log(e.target.value);
    console.log(e.target.checked);
    console.log(e.target.type);
    console.log(e.target.name);
    const key = e.target.name;
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : typeof e.target.value === 'string'
        ? e.target.value.trimLeft()
        : e.target.value;

    const newState = { ...programChanges };
    if (value === initProgram[key] || (!initProgram[key] && value === '')) {
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
    setSearchResults([]);
    setProgramChanges((preState) => ({ ...preState.program, school: result }));
    setIsResultsVisible(false);
    setSearchTerm('');
  };

  return (
    <>
      <Button
        size="small"
        color="secondary"
        onClick={() => props.handleClick()}
      >
        <ArrowBackIcon fontSize="small" /> Back
      </Button>
      <Card sx={{ p: 2 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('School', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="search-container-school" ref={searchContainerRef}>
              <TextField
                fullWidth
                size="small"
                type="text"
                id="school"
                name="school"
                placeholder="National Taiwan University"
                onChange={(e) => handleChange(e)}
                InputProps={{
                  readOnly: props.type === 'edit' && !is_TaiGer_Admin(user),
                  disableUnderline: true
                }}
                value={program.school || searchTerm}
              />

              {/* {loading && <div>Loading...</div>} */}
              {props.programs && searchResults.length > 0
                ? isResultsVisible && (
                    <div className="search-results result-list">
                      {searchResults.map((result, i) => (
                        <li
                          onClick={() => onClickResultHandler(result)}
                          key={i}
                        >
                          {`${result}`}
                        </li>
                      ))}
                    </div>
                  )
                : props.programs &&
                  isResultsVisible && (
                    <div className="search-results result-list">
                      <li>No result</li>
                    </div>
                  )}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Program', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="program_name"
              name="program_name"
              placeholder="Electrical Engineering"
              onChange={(e) => handleChange(e)}
              InputProps={{
                readOnly: props.type === 'edit' && !is_TaiGer_Admin(user),
                disableUnderline: true
              }}
              value={program.program_name || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Degree', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="degree"
                name="degree"
                id="degree"
                onChange={(e) => handleChange(e)}
                disabled={props.type === 'edit' && !is_TaiGer_Admin(user)}
                value={program.degree || ''}
              >
                {DEGREE_CATOGARY_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Semester', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="semester"
                name="semester"
                id="semester"
                onChange={(e) => handleChange(e)}
                disabled={props.type === 'edit' && !is_TaiGer_Admin(user)}
                value={program.semester || ''}
              >
                {SEMESTER_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Teaching Language', { ns: 'common' })}*
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="lang"
                name="lang"
                id="lang"
                onChange={(e) => handleChange(e)}
                value={program.lang || '-'}
              >
                {LANGUAGES_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Only for graduated applicant', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name={'allowOnlyGraduatedApplicant'}
                    checked={program.allowOnlyGraduatedApplicant}
                    onChange={(e) => handleChange(e)}
                  />
                }
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              GPA Requirement (German system)
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="gpa_requirement"
              name="gpa_requirement"
              placeholder="2,5"
              onChange={(e) => handleChange(e)}
              value={program.gpa_requirement || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Application Start (MM-DD)', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="application_start"
              name="application_start"
              placeholder="04-01"
              onChange={(e) => handleChange(e)}
              value={program.application_start || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Application Deadline', { ns: 'common' })} (MM-DD) *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="application_deadline"
              name="application_deadline"
              placeholder="05-31"
              onChange={(e) => handleChange(e)}
              value={program.application_deadline || ''}
            />
          </Grid>
          {appConfig.vpdEnable && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  {t('Need Uni-Assist?', { ns: 'common' })}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    labelId="uni_assist"
                    name="uni_assist"
                    id="uni_assist"
                    onChange={(e) => handleChange(e)}
                    value={program.uni_assist || 'No'}
                  >
                    {UNI_ASSIST_ARRAY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('English Test Can Submit Later', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name={'englishTestHandLater'}
                    checked={program.englishTestHandLater}
                    onChange={(e) => handleChange(e)}
                  />
                }
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('TOEFL Requirement', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={4} md={2}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="toefl"
              name="toefl"
              placeholder="88"
              onChange={(e) => handleChange(e)}
              value={program.toefl || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="toefl_reading"
              name="toefl_reading"
              label={t('Reading', { ns: 'common' })}
              placeholder="21"
              onChange={(e) => handleChange(e)}
              value={program.toefl_reading || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="toefl_listening"
              name="toefl_listening"
              label={t('Listening', { ns: 'common' })}
              placeholder="21"
              onChange={(e) => handleChange(e)}
              value={program.toefl_listening || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="toefl_speaking"
              name="toefl_speaking"
              label={t('Speaking', { ns: 'common' })}
              placeholder="21"
              onChange={(e) => handleChange(e)}
              value={program.toefl_speaking || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="toefl_writing"
              name="toefl_writing"
              label={t('Writing', { ns: 'common' })}
              placeholder="21"
              onChange={(e) => handleChange(e)}
              value={program.toefl_writing || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('IELTS Requirement', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={4} md={2}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="ielts"
              name="ielts"
              placeholder="6.5"
              onChange={(e) => handleChange(e)}
              value={program.ielts || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="ielts_reading"
              name="ielts_reading"
              label={t('Reading', { ns: 'common' })}
              placeholder="6.5"
              onChange={(e) => handleChange(e)}
              value={program.ielts_reading || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="ielts_listening"
              name="ielts_listening"
              label={t('Listening', { ns: 'common' })}
              placeholder="6.5"
              onChange={(e) => handleChange(e)}
              value={program.ielts_listening || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="ielts_speaking"
              name="ielts_speaking"
              label={t('Speaking', { ns: 'common' })}
              placeholder="6.5"
              onChange={(e) => handleChange(e)}
              value={program.ielts_speaking || ''}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              size="small"
              type="number"
              id="ielts_writing"
              name="ielts_writing"
              label={t('Writing', { ns: 'common' })}
              placeholder="6.5"
              onChange={(e) => handleChange(e)}
              value={program.ielts_writing || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('German Test Can Submit Later', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name={'germanTestHandLater'}
                    checked={program.germanTestHandLater}
                    onChange={(e) => handleChange(e)}
                  />
                }
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('TestDaF Requirement', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="testdaf"
              name="testdaf"
              placeholder="4"
              onChange={(e) => handleChange(e)}
              value={program.testdaf || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('GRE Requirement', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="gre"
              name="gre"
              placeholder="V145Q160"
              onChange={(e) => handleChange(e)}
              value={program.gre || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('GMAT Requirement', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="gmat"
              name="gmat"
              placeholder="640"
              onChange={(e) => handleChange(e)}
              value={program.gmat || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('ML Required?', { ns: 'common' })}*
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="ml_required"
                name="ml_required"
                id="ml_required"
                onChange={(e) => handleChange(e)}
                value={program.ml_required || 'no'}
              >
                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('ML Requirements', { ns: 'common' })}?
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="ml_requirements"
              name="ml_requirements"
              placeholder="1200-1500words"
              onChange={(e) => handleChange(e)}
              value={program.ml_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('RL Required?', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="rl_required"
                name="rl_required"
                id="rl_required"
                onChange={(e) => handleChange(e)}
                value={program.rl_required || ''}
              >
                <MenuItem value="0">no</MenuItem>
                <MenuItem value="1">yes - 1</MenuItem>
                <MenuItem value="2">yes - 2</MenuItem>
                <MenuItem value="3">yes - 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('RL Program specific?', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="is_rl_specific"
                name="is_rl_specific"
                id="is_rl_specific"
                onChange={(e) => handleChange(e)}
                value={program.is_rl_specific}
              >
                {YES_NO_BOOLEAN_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('RL Requirements', { ns: 'common' })}?
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="rl_requirements"
              name="rl_requirements"
              placeholder="1 page"
              onChange={(e) => handleChange(e)}
              value={program.rl_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Essay Required?', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="essay_required"
                name="essay_required"
                id="essay_required"
                onChange={(e) => handleChange(e)}
                value={program.essay_required || ''}
              >
                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Essay Requirements', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="essay_requirements"
              name="essay_requirements"
              placeholder="2000 words"
              onChange={(e) => handleChange(e)}
              value={program.essay_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Portfolio Required?', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="portfolio_required"
                name="portfolio_required"
                id="portfolio_required"
                onChange={(e) => handleChange(e)}
                value={program.portfolio_required || ''}
              >
                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Portfolio Requirements', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="portfolio_requirements"
              name="portfolio_requirements"
              placeholder="2000 words"
              onChange={(e) => handleChange(e)}
              value={program.portfolio_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Supplementary Form Required?', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="supplementary_form_required"
                name="supplementary_form_required"
                id="supplementary_form_required"
                onChange={(e) => handleChange(e)}
                value={program.supplementary_form_required || ''}
              >
                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Supplementary Form Requirements', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="supplementary_form_requirements"
              name="supplementary_form_requirements"
              placeholder="fill the form"
              onChange={(e) => handleChange(e)}
              value={program.supplementary_form_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Curriculum Analysis Required?', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="curriculum_analysis_required"
                name="curriculum_analysis_required"
                id="curriculum_analysis_required"
                onChange={(e) => handleChange(e)}
                value={program.curriculum_analysis_required || ''}
              >
                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Curriculum Analysis Requirements', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="curriculum_analysis_requirements"
              name="curriculum_analysis_requirements"
              placeholder="fill the form"
              onChange={(e) => handleChange(e)}
              value={program.curriculum_analysis_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Scholarship Form / ML Required?', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="scholarship_form_required"
                name="scholarship_form_required"
                id="scholarship_form_required"
                onChange={(e) => handleChange(e)}
                value={program.scholarship_form_required || ''}
              >
                {BINARY_STATE_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Scholarship Form / ML Requirements', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="scholarship_form_requirements"
              name="scholarship_form_requirements"
              placeholder="fill the form"
              onChange={(e) => handleChange(e)}
              value={program.scholarship_form_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('ECTS Requirements', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="ects_requirements"
              name="ects_requirements"
              placeholder="Mathematics 20 ECTS, Electrical Engineering 15 ECTS, Computer architecture 8 ECTS..."
              onChange={(e) => handleChange(e)}
              value={program.ects_requirements || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Special Notes', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="special_notes"
              name="special_notes"
              placeholder="Hard copy"
              onChange={(e) => handleChange(e)}
              value={program.special_notes || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Comments', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              multiline
              rows={4}
              id="comments"
              name="comments"
              placeholder="Hard copy"
              onChange={(e) => handleChange(e)}
              value={program.comments || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">Portal 1 link url</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="application_portal_a"
              name="application_portal_a"
              placeholder="https://...."
              onChange={(e) => handleChange(e)}
              value={program.application_portal_a || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              Portal 1 {appConfig.companyName} Instrution link url
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="application_portal_a_instructions"
              name="application_portal_a_instructions"
              placeholder="https://...."
              onChange={(e) => handleChange(e)}
              value={program.application_portal_a_instructions || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">Portal 2 link url</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="application_portal_b"
              name="application_portal_b"
              placeholder="https://...."
              onChange={(e) => handleChange(e)}
              value={program.application_portal_b || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              Portal 2 {appConfig.companyName} Instrution link url
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="application_portal_b_instructions"
              name="application_portal_b_instructions"
              placeholder="https://...."
              onChange={(e) => handleChange(e)}
              value={program.application_portal_b_instructions || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Website', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="website"
              name="website"
              placeholder="https://...."
              onChange={(e) => handleChange(e)}
              value={program.website || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Country', { ns: 'common' })} *
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="country"
                name="country"
                id="country"
                onChange={(e) => handleChange(e)}
                value={program.country || '-'}
              >
                {COUNTRIES_ARRAY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              {t('Tuition Fees', { ns: 'common' })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="tuition_fees"
              name="tuition_fees"
              placeholder="https://...."
              onChange={(e) => handleChange(e)}
              value={program.tuition_fees || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">FPSO</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="fpso"
              name="fpso"
              placeholder="https://...."
              onChange={(e) => handleChange(e)}
              value={program.fpso || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">Group</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              id="study_group_flag"
              name="study_group_flag"
              placeholder="ee"
              onChange={(e) => handleChange(e)}
              value={program.study_group_flag || ''}
            />
          </Grid>
        </Grid>
        <Typography variant="body1">*: Must fill fields</Typography>
        <Button
          fullWidth
          size="small"
          color="primary"
          variant="contained"
          onClick={(e) => handleSubmit(e, program, programChanges)}
          disabled={!isChanged || props.isSubmitting}
          endIcon={props.isSubmitting ? <CircularProgress size={24} /> : null}
          sx={{ my: 1 }}
        >
          {props.program
            ? t('Update', { ns: 'common' })
            : t('Create', { ns: 'common' })}
        </Button>
        <Button
          fullWidth
          size="small"
          color="secondary"
          variant="outlined"
          onClick={() => props.handleClick()}
        >
          {t('Cancel', { ns: 'common' })}
        </Button>
      </Card>
    </>
  );
}
export default NewProgramEdit;
