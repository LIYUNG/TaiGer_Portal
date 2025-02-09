import React, { useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    createFilterOptions,
    Grid,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import { Link as LinkDom, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

import DEMO from '../../../store/constant';
import { postProgramRequirements, putProgramRequirement } from '../../../api';
import {
    ADMISSION_DESCRIPTION,
    CONSIDRED_SCORES_DETAILED,
    FPSO,
    // PROGRAM_ANALYSIS_ATTRIBUTES,
    PROGRAM_SUBJECTS_DETAILED,
    SCORES_TYPE
} from '../../../utils/contants';
import SearchableMultiSelect from '../../../components/Input/searchableMuliselect';

const ProgramRequirementsNew = ({ programsAndCourseKeywordSets }) => {
    const { requirementId } = useParams();
    const { t } = useTranslation();
    const { distinctPrograms, keywordsets, requirement } =
        programsAndCourseKeywordSets;
    const [programCategories, setProgramCategories] = useState(
        requirement?.program_categories ?? []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fpso, setFpso] = useState(requirement?.fpso || '');
    const [admissionDescription, setAdmissionDescription] = useState(
        requirement?.admissionDescription || ''
    );
    const [scores, setScores] = useState(() =>
        Object.fromEntries(
            SCORES_TYPE.map(({ name }) => [name, requirement?.[name] || 0])
        )
    );

    const [program, setProgram] = useState(
        requirement?.programId[0]
            ? {
                  school: requirement.programId[0].school,
                  program_name: requirement.programId[0].program_name,
                  degree: requirement.programId[0].degree
              }
            : {}
    );
    const [checkboxState, setCheckboxState] = useState({
        updateAttributesList: requirement?.attributes || [],
        firstRoundConsidered: requirement?.firstRoundConsidered || [],
        secondRoundConsidered: requirement?.secondRoundConsidered || []
    });

    const navigate = useNavigate();
    const handleScores = (e) => {
        setScores((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };
    const handleChangeByField = (field) => (value) => {
        setCheckboxState((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleAddCategory = () => {
        setProgramCategories([
            ...programCategories,
            {
                program_category: '',
                category_description: '',
                requiredECTS: 0,
                keywordSets: [],
                maxScore: 0
            }
        ]);
    };

    const handleAddProgram = (newValue) => {
        if (newValue === null) {
            setProgram({}); // Clear the program state
        } else {
            setProgram(newValue); // Set to the selected program
        }
    };

    // Function to add a keyword set to a program category
    const handleAddKeywordSet = (newKeywordSet, index) => {
        setProgramCategories((prev) =>
            prev.map((programCategory, i) =>
                i === index
                    ? {
                          ...programCategory,
                          keywordSets: newKeywordSet
                      }
                    : programCategory
            )
        );
    };

    const filterOptions = createFilterOptions({
        stringify: (option) =>
            `${option.school} ${option.program_name} ${option.degree}`
    });

    const filterKeywordOptions = createFilterOptions({
        stringify: (option) =>
            `${option.categoryName} ${option.keywords?.zh?.join(
                ', '
            )} ${option.keywords?.en?.join(', ')}`
    });

    const handleDeleteCategory = (indexToDelete) => {
        setProgramCategories((prev) =>
            prev.filter((_, index) => index !== indexToDelete)
        );
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const inputObject = {
            ...scores,
            program: program,
            attributes: checkboxState.updateAttributesList,
            firstRoundConsidered: checkboxState.firstRoundConsidered,
            secondRoundConsidered: checkboxState.secondRoundConsidered,
            program_categories: programCategories?.map(
                (programCategory) => programCategory
            ),
            fpso: fpso,
            admissionDescription: admissionDescription
        };
        try {
            if (requirementId) {
                const resp = await putProgramRequirement(
                    requirementId,
                    inputObject
                );
                const { success } = resp.data;
                if (!success) {
                    setIsSubmitting(false);
                    alert(`Creation Failed: ${resp.data.message}`);
                } else {
                    navigate(DEMO.PROGRAM_ANALYSIS);
                }
            } else {
                const resp = await postProgramRequirements(inputObject);
                const { success } = resp.data;
                if (!success) {
                    setIsSubmitting(false);
                    alert(`Creation Failed: ${resp.data.message}`);
                } else {
                    navigate(DEMO.PROGRAM_ANALYSIS);
                }
            }
        } catch (e) {
            alert(`Creation Failed: server issue`);
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled =
        isSubmitting ||
        programCategories?.length === 0 ||
        programCategories.some(
            (category) =>
                category.program_category.trim() === '' || // Check if program_category is not an empty string
                category.requiredECTS <= 0 || // Check if requiredECTS is greater than 0
                category.keywordSets.length === 0 // Ensure at least one keyword set is added
        ) ||
        JSON.stringify(program) === '{}';

    return (
        <form onSubmit={onSubmitHandler}>
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                sx={{ my: 1 }}
            >
                <Typography variant="h6">
                    {requirementId
                        ? t('Update program analysis', { ns: 'common' })
                        : t('Create new program analysis', {
                              ns: 'common'
                          })}
                </Typography>
                <Box>
                    <Button
                        color="primary"
                        component={LinkDom}
                        sx={{ mr: 2 }}
                        target="_blank"
                        to={`${DEMO.KEYWORDS_EDIT}`}
                        variant="outlined"
                    >
                        {t('Edit Keywords', { ns: 'common' })}
                    </Button>
                </Box>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Autocomplete
                        disabled={requirementId ? true : false}
                        filterOptions={filterOptions}
                        fullWidth
                        getOptionLabel={(option) =>
                            `${option.school} ${option.program_name} ${option.degree}`
                        }
                        label={t('Add Keyword Set', { ns: 'common' })}
                        onChange={(e, newValue) => handleAddProgram(newValue)} // `newValue` will be the selected object
                        options={distinctPrograms || []}
                        renderInput={(params) => (
                            <TextField {...params} label="Program" />
                        )}
                        size="small"
                        value={program}
                        variant="outlined"
                    />
                </Box>
                <Box>
                    <SearchableMultiSelect
                        data={PROGRAM_SUBJECTS_DETAILED}
                        label="Category"
                        name="updateAttributesList"
                        setValue={handleChangeByField('updateAttributesList')}
                        size="small"
                        sx={{ mb: 2 }}
                        value={checkboxState?.updateAttributesList}
                    />
                </Box>
                <Box>
                    <SearchableMultiSelect
                        data={CONSIDRED_SCORES_DETAILED}
                        label="First Round Considered"
                        name="firstRoundConsidered"
                        setValue={handleChangeByField('firstRoundConsidered')}
                        size="small"
                        sx={{ mb: 2 }}
                        value={checkboxState?.firstRoundConsidered}
                    />
                </Box>
                <Box>
                    <SearchableMultiSelect
                        data={CONSIDRED_SCORES_DETAILED}
                        label="Second Round Considered"
                        name="secondRoundConsidered"
                        setValue={handleChangeByField('secondRoundConsidered')}
                        size="small"
                        sx={{ mb: 2 }}
                        value={checkboxState?.secondRoundConsidered}
                    />
                </Box>
                <Box>
                    <Grid container spacing={2}>
                        {SCORES_TYPE.map((score) => (
                            <Grid item key={score.name} md={4} xs={6}>
                                <TextField
                                    fullWidth
                                    helperText={score.description}
                                    id="categoryName"
                                    label={score.label}
                                    name={score.name}
                                    onChange={(e) => handleScores(e)}
                                    size="small"
                                    type="number"
                                    value={scores[score.name]}
                                    variant="outlined"
                                />
                            </Grid>
                        ))}
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                helperText={FPSO.description}
                                label={FPSO.label}
                                name={FPSO.name}
                                onChange={(e) => setFpso(e.target.value)}
                                size="small"
                                value={fpso}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                helperText={ADMISSION_DESCRIPTION.description}
                                label={ADMISSION_DESCRIPTION.label}
                                minRows={3}
                                multiline
                                name={ADMISSION_DESCRIPTION.name}
                                onChange={(e) =>
                                    setAdmissionDescription(e.target.value)
                                }
                                size="small"
                                value={admissionDescription}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    {programCategories?.map((programCategory, index) => (
                        <Card key={index} sx={{ p: 1, mb: 1 }}>
                            <CardHeader
                                action={
                                    <IconButton
                                        aria-label="settings"
                                        onClick={() =>
                                            handleDeleteCategory(index)
                                        }
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12}>
                                        <TextField
                                            error={
                                                programCategory.program_category ===
                                                ''
                                            }
                                            fullWidth
                                            helperText={
                                                programCategory.program_category ===
                                                ''
                                                    ? 'Please name the course category specified by the program'
                                                    : null
                                            }
                                            id="categoryName"
                                            label="Category Name"
                                            onChange={(e) =>
                                                setProgramCategories((prev) =>
                                                    prev.map((pc, i) =>
                                                        i === index
                                                            ? {
                                                                  ...pc,
                                                                  program_category:
                                                                      e.target
                                                                          .value
                                                              }
                                                            : pc
                                                    )
                                                )
                                            }
                                            size="small"
                                            value={
                                                programCategory.program_category
                                            }
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <TextField
                                            error={
                                                programCategory.requiredECTS <=
                                                0
                                            }
                                            fullWidth
                                            helperText={
                                                programCategory.requiredECTS <=
                                                0
                                                    ? 'ECTS should more than 0'
                                                    : null
                                            }
                                            id="requiredECTS"
                                            label="Required ECTS"
                                            onChange={(e) =>
                                                setProgramCategories((prev) =>
                                                    prev.map((pc, i) =>
                                                        i === index
                                                            ? {
                                                                  ...pc,
                                                                  requiredECTS:
                                                                      e.target
                                                                          .value
                                                              }
                                                            : pc
                                                    )
                                                )
                                            }
                                            size="small"
                                            type="number"
                                            value={programCategory.requiredECTS}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <TextField
                                            fullWidth
                                            helperText="Max. score for this category. (if programs publish entry requirement score like TUM)"
                                            id="categoryName"
                                            label="Points (if applicable)"
                                            onChange={(e) =>
                                                setProgramCategories((prev) =>
                                                    prev.map((pc, i) =>
                                                        i === index
                                                            ? {
                                                                  ...pc,
                                                                  maxScore:
                                                                      e.target
                                                                          .value
                                                              }
                                                            : pc
                                                    )
                                                )
                                            }
                                            size="small"
                                            type="number"
                                            value={programCategory.maxScore}
                                            variant="outlined"
                                            // error={programCategory.maxScore === 0}
                                        />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            id="category_description"
                                            label="Category Description"
                                            onChange={(e) =>
                                                setProgramCategories((prev) =>
                                                    prev.map((pc, i) =>
                                                        i === index
                                                            ? {
                                                                  ...pc,
                                                                  category_description:
                                                                      e.target
                                                                          .value
                                                              }
                                                            : pc
                                                    )
                                                )
                                            }
                                            size="small"
                                            value={
                                                programCategory.category_description
                                            }
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2
                                            }}
                                        >
                                            <Autocomplete
                                                disableCloseOnSelect
                                                filterOptions={
                                                    filterKeywordOptions
                                                }
                                                fullWidth
                                                getOptionLabel={(option) =>
                                                    `${option.categoryName} ${option.keywords?.zh?.join(
                                                        ', '
                                                    )} ${option.keywords?.en?.join(', ')} `
                                                }
                                                isOptionEqualToValue={(
                                                    option,
                                                    value
                                                ) => option._id === value._id}
                                                multiple
                                                onChange={(e, newValue) =>
                                                    handleAddKeywordSet(
                                                        newValue,
                                                        index
                                                    )
                                                }
                                                options={keywordsets || []}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        error={
                                                            programCategories[
                                                                index
                                                            ]?.keywordSets
                                                                ?.length <= 0
                                                        }
                                                        helperText={
                                                            programCategories[
                                                                index
                                                            ]?.keywordSets
                                                                ?.length <= 0
                                                                ? 'Please provide at least 1 keyword set'
                                                                : null
                                                        }
                                                        label="With categories"
                                                    />
                                                )}
                                                renderTags={(
                                                    value,
                                                    getTagProps
                                                ) =>
                                                    value.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => {
                                                            const {
                                                                _id,
                                                                ...tagProps
                                                            } = getTagProps({
                                                                index: optionIndex
                                                            });
                                                            return (
                                                                <Chip
                                                                    key={_id}
                                                                    label={
                                                                        option.categoryName
                                                                    }
                                                                    variant="outlined"
                                                                    {...tagProps}
                                                                />
                                                            );
                                                        }
                                                    )
                                                }
                                                size="small"
                                                value={
                                                    programCategory.keywordSets
                                                }
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
            <Box>
                <Button
                    color="secondary"
                    onClick={handleAddCategory}
                    variant="contained"
                >
                    {t('Add Category', { ns: 'common' })}
                </Button>
            </Box>
            <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                    as={LinkDom}
                    color="secondary"
                    to={DEMO.PROGRAM_ANALYSIS}
                    variant="outlined"
                >
                    {t('Cancel', { ns: 'common' })}
                </Button>
                <Button
                    color="primary"
                    disabled={isSubmitDisabled}
                    type="submit"
                    variant="contained"
                >
                    {requirementId
                        ? t('Update', { ns: 'common' })
                        : t('Create', { ns: 'common' })}
                </Button>
            </Box>
        </form>
    );
};

export default ProgramRequirementsNew;
