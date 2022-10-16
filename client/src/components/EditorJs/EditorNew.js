import React, { useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
import { uploadImage } from '../../api';

const DEFAULT_INITIAL_DATA = () => {
  return {
    time: new Date().getTime(),
    blocks: [
      {
        type: 'header',
        data: {
          text: 'This is my awesome editor!',
          level: 1
        }
      }
    ]
  };
};

const EditorNew = (props) => {
  const ejInstance = useRef();
  const [editorData, setEditorData] = React.useState(DEFAULT_INITIAL_DATA);
  const [cookies, setCookie, removeCookie] = useCookies(['x-auth']);
  // This will run only once
  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current.destroy();
      ejInstance.current = null;
    };
  }, []);
  // const uploadImageCallBack = (file) => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return new Promise((resolve, reject) => {
  //     console.log('Uploading image...');
  //     uploadImage(formData)
  //       .then((res) => {
  //         resolve({ data: { link: res.data.data } });
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // };
  const initEditor = () => {
    var editor = new EditorJS({
      holder: 'editorjs',
      logLevel: 'ERROR',
      data: editorData,
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        let content = await this.editorjs.saver.save();
        // Put your logic here to save this data to your DB
        setEditorData(content);
      },
      autofocus: true,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4],
            defaultLevel: 3
          },
          inlineToolbar: ['link']
        },
        list: {
          class: List,
          inlineToolbar: ['link', 'bold']
        },
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
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        image: {
          class: ImageTool,
          config: {
            // additionalRequestHeaders: {
            //   Cookie: 'x-auth=' + `${cookies}`
            // },
            // endpoints: {
            //   byFile: 'https://localhost:3000/api/docs/upload/image', // Your backend file uploader endpoint
            //   byUrl: 'https://localhost:3000/api/docs/upload/image' // Your endpoint that provides uploading by Url
            // },
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append('file', file);
                const res = await uploadImage(formData);
                return { success: 1, file: { url: res.data.data } };
              }
            }
          }
        }
      }
    });
  };
  return (
    <React.Fragment>
      <div id={'editorjs'}></div>
    </React.Fragment>
  );
};

// let saveBtn = document.querySelector('button');

// saveBtn.addEventListener('click', function () {
//   editor
//     .saver()
//     .then((outputData) => {
//       console.log('Article data: ', outputData);
//     })
//     .catch((error) => {
//       console.log('Saving failed: ', error);
//     });
// });

export default EditorNew;
