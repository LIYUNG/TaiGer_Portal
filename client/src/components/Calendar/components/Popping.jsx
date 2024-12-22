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
} from '../../../Demo/Utils/contants';

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
        <Dialog open={open} size="xl" onClose={handleClose} centered>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            請寫下想討論的主題
            <TextField
              fullWidth
              type="textarea"
              inputProps={{ maxLength: textLimit }}
              multiline
              minRows={5}
              placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
              value={newDescription || ''}
              isInvalid={newDescription?.length > textLimit}
              onChange={handleChange}
            ></TextField>
            <br />
            <Badge
              bg={`${
                newDescription?.length > textLimit ? 'danger' : 'primary'
              }`}
            >
              {newDescription?.length || 0}/{textLimit}
            </Badge>
            <FormControl fullWidth>
              <InputLabel id="Agent">{t('Agent', { ns: 'common' })}</InputLabel>
              <Select
                labelId="Agent"
                name="Agent"
                id="Agent"
                value={
                  is_TaiGer_Student(user)
                    ? user.agents.length > 0
                      ? newReceiver
                      : ''
                    : ''
                }
                label={t('Agent', { ns: 'common' })}
                onChange={handleChangeReceiver}
              >
                {is_TaiGer_Student(user) && (
                  <MenuItem value={''}>Please Select</MenuItem>
                )}
                {is_TaiGer_Student(user) ? (
                  <MenuItem value={event.provider._id.toString()}>
                    {event.provider.firstname} {event.provider.lastname}
                  </MenuItem>
                ) : is_TaiGer_Agent(user) ? (
                  <MenuItem value={user._id.toString()}>
                    {user.firstname}
                    {user.lastname}
                  </MenuItem>
                ) : (
                  user.agents.map((agent, i) => (
                    <MenuItem value={agent._id.toString()} key={i}>
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
                From: {convertDate(start)} {NoonNightLabel(start)}{' '}
                {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
                {showTimezoneOffset()}
              </li>
              <li className="col text-secondary pb-0 mb-0">
                To: {convertDate(end)}{' '}
                {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
                {showTimezoneOffset()}
              </li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleBook}
              disabled={
                newDescription?.length === 0 ||
                newReceiver === '' ||
                BookButtonDisable
              }
              sx={{ mr: 2 }}
            >
              {BookButtonDisable ? <CircularProgress /> : t('Book')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleClose}
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
