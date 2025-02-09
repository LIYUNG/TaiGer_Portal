import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@mui/material';

import { useTranslation } from 'react-i18next';

const UsersListSubpage = (props) => {
    const { t } = useTranslation();
    const user_roles = ['Student', 'Editor', 'Agent', 'External'];
    return (
        <Dialog centered onClose={props.setModalHide} open={props.show}>
            <DialogTitle>
                Assign {props.firstname} - {props.lastname} as
            </DialogTitle>
            <DialogContent>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        onChange={props.handleChange2}
                        value={props.selected_user_role}
                    >
                        {user_roles.map((role, i) => (
                            <FormControlLabel
                                control={<Radio />}
                                key={i + 1}
                                label={role}
                                onChange={props.handleChange2}
                                value={role}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={(e) => props.onSubmit2(e)}
                    sx={{ mr: 2 }}
                    variant="contained"
                >
                    {t('Assign', { ns: 'common' })}
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
export default UsersListSubpage;
