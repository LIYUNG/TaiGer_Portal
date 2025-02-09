import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
const GENERAL_FILTE_TYPE = [
    { name: 'Please Select', value: '' },
    { name: 'CV', value: 'CV' },
    { name: 'Recommendation Letter (A)', value: 'Recommendation_Letter_A' },
    { name: 'Recommendation Letter (B)', value: 'Recommendation_Letter_B' },
    { name: 'Recommendation Letter (C)', value: 'Recommendation_Letter_C' },
    { name: 'Form A', value: 'Form_A' },
    { name: 'Form B', value: 'Form_B' },
    { name: 'Others', value: 'Others' }
];
const PROGRAM_SPECIFIC_FILTE_TYPE = [
    { name: 'Please Select', value: '' },
    { name: 'ML', value: 'ML' },
    { name: 'Essay', value: 'Essay' },
    { name: 'Portfolio', value: 'Portfolio' },
    { name: 'Internship Form', value: 'Internship_Form' },
    { name: 'Supplementary Form', value: 'Supplementary_Form' },
    { name: 'Curriculum_Analysis', value: 'Curriculum_Analysis' },
    { name: 'Scholarship Form / ML', value: 'Scholarship_Form' },
    { name: 'RL (Referee A)', value: 'RL_A' },
    { name: 'RL (Referee B)', value: 'RL_B' },
    { name: 'RL (Referee C)', value: 'RL_C' },
    { name: 'Others', value: 'Others' }
];
const ToggleableUploadFileForm = (props) => {
    const { t } = useTranslation();

    const drop_list = (
        <FormControl fullWidth size="small">
            <InputLabel id="thread_category">
                {t('Category', { ns: 'common' })}
            </InputLabel>
            <Select
                id="thread_category"
                label={t('Category', { ns: 'common' })}
                labelId="thread_category"
                name="thread_category"
                onChange={(e) => props.handleSelect(e)}
                value={props.category}
            >
                {(props.filetype === 'General'
                    ? GENERAL_FILTE_TYPE
                    : PROGRAM_SPECIFIC_FILTE_TYPE
                ).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
                {drop_list}
            </Grid>
            <Grid item md={4} xs={12}>
                <Button
                    color="primary"
                    onClick={(e) =>
                        props.filetype === 'General'
                            ? props.handleCreateGeneralMessageThread(
                                  e,
                                  props.student._id,
                                  props.category
                              )
                            : props.handleCreateProgramSpecificMessageThread(
                                  e,
                                  props.student._id,
                                  props.application.programId._id,
                                  props.category
                              )
                    }
                    variant="contained"
                >
                    {t('Add Task', { ns: 'common' })}
                </Button>
            </Grid>
        </Grid>
    );
};

export default ToggleableUploadFileForm;
