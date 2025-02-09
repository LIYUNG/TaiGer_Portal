import React, { useState } from 'react';
import {
    Autocomplete,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTranslation } from 'react-i18next';
import { ATTRIBUTES } from '../../../../utils/contants';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EditAttributesSubpage = (props) => {
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
                disableCloseOnSelect
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                }
                multiple
                onChange={(e, newValue) => onAttributesChange(e, newValue)}
                options={ATTRIBUTES}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Attribute"
                        placeholder="Demanding"
                        variant="standard"
                    />
                )}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            checked={selected}
                            checkedIcon={checkedIcon}
                            icon={icon}
                            style={{ marginRight: 8 }}
                        />
                        {option.name}
                    </li>
                )}
                style={{ width: 500 }}
                value={checkboxState.updateAttributesList || []}
            />
        );
    };

    return (
        <Dialog
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onClose={props.onHide}
            open={props.show}
            size="large"
        >
            <DialogTitle>
                Attributes for {props.student.firstname} -{' '}
                {props.student.lastname} to
            </DialogTitle>
            <DialogContent>
                <AttributeInputSelection />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={(e) =>
                        props.submitUpdateAttributeslist(
                            e,
                            checkboxState.updateAttributesList,
                            props.student._id
                        )
                    }
                    variant="contained"
                >
                    {t('Update', { ns: 'common' })}
                </Button>
                <Button
                    color="secondary"
                    onClick={props.onHide}
                    variant="outlined"
                >
                    {t('Cancel', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditAttributesSubpage;
