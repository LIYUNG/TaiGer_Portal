import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../../../components/Modal';
import { getEssayWriters } from '../../../../api';

function EditEssayWritersSubpage(props) {
  const [checkboxState, setCheckboxState] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();

  // console.log("essayDocumentThread in subpage:", props.essayDocumentThread)//undefined
  useEffect(() => {
    // Initialize the state with checked checkboxes based on the student's editors
    getEssayWriters().then(
      (resp) => {
        // TODO: check success
        const { data, success } = resp.data;
        console.log("if success:", success)
        if (success) {
          const editors = data; //need to change to get all essay writers
          const { outsourced_user_id: student_essay_writers } = props.essayDocumentThread;
          const updateEditorList = editors.reduce(
            (prev, { _id }) => ({
              ...prev,
              [_id]: student_essay_writers
                ? student_essay_writers.findIndex(
                    (student_agent) => student_agent._id === _id
                  ) > -1
                : false
            }),
            {}
          );
          setCheckboxState({ editors, updateEditorList });
          setIsLoaded(true);
        } else {
          setIsLoaded(true);
        }
      },
      () => {
        setIsLoaded(true);
      }
    );
  }, [props.essayDocumentThread.outsourced_user_id]);

  const handleChangeEditorlist = (e) => {
    const { value } = e.target;
    setCheckboxState((prevState) => ({
      ...prevState,
      updateEditorList: {
        ...prevState.updateEditorList,
        [value]: !prevState.updateEditorList[value]
      }
    }));
  };

  return (
    <ModalNew
      open={props.show}
      onClose={props.onHide}
      size="large"
      aria-labelledby="contained-modal-title-vcenter"
    >
      {isLoaded ? (
        <>
          <Typography variant="h6">
            {/* Essay Writer for {props.student.firstname} - {props.student.lastname} */}
            Essay Writer for {props.essayDocumentThread._id}
          </Typography>
          <Typography variant="h6">{t('Essay Writer')}: </Typography>
          <Table size="small">
            <TableBody>
              {checkboxState.editors ? (
                checkboxState.editors.map((editor, i) => (
                  <TableRow key={i + 1}>
                    <TableCell>
                      <FormControlLabel
                        label={`${editor.lastname} ${editor.firstname}`}
                        control={
                          <Checkbox
                            checked={
                              checkboxState?.updateEditorList[editor._id] ||
                              false
                            }
                            onChange={(e) => handleChangeEditorlist(e)}
                            value={editor._id}
                          />
                        }
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">{t('No Essay Writer')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button
            color="primary"
            variant="contained"
            onClick={(e) =>
              props.submitUpdateEditorlist(
                e,
                checkboxState.updateEditorList,
                props.essayDocumentThread._id
              )
            }
          >
            {t('Update')}
          </Button>
          <Button variant="outlined" onClick={props.onHide}>
            {t('Cancel')}
          </Button>
        </>
      ) : (
        <CircularProgress size={24} />
      )}
    </ModalNew>
  );
}
export default EditEssayWritersSubpage;
