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
import React, { useState } from 'react';
// TODO
const ProgramRequirementsOverview = ({ programRequirements }) => {
  const [openRow, setOpenRow] = useState(null);

  const handleRowClick = (index) => {
    setOpenRow(openRow === index ? null : index); // Toggle open/close
  };
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {programRequirements?.map((requirement) => (
          <li
            key={requirement._id}
          >{`${requirement?.programId?.school} ${requirement?.programId?.program_name} ${requirement?.programId?.degree}`}</li>
        ))}
        <Button variant="contained" color="primary">
          Create New Analysis
        </Button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {programRequirements.map((item, index) => (
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
                  <TableCell>{item.programId.school}</TableCell>
                  <TableCell>{item.programId.program_name}</TableCell>
                  <TableCell>{item.programId.degree}</TableCell>
                  <TableCell>{item.programId.lang}</TableCell>
                  <TableCell>{item.programId.ml_required}</TableCell>
                  <TableCell>{item.programId.rl_required}</TableCell>
                  <TableCell>{item.programId.essay_required}</TableCell>
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
                                  {category.keywordSets[0]?.keywords.en.join(
                                    ', '
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets[0]?.keywords.zh.join(
                                    ', '
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets[0]?.antiKeywords.en.join(
                                    ', '
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets[0]?.antiKeywords.zh.join(
                                    ', '
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category.keywordSets[0]?.description}
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