import React, { useState } from 'react';
import { Form, Badge } from 'react-bootstrap';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function ProgramReportModal(props) {
  const { t } = useTranslation();
  const [programReportModalState, setProgramReportModalState] = useState({
    description: ''
  });
  const handleChange = (e) => {
    setProgramReportModalState((prevState) => ({
      ...prevState,
      description: e.target.value
    }));
  };

  return (
    <ModalNew
      open={props.isReport}
      onClose={props.setReportModalHideDelete}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h5">Report</Typography>
      <Form>
        <Form.Group>
          <Form.Label>
            What information is inaccurate for {props.uni_name} -{' '}
            {props.program_name}?
          </Form.Label>
          <Form.Control
            controlId="program_info_report"
            as="textarea"
            maxLength={2000}
            rows="10"
            placeholder="Deadline is wrong.
                IELTS 7"
            value={programReportModalState.description || ''}
            isInvalid={programReportModalState.description?.length > 2000}
            onChange={(e) => handleChange(e)}
          ></Form.Control>
          <Badge
            className="mt-3"
            bg={`${
              programReportModalState.description?.length > 2000
                ? 'danger'
                : 'primary'
            }`}
          >
            {programReportModalState.description?.length || 0}/{2000}
          </Badge>
        </Form.Group>
      </Form>

      <Button
        color="primary"
        variant="contained"
        disabled={programReportModalState.description?.length === 0}
        onClick={() =>
          props.submitProgramReport(
            props.program_id,
            programReportModalState.description
          )
        }
      >
        {t('Create ticket')}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={props.setReportModalHideDelete}
      >
        {t('Close')}
      </Button>
    </ModalNew>
  );
}
export default ProgramReportModal;
