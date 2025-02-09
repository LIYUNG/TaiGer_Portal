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

const AddUserModal = (props) => {
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
            onClose={props.cloaseAddUserModal}
            open={props.addUserModalState}
        >
            <DialogTitle>{i18next.t('Add New User')}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label={i18next.t('First Name (English)')}
                    name="firstname"
                    onChange={(e) => handleChange(e)}
                    placeholder="Shiao-Ming"
                    required
                    sx={{ mb: 2 }}
                    type="text"
                />
                <TextField
                    fullWidth
                    label={i18next.t('Last Name (English)')}
                    name="lastname"
                    onChange={(e) => handleChange(e)}
                    placeholder="Chen"
                    required
                    sx={{ mb: 2 }}
                    type="text"
                />
                <TextField
                    fullWidth
                    label={i18next.t('名 (中文)')}
                    name="firstname_chinese"
                    onChange={(e) => handleChange(e)}
                    placeholder="小明"
                    required
                    sx={{ mb: 2 }}
                    type="text"
                />
                <TextField
                    fullWidth
                    label={i18next.t('姓 (中文)')}
                    name="lastname_chinese"
                    onChange={(e) => handleChange(e)}
                    placeholder="陳"
                    required
                    sx={{ mb: 2 }}
                    type="text"
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="Application Count">
                        {i18next.t('Application Count')}
                    </InputLabel>
                    <Select
                        id="Application Count"
                        label={i18next.t('Application Count')}
                        labelId="Application Count"
                        name="applying_program_count"
                        onChange={(e) => handleChange(e)}
                        value={
                            addUserModal.user_information
                                ?.applying_program_count || '0'
                        }
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
                    fullWidth
                    label={i18next.t('Email Address')}
                    name="email"
                    onChange={(e) => handleChange(e)}
                    placeholder="chung.ming.wang@gmail.com"
                    required
                    sx={{ mb: 2 }}
                    type="text"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={
                        !addUserModal.user_information.firstname ||
                        !addUserModal.user_information.lastname ||
                        !addUserModal.user_information.email ||
                        !props.isLoaded
                    }
                    onClick={(e) =>
                        AddUserSubmit(e, addUserModal.user_information)
                    }
                    variant="contained"
                >
                    {props.isLoaded
                        ? i18next.t('add-user')
                        : i18next.t('Loading')}
                </Button>
                <Button
                    color="secondary"
                    onClick={props.cloaseAddUserModal}
                    variant="outlined"
                >
                    {i18next.t('Cancel', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddUserModal;
