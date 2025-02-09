import React from 'react';
import { Link as LinkDom, Navigate, useLoaderData } from 'react-router-dom';
import {
    Box,
    Card,
    Table,
    Link,
    Typography,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Role } from '@taiger-common/core';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const Contact = () => {
    const { user } = useAuth();
    const {
        data: { data: students }
    } = useLoaderData();
    const { t } = useTranslation();
    const contactState = {
        students: students
    };

    if (
        user.role !== Role.Admin &&
        user.role !== Role.Editor &&
        user.role !== Role.Agent &&
        user.role !== Role.Student
    ) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(t('Contact Us', { ns: 'common' }));

    const your_editors = contactState.students[0].editors
        ? contactState.students[0].editors.map((editor, i) => (
              <TableRow key={i}>
                  <TableCell>{t('Editor', { ns: 'common' })}</TableCell>
                  <TableCell>
                      {editor.firstname} - {editor.lastname}
                  </TableCell>
                  <TableCell>{editor.email}</TableCell>
              </TableRow>
          ))
        : null;

    const your_agents = contactState.students[0].agents
        ? contactState.students[0].agents.map((agent, i) => (
              <TableRow key={i}>
                  <TableCell>{t('Agent', { ns: 'common' })}</TableCell>
                  <TableCell>
                      <Link
                          component={LinkDom}
                          to={`${DEMO.TEAM_AGENT_PROFILE_LINK(agent._id.toString())}`}
                      >
                          {agent.firstname} - {agent.lastname}
                      </Link>
                  </TableCell>
                  <TableCell>{agent.email}</TableCell>
              </TableRow>
          ))
        : null;

    return (
        <Box>
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: t('Contact Us', { ns: 'common' })
                    }
                ]}
            />
            <Typography sx={{ my: 2 }}>
                Your {appConfig.companyName} Team
            </Typography>
            <Card>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Role')}</TableCell>
                            <TableCell>First-, Last Name</TableCell>
                            <TableCell>
                                {t('Email', { ns: 'common' })}
                            </TableCell>
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
};

export default Contact;
