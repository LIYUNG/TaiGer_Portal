import React, { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import ModalNew from '../../components/Modal';
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
    <ModalNew
      open={props.managerModalShow}
      onClose={props.setManagerModalHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography>
        Set {props.firstname} - {props.lastname} as Manager:
      </Typography>
      <Typography>
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
      </Typography>
      <Typography>
        <Button
          color="primary"
          variant="contained"
          disabled={!grantManagerModalState.changed}
          onClick={(e) => onSubmitHandler(e)}
        >
          {t('Confirm')}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={props.setManagerModalHide}
        >
          {t('Cancel')}
        </Button>
      </Typography>
    </ModalNew>
  );
}
export default GrantManagerModal;
