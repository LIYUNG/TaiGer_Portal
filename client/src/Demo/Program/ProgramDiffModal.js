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
import { programField2Label } from '../Utils/contants';
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

const ignoreKeys = ['_id', 'updatedAt', 'whoupdated'];

const getAllKeys = (original, updated) => {
  const originalKeys = Object.keys(original);
  const updatedKeys = Object.keys(updated);
  return [...new Set([...originalKeys, ...updatedKeys])];
};

function ProgromDiffRow({ fieldName, original, incoming, ...rowProps }) {
  const [isAccepted, setAccepted] = useState(false);

  const toggleAccept = () => {
    setAccepted(!isAccepted);
  };

  return (
    <TableRow hover {...rowProps}>
      <TableCell>
        <Typography variant="body1">
          {programField2Label?.[fieldName] || fieldName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">{JSON.stringify(original)}</Typography>
      </TableCell>
      <TableCell style={isAccepted ? { backgroundColor: 'lightgreen' } : {}}>
        <Typography variant="body1">{JSON.stringify(incoming)}</Typography>
      </TableCell>
      <TableCell>
        {original !== incoming && (
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
  const { t } = useTranslation();
  const originalProgram = props.originalProgram;
  const keys = getAllKeys(originalProgram, programFromAI);

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
              <TableCell></TableCell>
              <TableCell>{t('Original')}</TableCell>
              <TableCell>{t('Incoming Changes')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((key) => {
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
