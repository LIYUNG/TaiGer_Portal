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
  Select
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function GrantManagerModal(props) {
  const { t } = useTranslation();
  const [grantManagerModalState, setGrantManagerModalState] = useState({
    payload: {},
    changed: false
  });

  const onChange = (e) => {
    const { id, value } = e.target;
    setGrantManagerModalState((prevState) => ({
      payload: {
        ...prevState.payload,
        [id]: value
      },
      changed: true
    }));
  };

  const onSubmitHandler = (e) => {
    props.onUpdatePermissions(e, grantManagerModalState.payload);
  };

  return (
    <Dialog open={props.managerModalShow} onClose={props.setManagerModalHide}>
      <DialogTitle>
        Set {props.firstname} - {props.lastname} as Manager:
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id="select-manager-type">
            {t('Configure Manager Type')}
          </InputLabel>
          <Select
            labelId="manager_type"
            label="Select target group"
            name="manager_type"
            id="manager_type"
            onChange={onChange}
          >
            <MenuItem value="">Please Select</MenuItem>
            <MenuItem value="Agent">Agent Manager</MenuItem>
            <MenuItem value="Editor">Editor Manager</MenuItem>
            <MenuItem value="AgentAndEditor">
              Both Agent and Editor Manager
            </MenuItem>
          </Select>
        </FormControl>
        <br />
        configure agents
        <br />
        configure editors
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disabled={!grantManagerModalState.changed}
          onClick={(e) => onSubmitHandler(e)}
        >
          {t('Confirm', { ns: 'common' })}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={props.setManagerModalHide}
        >
          {t('Cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default GrantManagerModal;
