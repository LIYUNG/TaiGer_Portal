import React from 'react';
import { Link as LinkDom, Navigate, useLoaderData } from 'react-router-dom';
import {
  Box,
  Card,
  Breadcrumbs,
  Table,
  Link,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';

function Contact() {
  const { user } = useAuth();
  const {
    data: { data: students }
  } = useLoaderData();
  const { t } = useTranslation();
  const contactState = {
    students: students
  };

  if (
    user.role !== 'Admin' &&
    user.role !== 'Editor' &&
    user.role !== 'Agent' &&
    user.role !== 'Student'
  ) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(t('Contact Us', { ns: 'common' }));

  const your_editors = contactState.students[0].editors ? (
    contactState.students[0].editors.map((editor, i) => (
      <TableRow key={i}>
        <TableCell>{t('Editor', { ns: 'common' })}</TableCell>
        <TableCell>
          {editor.firstname} - {editor.lastname}
        </TableCell>
        <TableCell>{editor.email}</TableCell>
      </TableRow>
    ))
  ) : (
    <></>
  );

  const your_agents = contactState.students[0].agents ? (
    contactState.students[0].agents.map((agent, i) => (
      <TableRow key={i}>
        <TableCell>{t('Agent', { ns: 'common' })}</TableCell>
        <TableCell>
          <Link
            to={`${DEMO.TEAM_AGENT_PROFILE_LINK(agent._id.toString())}`}
            component={LinkDom}
          >
            {agent.firstname} - {agent.lastname}
          </Link>
        </TableCell>
        <TableCell>{agent.email}</TableCell>
      </TableRow>
    ))
  ) : (
    <></>
  );

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">
          {t('Contact Us', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Typography sx={{ my: 2 }}>Your {appConfig.companyName} Team</Typography>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('Role')}</TableCell>
              <TableCell>First-, Last Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {your_agents}
            {your_editors}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}

export default Contact;
