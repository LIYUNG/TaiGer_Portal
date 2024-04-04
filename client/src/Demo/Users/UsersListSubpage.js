import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';

import ModalNew from '../../components/Modal';
import { useTranslation } from 'react-i18next';

function UsersListSubpage(props) {
  const { t } = useTranslation();
  let user_roles = ['Student', 'Editor', 'Agent'];
  return (
    <ModalNew open={props.show} onClose={props.setModalHide} centered>
      <Typography variant="h6">
        Assign {props.firstname} - {props.lastname} as
      </Typography>
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

      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={(e) => props.onSubmit2(e)}
          sx={{ mr: 2 }}
        >
          {t('Assign', { ns: 'common' })}
        </Button>
        <Button color="primary" variant="outlined" onClick={props.setModalHide}>
          {t('Cancel')}
        </Button>
      </Box>
    </ModalNew>
  );
}
export default UsersListSubpage;
