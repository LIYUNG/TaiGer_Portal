import React from 'react';

import EditorNew from '../../components/EditorJs/EditorNew';

function DocumentsListItemsEditor(props) {
  return (
    <EditorNew
      category={props.category}
      doc_title={props.doc_title}
      readOnly={false}
      handleClickSave={props.handleClickSave}
      handleClickEditToggle={props.handleClickEditToggle}
      editorState={props.editorState}
    />
  );
}

export default DocumentsListItemsEditor;
