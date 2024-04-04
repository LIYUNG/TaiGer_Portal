import React, { useState } from 'react';
import ModalNew from '../../../../components/Modal';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  TextField,
  Typography
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTranslation } from 'react-i18next';
import { ATTRIBUTES } from '../../../Utils/contants';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function EditAttributesSubpage(props) {
  const { t } = useTranslation();
  const [checkboxState, setCheckboxState] = useState({
    updateAttributesList: props.student.attributes
  });

  const onAttributesChange = (e, newValues) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      updateAttributesList: newValues
    }));
  };

  const AttributeInputSelection = () => {
    return (
      <Autocomplete
        multiple
        options={ATTRIBUTES}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        value={checkboxState.updateAttributesList || []}
        onChange={(e, newValue) => onAttributesChange(e, newValue)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Attribute"
            placeholder="Demanding"
          />
        )}
      />
    );
  };

  return (
    <ModalNew
      open={props.show}
      onClose={props.onHide}
      size="large"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h6">
        Attributes for {props.student.firstname} - {props.student.lastname} to
      </Typography>
      <AttributeInputSelection />
      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={(e) =>
            props.submitUpdateAttributeslist(
              e,
              checkboxState.updateAttributesList,
              props.student._id
            )
          }
          sx={{ mr: 2 }}
        >
          {t('Update', { ns: 'common' })}
        </Button>
        <Button color="secondary" variant="outlined" onClick={props.onHide}>
          {t('Cancel')}
        </Button>
      </Box>
    </ModalNew>
  );
}

export default EditAttributesSubpage;
