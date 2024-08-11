import { React, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  FormControl,
  MenuItem,
  Button,
  InputLabel,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import ModalNew from '../../components/Modal';
import ProgramCompare from './ProgramCompare';

import { getProgramChangeRequests } from '../../api/index';

function ProgramDiffModal(props) {
  const { t } = useTranslation();
  const { originalProgram } = props;
  const programId = originalProgram._id;

  const [incomingChanges, setIncomingChanges] = useState([]);
  const [changeIndex, setChangeIndex] = useState(0);

  useEffect(() => {
    getProgramChangeRequests(programId).then((res) => {
      const { data } = res.data;
      // const incomingProgram = data[0].programChanges;
      // console.log(incomingProgram);
      setIncomingChanges(data);
    });
  }, [programId]);

  return (
    <ModalNew
      open={props.open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Button color="secondary" onClick={props.setModalHide}>
        <CloseIcon />
      </Button>
      <Typography variant="h6">Merge Program input </Typography>
      <FormControl fullWidth>
        <InputLabel id="request-select-label">Requests</InputLabel>
        <Select
          labelId="request-select-label"
          id="request-select"
          value={changeIndex}
          label="Requests"
          onChange={(e) => setChangeIndex(e.target.value)}
        >
          {incomingChanges.length > 0 &&
            incomingChanges.map((change, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {new Date(change?.updatedAt)?.toLocaleString()} -{' '}
                  {change.requestedBy
                    ? `${change.requestedBy.firstname} ${change.requestedBy.lastname} `
                    : 'External Source'}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
      <ProgramCompare
        originalProgram={originalProgram}
        incomingChanges={incomingChanges[changeIndex] || {}}
        submitCallBack={props.setModalHide}
      />
      <Button color="secondary" variant="outlined" onClick={props.setModalHide}>
        {t('Close', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramDiffModal;
