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
import { FILE_TYPE_E } from '../../../Utils/checking-functions';

function EditEssayWritersSubpage(props) {
  const [checkboxState, setCheckboxState] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize the state with checked checkboxes based on the student's editors
    if (
      [FILE_TYPE_E.essay_required].includes(props.essayDocumentThread.file_type)
    ) {
      getEssayWriters().then(
        (resp) => {
          // TODO: check success
          const { data, success } = resp.data;
          if (success) {
            const editors = data; //need to change to get all essay writers
            const { outsourced_user_id: student_essay_writers } =
              props.essayDocumentThread;
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
    } else {
      // Add select editor list
      //  setCheckboxState({ editors, updateEditorList });
      const editors = props.editors; //need to change to get all essay writers
      const { outsourced_user_id: student_editor } =
        props.essayDocumentThread;
      const updateEditorList = editors?.reduce(
        (prev, { _id }) => ({
          ...prev,
          [_id]: student_editor
            ? student_editor.findIndex(
                (student_agent) => student_agent._id === _id
              ) > -1
            : false
        }),
        {}
      );
      setCheckboxState({ editors, updateEditorList });
      setIsLoaded(true);
    }
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
            {props.actor} for {props.essayDocumentThread.file_type}-
            {props.essayDocumentThread.program_id?.school}-
            {props.essayDocumentThread.program_id?.program_name}
            {props.essayDocumentThread.program_id?.degree}
            {props.essayDocumentThread.program_id?.semester}
            {props.essayDocumentThread.student_id?.firstname}
            {props.essayDocumentThread.student_id?.lastname}
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
            disabled={
              !checkboxState.updateEditorList ||
              checkboxState.updateEditorList?.length === 0
            }
            onClick={(e) =>
              props.submitUpdateEssayWriterlist(
                e,
                checkboxState.updateEditorList,
                props.essayDocumentThread._id
              )
            }
          >
            {t('Update', { ns: 'common' })}
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
