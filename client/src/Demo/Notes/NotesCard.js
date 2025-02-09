import React, { useEffect, useState } from 'react';

import NotesEditor from './NotesEditor';
import { updateStudentNotes } from '../../api';

const NotesCard = (props) => {
    const [notesCardState, setNotesCardState] = useState({
        editorState: props.notes,
        isLoaded: false,
        buttonDisabled: true
    });

    useEffect(() => {
        setNotesCardState((prevState) => ({
            ...prevState,
            isLoaded: props.isLoaded
        }));
    }, []);

    const handleEditorChange = (content) => {
        setNotesCardState((state) => ({
            ...state,
            editorState: content,
            buttonDisabled: false
        }));
    };

    const handleClickSave = (e, editorState) => {
        e.preventDefault();
        setNotesCardState((prevState) => ({
            ...prevState,
            buttonDisabled: true
        }));
        var notes = JSON.stringify(editorState);

        updateStudentNotes(props.student_id, notes).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setNotesCardState((prevState) => ({
                        ...prevState,
                        success,
                        file: null,
                        thread: data,
                        isLoaded: true,
                        buttonDisabled: true,
                        res_modal_status: status
                    }));
                } else {
                    // TODO: what if data is oversize? data type not match?
                    const { message } = resp.data;
                    setNotesCardState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        buttonDisabled: false,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setNotesCardState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
        setNotesCardState((prevState) => ({
            ...prevState,
            in_edit_mode: false
        }));
    };

    return (
        <NotesEditor
            buttonDisabled={notesCardState.buttonDisabled}
            editorState={notesCardState.editorState}
            handleClickSave={handleClickSave}
            handleEditorChange={handleEditorChange}
            notes_id={`notes-${props.student_id}`}
            thread={notesCardState.thread}
            unique_id={props.student_id}
        />
    );
};

export default NotesCard;
