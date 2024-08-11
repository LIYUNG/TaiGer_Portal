import React, { useState, useEffect } from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Link,
  Typography,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import ProgramCompare from './ProgramCompare';
import { getProgramChangeRequests, getProgram } from '../../api/index';

import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { convertDate } from '../Utils/contants';

function CustomBreadcrumbs({ program }) {
  const { t } = useTranslation();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        underline="hover"
        color="inherit"
        component={LinkDom}
        to={`${DEMO.DASHBOARD_LINK}`}
      >
        {appConfig.companyName}
      </Link>
      <Link
        underline="hover"
        color="inherit"
        component={LinkDom}
        to={`${DEMO.PROGRAMS}`}
      >
        {t('Program List', { ns: 'common' })}
      </Link>
      <Link
        underline="hover"
        color="inherit"
        component={LinkDom}
        to={`${DEMO.SINGLE_PROGRAM_LINK(program._id)}`}
      >
        {`${program.school}-${program.program_name}`}
      </Link>
      <Typography color="text.primary">Change Requests</Typography>
    </Breadcrumbs>
  );
}

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
      <CustomBreadcrumbs program={originalProgram} />
      <Box sx={{ my: 3 }}>
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
      </Box>
    </>
  );
}
export default ProgramChangeRequestPage;
