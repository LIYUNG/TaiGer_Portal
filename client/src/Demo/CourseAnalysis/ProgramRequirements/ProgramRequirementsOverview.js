import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import React, { useState } from 'react';
import DEMO from '../../../store/constant';
import { useTranslation } from 'react-i18next';
import { deleteProgramRequirement } from '../../../api';

const ProgramRequirementsOverview = ({ programRequirements }) => {
  const { t } = useTranslation();
  const [programRequirementsState, setProgramRequirementsState] =
    useState(programRequirements);
  const [openRow, setOpenRow] = useState(null);

  const handleRowClick = (index) => {
    setOpenRow(openRow === index ? null : index); // Toggle open/close
  };

  const handleRequirementDelete = async (requirementId) => {
    const resp = await deleteProgramRequirement(requirementId);
    const { success } = resp.data;
    if (!success) {
      alert('Failed!');
    } else {
      setProgramRequirementsState(
        programRequirementsState.filter((r) => r._id !== requirementId)
      );
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 1 }}
      >
        <Typography variant="h6">
          {t('Program Analysis Collection', { ns: 'common' })}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            component={LinkDom}
            to={`${DEMO.KEYWORDS_EDIT}`}
            color="primary"
            sx={{ mr: 2 }}
          >
            {t('Edit Keywords', { ns: 'common' })}
          </Button>
          <Button
            variant="contained"
            component={LinkDom}
            to={`${DEMO.CREATE_NEW_PROGRAM_ANALYSIS}`}
            color="primary"
          >
            {t('Create New Analysis', { ns: 'common' })}
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="program table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>School</TableCell>
              <TableCell>Program Name</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>ML Required</TableCell>
              <TableCell>RL Required</TableCell>
              <TableCell>Essay Required</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programRequirementsState?.map((item, index) => (
              <React.Fragment key={item._id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(index)}
                    >
                      {openRow === index ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{item.programId[0].school}</TableCell>
                  <TableCell>{item.programId[0].program_name}</TableCell>
                  <TableCell>{item.programId[0].degree}</TableCell>
                  <TableCell>{item.programId[0].lang}</TableCell>
                  <TableCell>{item.programId[0].ml_required}</TableCell>
                  <TableCell>{item.programId[0].rl_required}</TableCell>
                  <TableCell>{item.programId[0].essay_required}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleRequirementDelete(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Collapsible row for program categories */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={8}
                  >
                    <Collapse
                      in={openRow === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={2}>
                        <Typography variant="h6" gutterBottom>
                          Program Categories
                        </Typography>
                        <Table size="small" aria-label="program categories">
                          <TableHead>
                            <TableRow>
                              <TableCell>Category Name</TableCell>
                              <TableCell>Required ECTS</TableCell>
                              <TableCell>Keywords (EN)</TableCell>
                              <TableCell>Keywords (ZH)</TableCell>
                              <TableCell>Anti-Keywords (EN)</TableCell>
                              <TableCell>Anti-Keywords (ZH)</TableCell>
                              <TableCell>Description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.program_categories.map((category) => (
                              <TableRow key={category._id}>
                                <TableCell>
                                  {category.program_category}
                                </TableCell>
                                <TableCell>{category.requiredECTS}</TableCell>
                                <TableCell>
                                  {category.keywordSets?.map((keywordSet) =>
                                    keywordSet.keywords.en.join(', ')
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets?.map((keywordSet) =>
                                    keywordSet.keywords.zh.join(', ')
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets?.map((keywordSet) =>
                                    keywordSet.antiKeywords.en.join(', ')
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets?.map((keywordSet) =>
                                    keywordSet.antiKeywords.zh.join(', ')
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets?.map(
                                    (keywordSet, i) => (
                                      <li key={i}>{keywordSet.description}</li>
                                    )
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProgramRequirementsOverview;
