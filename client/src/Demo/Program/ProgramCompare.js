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

import { programField2Label, sortProgramFields } from '../Utils/contants';

const IGNORE_KEYS = ['_id', 'updatedAt', 'whoupdated', 'createdAt', '__v'];

const getAllKeys = (original, incoming) => {
  const originalKeys = Object.keys(original);
  const updatedKeys = Object.keys(incoming);
  return [...new Set([...originalKeys, ...updatedKeys])].sort(
    sortProgramFields
  );
};

const getDiffKeys = (original, incoming) => {
  const allKeys = getAllKeys(original, incoming);
  const modifiedKeys = [];
  const originalKey = [];

  allKeys.forEach((key) => {
    if (IGNORE_KEYS.includes(key)) return;
    const originalValue = original?.[key];
    const incomingValue = incoming?.[key];

    if (
      incomingValue &&
      JSON.stringify(originalValue) !== JSON.stringify(incomingValue)
    ) {
      modifiedKeys.push(key);
    } else {
      originalKey.push(key);
    }
  });

  return { modifiedKeys, originalKey };
};

const DiffRow = ({
  fieldName,
  original,
  incoming,
  updateField,
  isAccepted,
  showToggleButton = false,
  ...rowProps
}) => {
  const { t } = useTranslation();

  const toggleAccept = () => {
    if (isAccepted) {
      updateField(fieldName, null, true);
    } else {
      updateField(fieldName, incoming);
    }
  };

  return (
    <TableRow
      hover
      {...rowProps}
      sx={!showToggleButton ? { bgcolor: 'grey.300' } : {}}
    >
      <TableCell>
        <Typography variant="body1">
          {t(programField2Label?.[fieldName] || fieldName, {
            ns: 'common'
          })}
        </Typography>
      </TableCell>
      <TableCell
        sx={isAccepted && showToggleButton ? { bgcolor: 'success.light' } : {}}
      >
        <Typography variant="body1">{JSON.stringify(original)}</Typography>
      </TableCell>
      <TableCell>
        {showToggleButton && (
          <Button onClick={toggleAccept}>
            {isAccepted ? <RestoreIcon /> : <ArrowBackIcon />}
          </Button>
        )}
      </TableCell>
      <TableCell
        sx={!isAccepted && showToggleButton ? { bgcolor: 'error.light' } : {}}
      >
        <Typography variant="body1">{JSON.stringify(incoming)}</Typography>
      </TableCell>
    </TableRow>
  );
};

const DiffTableContent = ({
  originalProgram,
  incomingProgram,
  delta,
  setDelta
}) => {
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

  const { modifiedKeys, originalKey } = getDiffKeys(
    originalProgram,
    incomingProgram
  );

  return (
    <>
      {[...modifiedKeys, ...originalKey].map((key) => {
        if (IGNORE_KEYS.includes(key)) {
          return;
        }
        const isModified = modifiedKeys.includes(key);
        return (
          <DiffRow
            key={key}
            fieldName={key}
            original={originalProgram?.[key]}
            incoming={incomingProgram?.[key]}
            updateField={updateField}
            isAccepted={key in delta}
            showToggleButton={isModified}
          />
        );
      })}
    </>
  );
};

const ProgramCompare = ({ originalProgram, incomingProgram }) => {
  const { t } = useTranslation('common');
  const [delta, setDelta] = useState({});

  const acceptAllChanges = () => {
    const { modifiedKeys } = getDiffKeys(originalProgram, incomingProgram);
    const modifiedDelta = Object.keys(incomingProgram)
      .filter((key) => modifiedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = incomingProgram[key];
        return obj;
      }, {});
    setDelta(modifiedDelta);
  };

  return (
    <>
      <Typography variant="body1">
        Changes to submit: {JSON.stringify(delta)}
      </Typography>
      <Button color="primary" onClick={acceptAllChanges}>
        {t('Accept All', { ns: 'common' })}
      </Button>
      <Button
        color="secondary"
        onClick={() => {
          setDelta({});
        }}
      >
        {t('Reject All', { ns: 'common' })}
      </Button>
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
              incomingProgram={incomingProgram}
              delta={delta}
              setDelta={setDelta}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProgramCompare;
