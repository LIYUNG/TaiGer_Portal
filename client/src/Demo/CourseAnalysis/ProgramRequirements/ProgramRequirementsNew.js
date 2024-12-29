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
  // PROGRAM_ANALYSIS_ATTRIBUTES,
  PROGRAM_SUBJECTS_DETAILED,
  SCORES_TYPE
} from '../../Utils/contants';
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
  const [scores, setScores] = useState({
    gpaScore: requirement?.gpaScore || 0,
    cvScore: requirement?.cvScore || 0,
    mlScore: requirement?.mlScore || 0,
    rlScore: requirement?.rlScore || 0,
    essayScore: requirement?.essayScore || 0,
    directRejectionScore: requirement?.directRejectionScore || 0,
    directAdmissionScore: requirement?.directAdmissionScore || 0
  });

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
    updateAttributesList: requirement?.attributes || []
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
      program_categories: programCategories?.map(
        (programCategory) => programCategory
      ),
      fpso: ''
    };
    try {
      if (requirementId) {
        const resp = await putProgramRequirement(requirementId, inputObject);
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
    <>
      <form onSubmit={onSubmitHandler}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ my: 1 }}
        >
          <Typography variant="h6">
            {requirementId
              ? t('Update program analysis', { ns: 'common' })
              : t('Create new program analysis', { ns: 'common' })}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              component={LinkDom}
              to={`${DEMO.KEYWORDS_EDIT}`}
              color="primary"
              target="_blank"
              sx={{ mr: 2 }}
            >
              {t('Edit Keywords', { ns: 'common' })}
            </Button>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Autocomplete
              label={t('Add Keyword Set', { ns: 'common' })}
              value={program}
              disabled={requirementId ? true : false}
              variant="outlined"
              options={distinctPrograms || []}
              getOptionLabel={(option) =>
                `${option.school} ${option.program_name} ${option.degree}`
              }
              onChange={(e, newValue) => handleAddProgram(newValue)} // `newValue` will be the selected object
              filterOptions={filterOptions}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Program" />
              )}
              size="small"
            />
          </Box>
          <Box>
            <SearchableMultiSelect
              name="updateAttributesList"
              label={null}
              data={PROGRAM_SUBJECTS_DETAILED}
              value={checkboxState?.updateAttributesList}
              setValue={handleChangeByField('updateAttributesList')}
              sx={{ mb: 2 }}
            />
          </Box>
          <Box>
            <Grid container spacing={2}>
              {SCORES_TYPE.map((score) => (
                <Grid item xs={6} md={4} key={score.label}>
                  <TextField
                    label={score.label}
                    name={score.name}
                    type="number"
                    value={scores[score.name]}
                    onChange={(e) => handleScores(e)}
                    helperText={score.description}
                    variant="outlined"
                    fullWidth
                    id="categoryName"
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box>
            {programCategories?.map((programCategory, index) => (
              <Card key={index} sx={{ p: 1, mb: 1 }}>
                <CardHeader
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={() => handleDeleteCategory(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Category Name"
                        value={programCategory.program_category}
                        onChange={(e) =>
                          setProgramCategories((prev) =>
                            prev.map((pc, i) =>
                              i === index
                                ? { ...pc, program_category: e.target.value }
                                : pc
                            )
                          )
                        }
                        error={programCategory.program_category === ''}
                        helperText={
                          programCategory.program_category === '' &&
                          'Please name the course category specified by the program'
                        }
                        variant="outlined"
                        fullWidth
                        id="categoryName"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Required ECTS"
                        type="number"
                        value={programCategory.requiredECTS}
                        onChange={(e) =>
                          setProgramCategories((prev) =>
                            prev.map((pc, i) =>
                              i === index
                                ? { ...pc, requiredECTS: e.target.value }
                                : pc
                            )
                          )
                        }
                        error={programCategory.requiredECTS <= 0}
                        helperText={
                          programCategory.requiredECTS <= 0 &&
                          'ECTS should more than 0'
                        }
                        variant="outlined"
                        fullWidth
                        id="requiredECTS"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Points (if applicable)"
                        value={programCategory.maxScore}
                        onChange={(e) =>
                          setProgramCategories((prev) =>
                            prev.map((pc, i) =>
                              i === index
                                ? { ...pc, maxScore: e.target.value }
                                : pc
                            )
                          )
                        }
                        type="number"
                        // error={programCategory.maxScore === 0}
                        helperText={
                          'Max. score for this category. (if programs publish entry requirement score like TUM)'
                        }
                        variant="outlined"
                        fullWidth
                        id="categoryName"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        label="Category Description"
                        value={programCategory.category_description}
                        onChange={(e) =>
                          setProgramCategories((prev) =>
                            prev.map((pc, i) =>
                              i === index
                                ? {
                                    ...pc,
                                    category_description: e.target.value
                                  }
                                : pc
                            )
                          )
                        }
                        variant="outlined"
                        fullWidth
                        id="category_description"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <Autocomplete
                          multiple
                          variant="outlined"
                          value={programCategory.keywordSets}
                          getOptionLabel={(option) =>
                            `${option.categoryName} ${option.keywords?.zh?.join(
                              ', '
                            )} ${option.keywords?.en?.join(', ')} `
                          }
                          options={keywordsets || []}
                          disableCloseOnSelect
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onChange={(e, newValue) =>
                            handleAddKeywordSet(newValue, index)
                          }
                          filterOptions={filterKeywordOptions}
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={
                                programCategories[index]?.keywordSets?.length <=
                                0
                              }
                              helperText={
                                programCategories[index]?.keywordSets?.length <=
                                  0 && 'Please provide at least 1 keyword set'
                              }
                              label="With categories"
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, optionIndex) => {
                              const { _id, ...tagProps } = getTagProps({
                                index: optionIndex
                              });
                              return (
                                <Chip
                                  key={_id}
                                  variant="outlined"
                                  label={option.categoryName}
                                  {...tagProps}
                                />
                              );
                            })
                          }
                          size="small"
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
            variant="contained"
            color="secondary"
            onClick={handleAddCategory}
          >
            {t('Add Category', { ns: 'common' })}
          </Button>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            color="secondary"
            as={LinkDom}
            to={DEMO.PROGRAM_ANALYSIS}
          >
            {t('Cancel', { ns: 'common' })}
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitDisabled}
          >
            {requirementId
              ? t('Update', { ns: 'common' })
              : t('Create', { ns: 'common' })}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default ProgramRequirementsNew;
