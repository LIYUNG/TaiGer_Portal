import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import i18next from 'i18next';

function AddUserModal(props) {
    const [addUserModal, setAddUserModal] = useState({ user_information: {} });
    const handleChange = (e) => {
        e.preventDefault();
        var user_information_temp = { ...addUserModal.user_information };
        user_information_temp[e.target.name] = e.target.value;
        setAddUserModal((prevState) => ({
            ...prevState,
            user_information: user_information_temp
        }));
    };
    const AddUserSubmit = (e, user_information) => {
        e.preventDefault();
        if (
            !user_information.firstname ||
            !user_information.lastname ||
            !user_information.email
        ) {
            /* empty */
        } else {
            props.AddUserSubmit(e, user_information);
        }
    };

    return (
        <Dialog
            open={props.addUserModalState}
            onClose={props.cloaseAddUserModal}
        >
            <DialogTitle>{i18next.t('Add New User')}</DialogTitle>
            <DialogContent>
                <TextField
                    name="firstname"
                    required
                    fullWidth
                    label={i18next.t('First Name (English)')}
                    type="text"
                    placeholder="Shiao-Ming"
                    onChange={(e) => handleChange(e)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    name="lastname"
                    required
                    fullWidth
                    label={i18next.t('Last Name (English)')}
                    type="text"
                    placeholder="Chen"
                    onChange={(e) => handleChange(e)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    name="firstname_chinese"
                    required
                    fullWidth
                    label={i18next.t('名 (中文)')}
                    type="text"
                    placeholder="小明"
                    onChange={(e) => handleChange(e)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    name="lastname_chinese"
                    required
                    fullWidth
                    label={i18next.t('姓 (中文)')}
                    type="text"
                    placeholder="陳"
                    onChange={(e) => handleChange(e)}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="Application Count">
                        {i18next.t('Application Count')}
                    </InputLabel>
                    <Select
                        labelId="Application Count"
                        name="applying_program_count"
                        id="Application Count"
                        value={
                            addUserModal.user_information
                                ?.applying_program_count || '0'
                        }
                        label={i18next.t('Application Count')}
                        onChange={(e) => handleChange(e)}
                    >
                        <MenuItem value="0">
                            {i18next.t('Please Select')}
                        </MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="6">6</MenuItem>
                        <MenuItem value="7">7</MenuItem>
                        <MenuItem value="8">8</MenuItem>
                        <MenuItem value="9">9</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    name="email"
                    required
                    fullWidth
                    label={i18next.t('Email Address')}
                    type="text"
                    placeholder="chung.ming.wang@gmail.com"
                    onChange={(e) => handleChange(e)}
                    sx={{ mb: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    disabled={
                        !addUserModal.user_information.firstname ||
                        !addUserModal.user_information.lastname ||
                        !addUserModal.user_information.email ||
                        !props.isLoaded
                    }
                    onClick={(e) =>
                        AddUserSubmit(e, addUserModal.user_information)
                    }
                >
                    {props.isLoaded
                        ? i18next.t('add-user')
                        : i18next.t('Loading')}
                </Button>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={props.cloaseAddUserModal}
                >
                    {i18next.t('Cancel', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default AddUserModal;
