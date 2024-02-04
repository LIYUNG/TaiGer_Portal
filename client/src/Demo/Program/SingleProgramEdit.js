import React, { useState } from 'react';
import { Form, Card } from 'react-bootstrap';
import { Button, Grid, Typography } from '@mui/material';

import {
  AddValidProgram,
  BINARY_STATE_OPTIONS,
  COUNTRIES_OPTIONS,
  DEGREE_OPTIONS,
  LANGUAGES_OPTIONS,
  SEMESTER_OPTIONS,
  field_alert
} from '../Utils/contants';
import { is_TaiGer_Admin } from '../Utils/checking-functions';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import { useTranslation } from 'react-i18next';

function SingleProgramEdit(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [singleProgramEditState, setSingleProgramEditState] = useState({
    program: props.program
  });

  const handleChange = (e) => {
    e.preventDefault();
    var program_temp = { ...singleProgramEditState.program };
    program_temp[e.target.id] = e.target.value;
    setSingleProgramEditState((state) => ({
      ...state,
      program: program_temp
    }));
  };
  const handleSubmit_Program = (e, program) => {
    if (AddValidProgram(program)) {
      e.preventDefault();
      props.handleSubmit_Program(program);
    } else {
      field_alert(program);
    }
  };
  return (
    <>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">{t('University')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            {is_TaiGer_Admin(user) ? (
              <Form.Group controlId="school">
                <Form.Control
                  type="text"
                  placeholder="National Taiwan University"
                  onChange={(e) => handleChange(e)}
                  defaultValue={
                    singleProgramEditState.program.school
                      ? singleProgramEditState.program.school
                      : ''
                  }
                />
              </Form.Group>
            ) : (
              <Typography variant="body1">
                {singleProgramEditState.program?.school || ''}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Program')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            {is_TaiGer_Admin(user) ? (
              <Form.Group controlId="program_name">
                <Form.Control
                  type="text"
                  placeholder="Electrical Engineering"
                  onChange={(e) => handleChange(e)}
                  defaultValue={
                    singleProgramEditState.program.program_name
                      ? singleProgramEditState.program.program_name
                      : ''
                  }
                />
              </Form.Group>
            ) : (
              <Typography>
                {singleProgramEditState.program?.program_name || ''}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Degree')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            {is_TaiGer_Admin(user) ? (
              <Form.Group controlId="degree">
                <Form.Control
                  as="select"
                  onChange={(e) => handleChange(e)}
                  value={singleProgramEditState.program.degree}
                >
                  {DEGREE_OPTIONS()}
                </Form.Control>
              </Form.Group>
            ) : (
              <Typography>
                {singleProgramEditState.program?.degree || ''}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Semester')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            {is_TaiGer_Admin(user) ? (
              <Form.Group controlId="semester">
                <Form.Control
                  as="select"
                  onChange={(e) => handleChange(e)}
                  value={singleProgramEditState.program.semester}
                >
                  {SEMESTER_OPTIONS()}
                </Form.Control>
              </Form.Group>
            ) : (
              <Typography>
                {singleProgramEditState.program?.semester || ''}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Teaching Language')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="lang">
              <Form.Control
                as="select"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.lang
                    ? singleProgramEditState.program.lang
                    : 'English'
                }
              >
                {LANGUAGES_OPTIONS()}
              </Form.Control>
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('GPA Requirement (German system)')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="gpa_requirement">
              <Form.Control
                type="text"
                placeholder="2,5"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.gpa_requirement
                    ? singleProgramEditState.program.gpa_requirement
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Application Start (MM-DD)')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="application_start">
              <Form.Control
                type="text"
                placeholder="05-31"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.application_start
                    ? singleProgramEditState.program.application_start
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Application Deadline (MM-DD)')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="application_deadline">
              <Form.Control
                type="text"
                placeholder="05-31"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.application_deadline
                    ? singleProgramEditState.program.application_deadline
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          {appConfig.vpdEnable && (
            <>
              <Grid item xs={12} md={4}>
                <Typography>{t('Need Uni-Assist?')}</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Form.Group controlId="uni_assist">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    value={singleProgramEditState.program.uni_assist}
                  >
                    <option value="No">No</option>
                    <option value="Yes-VPD">Yes-VPD</option>
                    <option value="Yes-Full">Yes-Full</option>
                  </Form.Control>
                </Form.Group>
              </Grid>
            </>
          )}
          <Grid item xs={12} md={4}>
            <Typography>{t('TOEFL Requirement')}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Form.Group controlId="toefl">
              <Form.Control
                type="text"
                placeholder="88"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.toefl
                    ? singleProgramEditState.program.toefl
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            {t('Reading')}
            <Form.Group controlId="toefl_reading">
              <Form.Control
                type="text"
                placeholder="21"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.toefl_reading
                    ? singleProgramEditState.program.toefl_reading
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            {t('Listening')}
            <Form.Group controlId="toefl_listening">
              <Form.Control
                type="text"
                placeholder="21"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.toefl_listening
                    ? singleProgramEditState.program.toefl_listening
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            {t('Speaking')}
            <Form.Group controlId="toefl_speaking">
              <Form.Control
                type="text"
                placeholder="21"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.toefl_speaking
                    ? singleProgramEditState.program.toefl_speaking
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            {t('Writing')}
            <Form.Group controlId="toefl_writing">
              <Form.Control
                type="text"
                placeholder="21"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.toefl_writing
                    ? singleProgramEditState.program.toefl_writing
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('IELTS Requirement')}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Form.Group controlId="ielts">
              <Form.Control
                type="text"
                placeholder="6.5"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ielts
                    ? singleProgramEditState.program.ielts
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            Reading
            <Form.Group controlId="ielts_reading">
              <Form.Control
                type="text"
                placeholder="5.5"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ielts_reading
                    ? singleProgramEditState.program.ielts_reading
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            Listening
            <Form.Group controlId="ielts_listening">
              <Form.Control
                type="text"
                placeholder="6.5"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ielts_listening
                    ? singleProgramEditState.program.ielts_listening
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            Speaking
            <Form.Group controlId="ielts_speaking">
              <Form.Control
                type="text"
                placeholder="6"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ielts_speaking
                    ? singleProgramEditState.program.ielts_speaking
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={1}>
            Writing
            <Form.Group controlId="ielts_writing">
              <Form.Control
                type="text"
                placeholder="5.5"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ielts_writing
                    ? singleProgramEditState.program.ielts_writing
                    : ''
                }
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>TestDaF Requirement</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="testdaf">
              <Form.Control
                type="text"
                placeholder="4"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.testdaf
                    ? singleProgramEditState.program.testdaf
                    : ''
                }
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>GRE Requirement</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="gre">
              <Form.Control
                type="text"
                placeholder="V145Q160"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.gre
                    ? singleProgramEditState.program.gre
                    : ''
                }
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>GMAT Requirement</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="gmat">
              <Form.Control
                type="text"
                placeholder="640"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.gmat
                    ? singleProgramEditState.program.gmat
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>ML Required?</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="ml_required">
              <Form.Control
                as="select"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ml_required
                    ? singleProgramEditState.program.ml_required
                    : ''
                }
              >
                {BINARY_STATE_OPTIONS()}
              </Form.Control>
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>ML Requirements</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="ml_requirements">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="1200-1500words"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ml_requirements
                    ? singleProgramEditState.program.ml_requirements
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('RL Required?')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="rl_required">
              <Form.Control
                as="select"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.rl_required
                    ? singleProgramEditState.program.rl_required
                    : '0'
                }
              >
                <option value="0">no</option>
                <option value="1">yes - 1</option>
                <option value="2">yes - 2</option>
                <option value="3">yes - 3</option>
              </Form.Control>
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('RL Requirements')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="rl_requirements">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="1 page"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.rl_requirements
                    ? singleProgramEditState.program.rl_requirements
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Essay Required?')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="essay_required">
              <Form.Control
                as="select"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.essay_required
                    ? singleProgramEditState.program.essay_required
                    : ''
                }
              >
                {BINARY_STATE_OPTIONS()}
              </Form.Control>
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Essay Requirements')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="essay_requirements">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="2000 words"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.essay_requirements
                    ? singleProgramEditState.program.essay_requirements
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Portfolio Required?')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="portfolio_required">
              <Form.Control
                as="select"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.portfolio_required
                    ? singleProgramEditState.program.portfolio_required
                    : ''
                }
              >
                {BINARY_STATE_OPTIONS()}
              </Form.Control>
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t('Portfolio Requirements')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="portfolio_requirements">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="2000 words"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.portfolio_requirements
                    ? singleProgramEditState.program.portfolio_requirements
                    : ''
                }
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t('Supplementary Form Required?')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="supplementary_form_required">
              <Form.Control
                as="select"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.supplementary_form_required
                    ? singleProgramEditState.program.supplementary_form_required
                    : ''
                }
              >
                {BINARY_STATE_OPTIONS()}
              </Form.Control>
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Supplementary Form Requirements')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="supplementary_form_requirements">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="2000 words"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.supplementary_form_requirements
                    ? singleProgramEditState.program
                        .supplementary_form_requirements
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('ECTS Requirements')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="ects_requirements">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="Mathematics 20 ECTS, Electrical Engineering 15 ECTS, Computer architecture 8 ECTS..."
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.ects_requirements
                    ? singleProgramEditState.program.ects_requirements
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Special Notes')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="special_notes">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="2000 words"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.special_notes
                    ? singleProgramEditState.program.special_notes
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Comments')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="comments">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="2000 words"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.comments
                    ? singleProgramEditState.program.comments
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Tuition Fees')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="tuition_fees">
              <Form.Control
                as="textarea"
                rows="5"
                placeholder="2000 words"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.tuition_fees
                    ? singleProgramEditState.program.tuition_fees
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Country')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="country">
              <Form.Control
                as="select"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.country
                    ? singleProgramEditState.program.country
                    : ''
                }
              >
                {COUNTRIES_OPTIONS()}
              </Form.Control>
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Portal 1 link url')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="application_portal_a">
              <Form.Control
                type="text"
                placeholder="url"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.application_portal_a
                    ? singleProgramEditState.program.application_portal_a
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              Portal 1 {appConfig.companyName} Instrution page url
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="application_portal_a_instructions">
              <Form.Control
                type="text"
                placeholder="url"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program
                    .application_portal_a_instructions
                    ? singleProgramEditState.program
                        .application_portal_a_instructions
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Portal 2 link url')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="application_portal_b">
              <Form.Control
                type="text"
                placeholder="url"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.application_portal_b
                    ? singleProgramEditState.program.application_portal_b
                    : ''
                }
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              Portal 2 {appConfig.companyName} Instrution page url
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="application_portal_b_instructions">
              <Form.Control
                type="text"
                placeholder="url"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program
                    .application_portal_b_instructions
                    ? singleProgramEditState.program
                        .application_portal_b_instructions
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>{t('Website')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="website">
              <Form.Control
                type="text"
                placeholder="url"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.website
                    ? singleProgramEditState.program.website
                    : ''
                }
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t('FPSO')}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="fpso">
              <Form.Control
                type="text"
                placeholder="url"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.fpso
                    ? singleProgramEditState.program.fpso
                    : ''
                }
              />
            </Form.Group>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>Group</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Form.Group controlId="study_group_flag">
              <Form.Control
                type="text"
                placeholder="ee"
                onChange={(e) => handleChange(e)}
                defaultValue={
                  singleProgramEditState.program.study_group_flag
                    ? singleProgramEditState.program.study_group_flag
                    : ''
                }
              />
            </Form.Group>
          </Grid>
        </Grid>
      </Card>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={(e) => handleSubmit_Program(e, singleProgramEditState.program)}
      >
        {t('Update')}
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => props.handleClick()}
      >
        {t('Cancel')}
      </Button>
    </>
  );
}
export default SingleProgramEdit;
