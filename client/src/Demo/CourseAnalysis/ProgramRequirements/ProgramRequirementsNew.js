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
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

import DEMO from '../../../store/constant';
import { postProgramRequirements } from '../../../api';

const ProgramRequirementsNew = ({ programsAndCourseKeywordSets }) => {
  const { t } = useTranslation();
  const [programCategories, setProgramCategories] = useState([]);
  const [program, setProgram] = useState({});
  const { distinctPrograms, keywordsets } = programsAndCourseKeywordSets;

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

  // Function to delete a keyword set from a program category
  const handleDeleteCourseKeyword = (categoryIndex, keywordSetIndex) => {
    console.log(categoryIndex, keywordSetIndex);
    setProgramCategories((prev) =>
      prev.map((programCategory, i) =>
        i === categoryIndex
          ? {
              ...programCategory,
              keywordSets: programCategory.keywordSets.filter(
                (_, kIndex) => kIndex !== keywordSetIndex
              )
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
    console.log(programCategories);
    const inputObject = {
      program: program,
      program_categories: programCategories?.map(
        (programCategory) => programCategory
      ),
      fpso: ''
    };
    const resp = await postProgramRequirements(inputObject);
    const { success } = resp.data;
    if (!success) {
      alert('Failed');
    }
    console.log(inputObject);
  };

  console.log(programCategories?.length === 0);
  console.log(
    programCategories.some(
      (category) =>
        category.program_category.trim() === '' || // Check if program_category is not an empty string
        category.requiredECTS <= 0 || // Check if requiredECTS is greater than 0
        category.keywordSets.length === 0 // Ensure at least one keyword set is added
    )
  );
  console.log(JSON.stringify(program) === '{}');
  const isSubmitDisabled =
    programCategories?.length === 0 ||
    programCategories.some(
      (category) =>
        category.program_category.trim() === '' || // Check if program_category is not an empty string
        category.requiredECTS <= 0 || // Check if requiredECTS is greater than 0
        category.keywordSets.length === 0 // Ensure at least one keyword set is added
    ) ||
    JSON.stringify(program) === '{}';
  console.log(isSubmitDisabled);

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
            {t('Create new program analysis', { ns: 'common' })}
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
                    <Grid item xs={12} md={8}>
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
                          label={t('Add Keyword Set', { ns: 'common' })}
                          variant="outlined"
                          getOptionLabel={(option) =>
                            `${option.categoryName} ${option.keywords?.zh?.join(
                              ', '
                            )} ${option.keywords?.en?.join(', ')} `
                          }
                          options={keywordsets || []}
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
                            value.map((option, index3) => {
                              const { key, ...tagProps } = getTagProps({
                                index3
                              });
                              return (
                                <Chip
                                  key={key}
                                  variant="outlined"
                                  label={option.categoryName}
                                  onDelete={() =>
                                    handleDeleteCourseKeyword(index, index3)
                                  }
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
            {t('Create', { ns: 'common' })}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default ProgramRequirementsNew;
