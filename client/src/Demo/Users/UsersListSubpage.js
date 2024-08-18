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

function UsersListSubpage(props) {
  const { t } = useTranslation();
  const user_roles = ['Student', 'Editor', 'Agent'];
  return (
    <Dialog open={props.show} onClose={props.setModalHide} centered>
      <DialogTitle>
        Assign {props.firstname} - {props.lastname} as
      </DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={props.selected_user_role}
            onChange={props.handleChange2}
          >
            {user_roles.map((role, i) => (
              <FormControlLabel
                key={i + 1}
                control={<Radio />}
                value={role}
                label={role}
                onChange={props.handleChange2}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={(e) => props.onSubmit2(e)}
          sx={{ mr: 2 }}
        >
          {t('Assign', { ns: 'common' })}
        </Button>
        <Button color="primary" variant="outlined" onClick={props.setModalHide}>
          {t('Cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default UsersListSubpage;
