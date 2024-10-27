import React, { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  createFilterOptions,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DEMO from '../../../store/constant';

const ProgramRequirementsNew = ({ programsAndCourseKeywordSets }) => {
  const { t } = useTranslation();
  const [keywordSet, setKeywordSet] = useState();
  const [programCategories, setProgramCategories] = useState([]);
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
    console.log(newValue);
  };

  // Function to add a keyword set to a program category
  const handleAddKeywordSet = (newKeywordSet, index) => {
    setProgramCategories((prev) =>
      prev.map((programCategory, i) =>
        i === index
          ? {
              ...programCategory,
              keywordSets: [...programCategory.keywordSets, newKeywordSet]
            }
          : programCategory
      )
    );
  };

  // Function to delete a keyword set from a program category
  const handleDeleteCourseKeyword = (categoryIndex, keywordSetIndex) => {
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

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const inputObject = {
      programId: [''],
      program_categories: programCategories,
      fpso: ''
    };
    console.log(inputObject);
  };

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
                <TextField {...params} label="With categories" />
              )}
              size="small"
            />
            <TextField
              label="Add course keywords"
              variant="outlined"
              value={keywordSet}
              onChange={(e) => setKeywordSet(e.target.value)}
              fullWidth
              size="small"
            />
          </Box>
          <Box>
            {programCategories?.map((programCategory, index) => (
              <Card key={index} sx={{ p: 1, mb: 1 }}>
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
                              ? { ...pc, category_description: e.target.value }
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Autocomplete
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
                          <TextField {...params} label="With categories" />
                        )}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {programCategories?.keywordSets?.map((keywordSet, kIndex) => (
                    <Chip
                      key={kIndex}
                      label={keywordSet.categoryName}
                      onDelete={() => handleDeleteCourseKeyword(index, kIndex)}
                      color="secondary"
                    />
                  ))}
                </Box>
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
          <Button variant="outlined" color="secondary">
            {t('Cancel', { ns: 'common' })}
          </Button>
          <Button variant="contained" color="primary" type="submit">
            {t('Create', { ns: 'common' })}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default ProgramRequirementsNew;
