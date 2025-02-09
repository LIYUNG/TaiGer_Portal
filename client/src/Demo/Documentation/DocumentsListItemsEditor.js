import React from 'react';

import EditorNew from '../../components/EditorJs/EditorNew';

const DocumentsListItemsEditor = (props) => {
    return (
        <EditorNew
            category={props.category}
            doc_title={props.doc_title}
            editorState={props.editorState}
            handleClickEditToggle={props.handleClickEditToggle}
            handleClickSave={props.handleClickSave}
            readOnly={false}
        />
    );
};

export default DocumentsListItemsEditor;
