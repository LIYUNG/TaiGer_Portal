import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import ProgramCompare from './ProgramCompare';
import { getProgramChangeRequests, getProgram } from '../../api/index';
import { convertDate } from '../Utils/contants';

function ProgramChangeRequestPage(props) {
  const { programId } = useParams();
  const [originalProgram, setOriginalProgram] = useState({});
  const [incomingChanges, setIncomingChanges] = useState([]);
  const [changeIndex, setChangeIndex] = useState(0);

  useEffect(() => {
    getProgram(programId).then((res) => {
      const { data } = res.data;
      setOriginalProgram(data);
    });
    getProgramChangeRequests(programId).then((res) => {
      const { data } = res.data;
      setIncomingChanges(data);
    });
  }, [programId]);

  return (
    <>
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
                  {convertDate(change?.updatedAt)} -{' '}
                  {change.requestedBy
                    ? `${change.requestedBy.firstname} ${change.requestedBy.lastname} `
                    : 'External Source'}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
      <ProgramCompare
        originalProgram={originalProgram || {}}
        incomingChanges={incomingChanges[changeIndex] || {}}
        submitCallBack={props.setModalHide}
      />
    </>
  );
}
export default ProgramChangeRequestPage;
