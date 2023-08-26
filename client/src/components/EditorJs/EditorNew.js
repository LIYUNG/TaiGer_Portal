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
// import Link from '@editorjs/link';
import Delimiter from '@editorjs/delimiter';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import Underline from '@editorjs/underline';
import AttachesTool from '@editorjs/attaches';
// import AttachesTool from '@editorjs/liyungc-attaches';
import LinkTool from '@editorjs/link';
import ColorPlugin from 'editorjs-text-color-plugin';
import TextAlign from '@canburaks/text-align-editorjs';

import { uploadImage, uploadDocDocs } from '../../api';

const EditorNew = (props) => {
  const ejInstance = useRef();
  // This will run only once
  const [editorState, setEditorState] = useState(props.editorState);
  const [contentReady, setContentready] = useState(true);
  var editor;
  const handleEditorChange = (content) => {
    setEditorState(content);
  };
  useEffect(() => {
    setEditorState(props.editorState);
  }, [props.editorState]);

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current && ejInstance.current.destroy();
      ejInstance.current = null;
      // if (ejInstance.current && ejInstance.current.destroy) {
      //   ejInstance.current.destroy();
      // }
    };
  }, [props.editorState]);
  const initEditor = () => {
    editor = new EditorJS({
      holder: 'editorjs',
      logLevel: 'ERROR',
      data: props.editorState,
      onReady: () => {
        ejInstance.current = editor;
      },
      // onChange: props.handleEditorChange,
      onChange: async (api, event) => {
        setContentready(false);
        api.saver.save().then((outputData) => {
          // console.log('outputData ', outputData);
          setEditorState(outputData);
          setContentready(true);
        });
      },
      // onReady: () => {
      //   console.log('Editor.js is ready to work!');
      // },
      readOnly: props.readOnly,
      autofocus: true,
      minHeight: 30,
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
        underline: Underline,
        code: CodeTool,
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
        textAlign: TextAlign,
        attaches: {
          class: AttachesTool,
          config: {
            // endpoint: BASE_URL + '/api/docs/upload/image' // TODO : to replace, no cookie attach if only place URL
            // onRemove: (data) => console.log(data),
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                // TODO: collect uploaded files (to be deleted later if cancel editing)
                formData.append('file', file);
                const res = await uploadDocDocs(formData);
                const { url, title, extension, success } = res.data;
                if (success) {
                  return {
                    success: 1,
                    file: {
                      url: url,
                      title: title,
                      extension: extension
                    }
                  };
                } else {
                  alert(res.data.message);
                }
              }
              // async uploadByUrl(url) {
              //   return {
              //     success: 1,
              //     file: {
              //       url: url
              //     }
              //   };
              // }
            }
          }
        },

        quote: Quote,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        // linkTool: {
        //   class: LinkTool,
        //   config: {
        //     // endpoint: 'https://localhost:3000/fetchUrl', // Your backend endpoint for url data fetching,
        //     uploader: {
        //       async uploadByFile() {
        //         return {
        //           success: 1,
        //           link: 'https://codex.so',
        //           meta: {
        //             title: 'CodeX Team',
        //             site_name: 'CodeX',
        //             description:
        //               'Club of web-development, design and marketing. We build team learning how to build full-valued projects on the world market.',
        //             image: {
        //               url: 'https://codex.so/public/app/img/meta_img.png'
        //             }
        //           }
        //         };
        //       }
        //     }
        //   }
        // },
        image: {
          class: ImageTool,
          config: {
            // endpoints: {
            //   byFile: 'https://localhost:3000/api/docs/upload/image', // Your backend file uploader endpoint
            //   byUrl: 'https://localhost:3000/api/docs/upload/image' // Your endpoint that provides uploading by Url
            // },
            // onRemove: (data) => console.log(data),
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
      <div id={'editorjs'}></div>
      {/* <div>{JSON.stringify(props.editorState)}</div> */}
      {props.readOnly ? (
        <></>
      ) : (
        <Row>
          <Col className="my-0 mx-0">
            <Button
              disabled={
                !contentReady ||
                props.doc_title.replace(/ /g, '').length === 0 ||
                props.category === '' ||
                !editorState.blocks ||
                editorState.blocks.length === 0
              }
              onClick={(e) => props.handleClickSave(e, editorState)}
            >
              Save
            </Button>
            <Button
              onClick={(e) => props.handleClickEditToggle(e)}
              variant="light"
            >
              Cancel
            </Button>
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
};

export default EditorNew;
