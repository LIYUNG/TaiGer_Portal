import React, { useEffect, useState } from 'react';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import { Card } from '@mui/material';

const DocPageEdit = (props) => {
    const [docPageEditState, setDocPageEditState] = useState({
        doc_title: props.document_title
    });

    useEffect(() => {
        setDocPageEditState((prevState) => ({
            ...prevState,
            doc_title: props.document_title
        }));
    }, []);

    const handleClickSave = (e, editorState) => {
        e.preventDefault();
        props.handleClickSave(e, docPageEditState.doc_title, editorState);
    };
    return (
        <Card sx={{ px: 8, py: 2, mt: 2 }}>
            <DocumentsListItemsEditor
                category={props.category}
                doc_title="not_used"
                editorState={props.editorState}
                handleClickEditToggle={props.handleClickEditToggle}
                handleClickSave={handleClickSave}
            />
        </Card>
    );
};
export default DocPageEdit;
