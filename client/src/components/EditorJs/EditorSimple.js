import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Link from '@editorjs/link';
import Delimiter from '@editorjs/delimiter';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import Underline from '@editorjs/underline';
import ColorPlugin from 'editorjs-text-color-plugin';
import AttachesTool from '@editorjs/attaches';
import TextAlign from '@canburaks/text-align-editorjs';

import { uploadImage } from '../../api';

const EditorSimple = (props) => {
  const ejInstance = useRef();
  // This will run only once
  const [editorState, setEditorState] = useState();
  var editor;
  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
      // setEditorState(props.editorState);
    }
    return () => {
      ejInstance.current.destroy();
      ejInstance.current = null;
    };
  }, [props.editorState]);
  const initEditor = () => {
    editor = new EditorJS({
      holder: `${props.holder}`,
      logLevel: 'ERROR',
      data: props.editorState,
      onReady: () => {
        ejInstance.current = editor;
      },
      // onChange: props.handleEditorChange,
      onChange: async (api, event) => {
        api.saver.save().then((outputData) => {
          // console.log('outputData ', outputData);
          props.handleEditorChange(outputData);
        });
      },
      readOnly: props.readOnly,
      autofocus: true,
      minHeight: 100,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4, 5, 6],
            defaultLevel: 3
          },
          inlineToolbar: true
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        // Marker: {
        //   class: Marker
        //   // shortcut: 'CMD+SHIFT+M'
        // },
        Marker: {
          class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
          config: {
            colorCollections: [
              '#000000',
              '#FF0000',
              '#00FF00',
              '#0000FF',
              '#999999',
              '#00FFFF',
              '#FF00FF',
              '#800080',
              '#FFF'
            ],
            defaultColor: '#FFF',
            type: 'marker'
          }
        },

        underline: Underline,
        code: CodeTool,
        quote: Quote,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        Color: {
          class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
          config: {
            colorCollections: [
              '#000000',
              '#FF0000',
              '#00FF00',
              '#0000FF',
              '#999999',
              '#00FFFF',
              '#FF00FF',
              '#800080',
              '#FFF'
            ],
            type: 'text'
          }
        },
        textAlign: TextAlign,

        image: {
          class: ImageTool,
          config: {
            // endpoints: {
            //   byFile: 'https://localhost:3000/api/docs/upload/image', // Your backend file uploader endpoint
            //   byUrl: 'https://localhost:3000/api/docs/upload/image' // Your endpoint that provides uploading by Url
            // },
            onRemove: (data) => console.log(data),
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                // TODO: collect uploaded files (to be deleted later if cancel editing)
                formData.append('file', file);
                const res = await uploadImage(formData);
                return { success: 1, file: { url: res.data.data } };
              },
              async uploadByUrl(url) {
                return {
                  success: 1,
                  file: {
                    url: url
                  }
                };
              }
            }
          }
        },
        elimiter: Delimiter,
        embed: {
          class: Embed,
          inlineToolbar: false,
          config: {
            services: {
              youtube: true,
              coub: true
            }
          }
        },
        inlineCode: {
          class: InlineCode
          // shortcut: 'CMD+SHIFT+M'
        }
      }
    });
  };

  return (
    <React.Fragment>
      <div id={`${props.holder}`}></div>
    </React.Fragment>
  );
};

export default EditorSimple;
