import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
    Button,
    Link,
    Menu,
    MenuItem,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_Admin } from '@taiger-common/core';

import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

const NoAgentsStudentsCard = (props) => {
    const { user } = useAuth();
    const [noAgentsStudentsCardState, setNoAgentsStudentsCard] = useState({
        showAgentPage: false
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const setAgentModalhide = () => {
        setNoAgentsStudentsCard({
            showAgentPage: false
        });
    };

    const startEditingAgent = () => {
        setNoAgentsStudentsCard({
            showAgentPage: true
        });
    };

    const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
        e.preventDefault();
        setAgentModalhide();
        props.submitUpdateAgentlist(e, updateAgentList, student_id);
    };

    if (
        props.student.agents === undefined ||
        props.student.agents.length === 0
    ) {
        return (
            <>
                <TableRow>
                    {is_TaiGer_Admin(user) && !props.isArchivPage ? (
                        <TableCell>
                            <Button
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                id="basic-button"
                                onClick={handleClick}
                                size="small"
                                variant="contained"
                            >
                                {t('Option', { ns: 'common' })}
                            </Button>
                            <Menu
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button'
                                }}
                                anchorEl={anchorEl}
                                id="basic-menu"
                                onClose={handleClose}
                                open={open}
                            >
                                <MenuItem onClick={() => startEditingAgent()}>
                                    {t('Edit Agent', { ns: 'dashboard' })}
                                </MenuItem>
                            </Menu>
                        </TableCell>
                    ) : null}
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                props.student._id,
                                DEMO.PROFILE_HASH
                            )}`}
                        >
                            {props.student.firstname}
                            {', '}
                            {props.student.lastname}
                        </Link>
                    </TableCell>
                    <TableCell>{props.student.email}</TableCell>
                    <TableCell>
                        {props.student.application_preference
                            .expected_application_date || (
                            <Typography>TBD</Typography>
                        )}
                    </TableCell>
                </TableRow>
                {is_TaiGer_Admin(user) &&
                noAgentsStudentsCardState.showAgentPage ? (
                    <EditAgentsSubpage
                        onHide={setAgentModalhide}
                        setmodalhide={setAgentModalhide}
                        show={noAgentsStudentsCardState.showAgentPage}
                        student={props.student}
                        submitUpdateAgentlist={submitUpdateAgentlist}
                    />
                ) : null}
            </>
        );
    } else {
        return null;
    }
};

export default NoAgentsStudentsCard;
