import React from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ModalNew from '../../components/Modal';

const programFromAI = {
  _id: {
    $oid: '12532fde46752651539120128'
  },
  school: 'Durham University',
  program_name: 'English Studies',
  special_notes: 'send paper copy to the university!',
  degree: 'M. A.',
  semester: 'WS',
  lang: 'English',
  uni_assist: 'No',
  ml_required: 'yes',
  rl_required: '3',
  country: 'ABC',
  is_rl_specific: false,
  optionalDocuments: [],
  requiredDocuments: [],
  updatedAt: {
    $date: '2024-05-05T11:01:38.812Z'
  },
  whoupdated: 'Alex TaiGer',
  application_deadline: 'Rolling',
  comments: 'sadfsdfsdgf',
  study_group_flag: '',
  ml_requirements: ''
};

const ignoreKeys = ['_id', 'updatedAt', 'whoupdated'];

const getAllKeys = (original, updated) => {
  const originalKeys = Object.keys(original);
  const updatedKeys = Object.keys(updated);
  return [...new Set([...originalKeys, ...updatedKeys])];
};

function ProgramDiffModal(props) {
  const { t } = useTranslation();
  const originalProgram = props.originalProgram;
  const keys = getAllKeys(originalProgram, programFromAI);

  console.log('keys: ', keys);
  return (
    <ModalNew
      open={props.open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h6">Hello!</Typography>
      {keys.map((key) => {
        if (ignoreKeys.includes(key)) {
          return null;
        }

        return (
          <div key={key}>
            <Typography variant="body1">
              {key}:
              {key in originalProgram
                ? JSON.stringify(originalProgram[key])
                : 'empty'}{' '}
              -{' '}
              {key in programFromAI
                ? JSON.stringify(programFromAI[key])
                : 'empty'}
            </Typography>
          </div>
        );
      })}
      <Button color="secondary" variant="outlined" onClick={props.setModalHide}>
        {t('Close', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramDiffModal;
