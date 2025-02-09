import React, { useState } from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const GrantPermissionModal = (props) => {
    const { t } = useTranslation();
    const [grantPermissionModalState, setGrantPermissionModalState] = useState({
        permissions:
            props.user_permissions.length > 0
                ? props.user_permissions[0]
                : { canAssignEditors: false, canAssignAgents: false },
        changed: false
    });

    const onChangePermissions = (e) => {
        const { value, checked } = e.target;
        setGrantPermissionModalState((prevState) => ({
            ...prevState,
            permissions: {
                ...prevState.permissions,
                [value]: checked
            },
            changed: true
        }));
    };

    const onChangePermissions_Quota = (e) => {
        const { value, id } = e.target;
        setGrantPermissionModalState((prevState) => ({
            ...prevState,
            permissions: {
                ...prevState.permissions,
                [id]: value
            },
            changed: true
        }));
    };

    const onSubmitHandler = (e) => {
        props.onUpdatePermissions(e, grantPermissionModalState.permissions);
    };
    const permissions = [
        ['canModifyProgramList', 'Can modify program list'],
        [
            'canModifyAllBaseDocuments',
            'Can modify all Base Documents And Survey Data'
        ],
        ['canAccessAllChat', 'Can access all chat'],
        ['canAssignAgents', 'Can assign agents'],
        ['canAssignEditors', 'Can assign editors'],
        ['canModifyDocumentation', 'Can modify documentation'],
        ['canAccessStudentDatabase', 'Can access student database'],
        ['canUseTaiGerAI', 'Can use TaiGer AI']
    ];
    const permissionsQuota = [['taigerAiQuota', 'TaiGerAI Quota']];

    return (
        <Dialog
            aria-labelledby="contained-modal-title-vcenter"
            onClose={props.setModalHide}
            open={props.modalShow}
        >
            <DialogTitle>
                Edit {props.firstname} - {props.lastname} permissions:
            </DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Permission</TableCell>
                            <TableCell>Check</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {permissions.map((permission, i) => (
                            <TableRow key={i + 1}>
                                <TableCell>{permission[1]}</TableCell>
                                <TableCell>
                                    <FormControl>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        grantPermissionModalState
                                                            .permissions[
                                                            permission[0]
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        onChangePermissions(e)
                                                    }
                                                    sx={{
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '1.5rem'
                                                        }
                                                    }}
                                                    type="checkbox"
                                                    value={permission[0]}
                                                />
                                            }
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                        {permissionsQuota.map((permission_quota, j) => (
                            <TableRow key={j + 1000}>
                                <TableCell>{permission_quota[1]}</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        id={permission_quota[0]}
                                        label="Quota"
                                        name={permission_quota[0]}
                                        onChange={(e) =>
                                            onChangePermissions_Quota(e)
                                        }
                                        placeholder="1000"
                                        type="number"
                                        value={
                                            grantPermissionModalState
                                                .permissions[
                                                permission_quota[0]
                                            ]
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={!grantPermissionModalState.changed}
                    onClick={(e) => onSubmitHandler(e)}
                    variant="contained"
                >
                    {t('Update', { ns: 'common' })}
                </Button>
                <Button
                    color="primary"
                    onClick={props.setModalHide}
                    variant="outlined"
                >
                    {t('Cancel', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default GrantPermissionModal;
