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
import { getEditors } from '../../../../api';

function EditEditorsSubpage(props) {
  const [checkboxState, setCheckboxState] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize the state with checked checkboxes based on the student's editors
    getEditors().then(
      (resp) => {
        // TODO: check success
        const { data, success } = resp.data;
        if (success) {
          const editors = data; //get all editors
          const { editors: student_editors } = props.student;
          const updateEditorList = editors.reduce(
            (prev, { _id }) => ({
              ...prev,
              [_id]: student_editors
                ? student_editors.findIndex(
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
  }, [props.student.editors]);

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
            Editor for {props.student.firstname} - {props.student.lastname}
          </Typography>
          <Typography variant="h6">{t('Editor')}: </Typography>
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
                    <Typography variant="h6">{t('No Editor')}</Typography>
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
                props.student._id
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
export default EditEditorsSubpage;
