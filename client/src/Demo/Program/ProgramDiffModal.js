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
import {
  Restore as RestoreIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
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

const DiffRow = ({
  fieldName,
  original,
  incoming,
  updateField,
  showToggleButton = false,
  ...rowProps
}) => {
  const { t } = useTranslation();
  const [isAccepted, setAccepted] = useState(false);
  const toggleAccept = () => {
    if (isAccepted) {
      // remove the incoming value
      updateField(fieldName, null, true);
    } else {
      updateField(fieldName, incoming);
    }
    setAccepted(!isAccepted);
  };

  const cellHightlight = (included) => {
    return included
      ? { backgroundColor: 'lightgreen' }
      : { backgroundColor: 'lightcoral' };
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
      <TableCell
        style={
          showToggleButton && isAccepted ? cellHightlight(!isAccepted) : {}
        }
      >
        <Typography variant="body1">{JSON.stringify(original)}</Typography>
      </TableCell>
      <TableCell>
        {showToggleButton && (
          <Button
            // color={isAccepted ? 'error' : 'success'}
            onClick={toggleAccept}
          >
            {isAccepted ? <RestoreIcon /> : <ArrowBackIcon />}
          </Button>
        )}
      </TableCell>
      <TableCell
        style={
          showToggleButton && !isAccepted ? cellHightlight(!isAccepted) : {}
        }
      >
        <Typography variant="body1">{JSON.stringify(incoming)}</Typography>
      </TableCell>
    </TableRow>
  );
};

const DiffTableContent = ({ originalProgram, programFromAI, setDelta }) => {
  const keys = getAllKeys(originalProgram, programFromAI);
  const updateField = (fieldName, value, shouldRemove = false) => {
    if (shouldRemove) {
      setDelta((prevDelta) => {
        delete prevDelta[fieldName];
        return { ...prevDelta };
      });
    } else {
      setDelta((prevDelta) => {
        return { ...prevDelta, [fieldName]: value };
      });
    }
  };

  const modifiedKeys = [];
  const originalKey = [];

  keys.forEach((key) => {
    if (
      programFromAI?.[key] &&
      JSON.stringify(originalProgram?.[key]) !==
        JSON.stringify(programFromAI?.[key])
    ) {
      modifiedKeys.push(key);
    } else {
      originalKey.push(key);
    }
  });
  return (
    <>
      {modifiedKeys.map((key) => {
        if (ignoreKeys.includes(key)) {
          return;
        }
        return (
          <DiffRow
            key={key}
            fieldName={key}
            original={originalProgram?.[key]}
            incoming={programFromAI?.[key]}
            updateField={updateField}
            showToggleButton={true}
          />
        );
      })}
      {originalKey.map((key) => {
        if (ignoreKeys.includes(key)) {
          return;
        }
        return (
          <DiffRow
            key={key}
            style={{ backgroundColor: 'lightgrey' }}
            fieldName={key}
            original={originalProgram?.[key]}
            incoming={programFromAI?.[key]}
            updateField={updateField}
            showToggleButton={false}
          />
        );
      })}
    </>
  );
};

function ProgramDiffModal(props) {
  const { t } = useTranslation('common');
  const originalProgram = props.originalProgram;

  const [delta, setDelta] = useState({});

  return (
    <ModalNew
      open={props.open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h6">Merge Program input</Typography>
      <Typography variant="body1">
        Changes to submit: {JSON.stringify(delta)}
      </Typography>
      <Button color="secondary" onClick={props.setModalHide}>
        X
      </Button>
      <Button color="primary">{t('Accept All', { ns: 'common' })}</Button>
      <Button color="secondary">{t('Reject All', { ns: 'common' })}</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Field')}</TableCell>
              <TableCell style={{ width: '45%' }}>{t('Original')}</TableCell>
              <TableCell></TableCell>
              <TableCell style={{ width: '45%' }}>{t('Changed to')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DiffTableContent
              originalProgram={originalProgram}
              programFromAI={programFromAI}
              setDelta={setDelta}
            />
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
