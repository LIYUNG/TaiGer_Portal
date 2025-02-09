import React from 'react';
import {
    Badge,
    Button,
    CircularProgress,
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
import { is_TaiGer_Agent, is_TaiGer_Student } from '@taiger-common/core';

import '../style/model.scss';
import {
    NoonNightLabel,
    convertDate,
    showTimezoneOffset
} from '../../../utils/contants';

import { useTranslation } from 'react-i18next';

const Popping = ({
    open,
    handleClose,
    handleChange,
    handleChangeReceiver,
    newReceiver,
    BookButtonDisable,
    event,
    handleBook,
    newDescription,
    user
}) => {
    const { t } = useTranslation();
    if (event?.id) {
        // const navigate = useNavigate();
        const { title, start, end } = event;
        const textLimit = 2000;

        const modal = () => {
            return (
                <Dialog centered onClose={handleClose} open={open} size="xl">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        請寫下想討論的主題
                        <TextField
                            fullWidth
                            inputProps={{ maxLength: textLimit }}
                            isInvalid={newDescription?.length > textLimit}
                            minRows={5}
                            multiline
                            onChange={handleChange}
                            placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
                            type="textarea"
                            value={newDescription || ''}
                        />
                        <br />
                        <Badge
                            bg={`${
                                newDescription?.length > textLimit
                                    ? 'danger'
                                    : 'primary'
                            }`}
                        >
                            {newDescription?.length || 0}/{textLimit}
                        </Badge>
                        <FormControl fullWidth>
                            <InputLabel id="Agent">
                                {t('Agent', { ns: 'common' })}
                            </InputLabel>
                            <Select
                                id="Agent"
                                label={t('Agent', { ns: 'common' })}
                                labelId="Agent"
                                name="Agent"
                                onChange={handleChangeReceiver}
                                value={
                                    is_TaiGer_Student(user)
                                        ? user.agents.length > 0
                                            ? newReceiver
                                            : ''
                                        : ''
                                }
                            >
                                {is_TaiGer_Student(user) ? (
                                    <MenuItem value="">Please Select</MenuItem>
                                ) : null}
                                {is_TaiGer_Student(user) ? (
                                    <MenuItem
                                        value={event.provider._id.toString()}
                                    >
                                        {event.provider.firstname}{' '}
                                        {event.provider.lastname}
                                    </MenuItem>
                                ) : is_TaiGer_Agent(user) ? (
                                    <MenuItem value={user._id.toString()}>
                                        {user.firstname}
                                        {user.lastname}
                                    </MenuItem>
                                ) : (
                                    user.agents.map((agent, i) => (
                                        <MenuItem
                                            key={i}
                                            value={agent._id.toString()}
                                        >
                                            {agent.firstname}
                                            {agent.lastname}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                        <br />
                        <ul>
                            <li className="col text-secondary pb-0 mb-0">
                                From: {convertDate(start)}{' '}
                                {NoonNightLabel(start)}{' '}
                                {
                                    Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone
                                }{' '}
                                UTC
                                {showTimezoneOffset()}
                            </li>
                            <li className="col text-secondary pb-0 mb-0">
                                To: {convertDate(end)}{' '}
                                {
                                    Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone
                                }{' '}
                                UTC
                                {showTimezoneOffset()}
                            </li>
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            disabled={
                                newDescription?.length === 0 ||
                                newReceiver === '' ||
                                BookButtonDisable
                            }
                            onClick={handleBook}
                            size="small"
                            sx={{ mr: 2 }}
                            variant="contained"
                        >
                            {BookButtonDisable ? (
                                <CircularProgress />
                            ) : (
                                t('Book')
                            )}
                        </Button>
                        <Button
                            color="secondary"
                            onClick={handleClose}
                            size="small"
                            variant="outlined"
                        >
                            {t('Close', { ns: 'common' })}
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };
        return modal();
    } else {
        <p>there is no modal to preview</p>;
    }
};

export default Popping;
