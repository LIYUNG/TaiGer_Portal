import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import DEMO from '../../../store/constant';
import { useTranslation } from 'react-i18next';

const ProgramRequirementsNew = ({ programsAndCourseKeywordSets }) => {
  const { t } = useTranslation();
  const [keywordSet, setKeywordSet] = useState();
  const [programCategories, setProgramCategories] = useState([]);
  const { distinctPrograms, keywordsets } = programsAndCourseKeywordSets;
  console.log(distinctPrograms);
  console.log(keywordsets);
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
  console.log(programsAndCourseKeywordSets);
  return (
    <>
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
          <TextField
            label="Add course keywords"
            variant="outlined"
            value={keywordSet}
            onChange={(e) => setKeywordSet(e.target.value)}
            fullWidth
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setKeywordSet('en')}
            sx={{ ml: 2 }}
            size="small"
          >
            + Add (EN)
          </Button>
        </Box>
        <Box>
          {programCategories?.map((programCategory, index) => (
            <Card key={index} sx={{ p: 1, mb: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div style={{ marginBottom: '16px' }}>
                    <Typography variant="body1">Category Name:</Typography>
                    <TextField
                      value={programCategory.program_category}
                      // onChange={(e) => handleCategoryNameAndDescription(e)}
                      variant="outlined"
                      fullWidth
                      id="categoryName"
                      size="small"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ marginBottom: '16px' }}>
                    <Typography variant="body1">Required ECTS Name:</Typography>
                    <TextField
                      value={programCategory.program_category}
                      // onChange={(e) => handleCategoryNameAndDescription(e)}
                      variant="outlined"
                      fullWidth
                      id="requiredECTS"
                      size="small"
                    />
                  </div>
                </Grid>
              </Grid>
              <div style={{ marginBottom: '16px' }}>
                <Typography variant="body1">Category Description:</Typography>
                <TextField
                  value={programCategory.program_category}
                  onChange={(e) => handleAddCategory(e)}
                  variant="outlined"
                  fullWidth
                  id="category_description"
                  size="small"
                />
              </div>
              <Typography variant="body1">
                {t('Add Keyword Set', { ns: 'common' })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add course anti-keyword here..."
                  variant="outlined"
                  // value={antiKeywordsZH}
                  // onChange={(e) => setAntiKeywordsZH(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={() =>
                  //   handleAddCourseAntiKeyword('zh', antiKeywordsZH)
                  // }
                  sx={{ ml: 2 }}
                  size="small"
                >
                  + Add (ZH)
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {programCategories?.keywordSets?.map((keywordSet, index) => (
                  <Chip
                    key={index}
                    label={keywordSet.categoryName}
                    // onDelete={() =>
                    //   handleDeleteCourseKeyword('zh', 'antiKeywords', keyword)
                    // }
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
        <Button variant="contained" color="primary">
          {t('Create', { ns: 'common' })}
        </Button>
      </Box>
    </>
  );
};

export default ProgramRequirementsNew;
