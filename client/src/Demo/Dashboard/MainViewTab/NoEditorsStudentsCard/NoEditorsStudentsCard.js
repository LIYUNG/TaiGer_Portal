import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Link,
    Menu,
    MenuItem,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { is_TaiGer_role } from '@taiger-common/core';

import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

const NoEditorsStudentsCard = (props) => {
    const { user } = useAuth();
    const [noEditorsStudentsCardState, setNoEditorsStudentsCardState] =
        useState({
            showEditorPage: false
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

    const setEditorModalhide = () => {
        setNoEditorsStudentsCardState((prevState) => ({
            ...prevState,
            showEditorPage: false
        }));
    };

    const startEditingEditor = () => {
        setNoEditorsStudentsCardState((prevState) => ({
            ...prevState,
            subpage: 2,
            showEditorPage: true
        }));
    };

    const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
        e.preventDefault();
        setEditorModalhide();
        props.submitUpdateEditorlist(e, updateEditorList, student_id);
    };

    if (
        props.student.editors === undefined ||
        props.student.editors.length === 0
    ) {
        return (
            <>
                <TableRow>
                    {is_TaiGer_role(user) && !props.isArchivPage ? (
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
                                <MenuItem onClick={() => startEditingEditor()}>
                                    Edit Editor
                                </MenuItem>
                            </Menu>
                        </TableCell>
                    ) : null}
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                props.student._id.toString(),
                                DEMO.PROFILE_HASH
                            )}`}
                        >
                            {props.student.firstname}, {props.student.lastname}
                        </Link>
                    </TableCell>
                    <TableCell>{props.student.email}</TableCell>
                    <TableCell>
                        <Typography fontWeight="bold">
                            {props.student.needEditor ? 'Ready to Assign' : '-'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {props.student.application_preference
                                .target_program_language || 'TBD'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {props.student.application_preference
                                .expected_application_date || 'TBD'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        {!props.student.agents ||
                        props.student.agents.length === 0 ? (
                            <Typography fontWeight="bold">No Agent</Typography>
                        ) : (
                            props.student.agents.map((agent, i) => (
                                <Typography
                                    key={i}
                                >{`${agent.firstname}`}</Typography>
                            ))
                        )}
                    </TableCell>
                </TableRow>
                {is_TaiGer_role(user) &&
                noEditorsStudentsCardState.showEditorPage ? (
                    <EditEditorsSubpage
                        onHide={setEditorModalhide}
                        setmodalhide={setEditorModalhide}
                        show={noEditorsStudentsCardState.showEditorPage}
                        student={props.student}
                        submitUpdateEditorlist={submitUpdateEditorlist}
                    />
                ) : null}
            </>
        );
    } else {
        return null;
    }
};

export default NoEditorsStudentsCard;
