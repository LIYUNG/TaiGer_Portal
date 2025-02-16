import React, { useState } from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTranslation } from 'react-i18next';
import { ATTRIBUTES } from '../../../../utils/contants';
import { ConfirmationModal } from '../../../../components/Modal/ConfirmationModal';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AttributeInputSelection = ({
    onAttributesChange,
    updateAttributesList
}) => {
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
            value={updateAttributesList || []}
        />
    );
};

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

    return (
        <ConfirmationModal
            closeText={t('Cancel', { ns: 'common' })}
            confirmText={t('Update', { ns: 'common' })}
            content={
                <AttributeInputSelection
                    onAttributesChange={onAttributesChange}
                    updateAttributesList={checkboxState.updateAttributesList}
                />
            }
            isLoading={props.isLoading}
            onClose={props.onHide}
            onConfirm={(e) =>
                props.submitUpdateAttributeslist(
                    e,
                    checkboxState.updateAttributesList,
                    props.student._id
                )
            }
            open={props.show}
            title={`Attributes for ${props.student.firstname} - ${props.student.lastname} to`}
        />
    );
};

export default EditAttributesSubpage;
