import { React, useState } from 'react';
import {
  Button,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';
import { programField2Label, sortProgramFields } from '../Utils/contants';
// import { highlightTextDiff } from '../Utils/diffChecker';

const programFromAI = {
  _id: {
    $oid: '12532fde46752651539120128'
  },
  allowOnlyGraduatedApplicant: true,
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

const ignoreKeys = ['_id', 'updatedAt', 'whoupdated', 'createdAt', '__v'];

const getAllKeys = (original, updated) => {
  const originalKeys = Object.keys(original);
  const updatedKeys = Object.keys(updated);
  return [...new Set([...originalKeys, ...updatedKeys])].sort(
    sortProgramFields
  );
};

function ProgromDiffRow({ fieldName, original, incoming, ...rowProps }) {
  const { t } = useTranslation();
  const [isAccepted, setAccepted] = useState(false);
  const toggleAccept = () => {
    setAccepted(!isAccepted);
  };

  return (
    <TableRow hover {...rowProps}>
      <TableCell>
        <Typography variant="body1">
          {t(programField2Label?.[fieldName] || fieldName, {
            ns: 'common'
          })}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">{JSON.stringify(original)}</Typography>
      </TableCell>
      <TableCell style={isAccepted ? { backgroundColor: 'lightgreen' } : {}}>
        <Typography variant="body1">{JSON.stringify(incoming)}</Typography>
      </TableCell>
      <TableCell>
        {incoming && original !== incoming && (
          <Button
            sx={{ width: '100px' }}
            color={isAccepted ? 'error' : 'success'}
            onClick={toggleAccept}
          >
            {isAccepted ? <CloseIcon /> : <CheckIcon />}
            {''}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

function ProgramDiffModal(props) {
  const { t } = useTranslation('common');
  const originalProgram = props.originalProgram;
  const keys = getAllKeys(originalProgram, programFromAI);

  const modifiedKeys = [];
  const originalKey = [];
  keys.forEach((key) => {
    if (
      programFromAI?.[key] &&
      originalProgram?.[key] !== programFromAI?.[key]
    ) {
      modifiedKeys.push(key);
    } else {
      originalKey.push(key);
    }
  });

  console.log(modifiedKeys, originalKey);

  return (
    <ModalNew
      open={props.open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h6">Merge Program input</Typography>
      TODO: sort first by changed then by key, translate label to human readable
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Field')}</TableCell>
              <TableCell>{t('Original')}</TableCell>
              <TableCell>{t('Incoming Changes')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modifiedKeys.map((key) => {
              if (ignoreKeys.includes(key)) {
                return;
              }
              return (
                <ProgromDiffRow
                  key={key}
                  fieldName={key}
                  original={originalProgram?.[key]}
                  incoming={programFromAI?.[key]}
                />
              );
            })}
            {originalKey.map((key) => {
              if (ignoreKeys.includes(key)) {
                return;
              }
              return (
                <ProgromDiffRow
                  key={key}
                  fieldName={key}
                  original={originalProgram?.[key]}
                  incoming={programFromAI?.[key]}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button color="secondary" variant="outlined" onClick={props.setModalHide}>
        {t('Close', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramDiffModal;
