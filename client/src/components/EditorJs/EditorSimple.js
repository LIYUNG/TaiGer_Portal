import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
// import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
// import Link from '@editorjs/link';
import Delimiter from '@editorjs/delimiter';
import CodeTool from '@editorjs/code';
// import Quote from '@editorjs/quote';
import Underline from '@editorjs/underline';
import ColorPlugin from 'editorjs-text-color-plugin';
// import AttachesTool from '@editorjs/attaches';
import TextAlign from '@canburaks/text-align-editorjs';

import { uploadImage, uploadDocumentThreadImage } from '../../api';

const EditorSimple = (props) => {
    const ejInstance = useRef();
    // This will run only once
    var editor;

    let configuration = {
        holder: `${props.holder}`,
        logLevel: 'ERROR',
        data: props.editorState,
        onReady: () => {
            ejInstance.current = editor;
        },
        onChange: async (api) => {
            if (!props.readOnly) {
                api.saver.save().then((outputData) => {
                    props.handleEditorChange(outputData);
                });
            }
        },
        placeholder:
            'Please organize your questions and expected help concretely.',
        readOnly: props.readOnly,
        // autofocus: true,
        minHeight: props.defaultHeight
    };
    let tools = {
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
        // quote: Quote,
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
        delimiter: Delimiter,
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
    };
    if (props.imageEnable) {
        tools = {
            ...tools,
            image: {
                class: ImageTool,
                config: {
                    uploader: {
                        async uploadByFile(file) {
                            const formData = new FormData();
                            // TODO: collect uploaded files (to be deleted later if cancel editing)
                            formData.append('file', file);
                            let res;
                            if (props.thread) {
                                res = await uploadDocumentThreadImage(
                                    props.thread._id.toString(),
                                    props.thread.student_id._id.toString(),
                                    formData
                                );
                            } else {
                                res = await uploadImage(formData);
                            }
                            return {
                                success: 1,
                                file: { url: res.data.data }
                            };
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
            }
        };
    }
    configuration = {
        ...configuration,
        tools
    };

    useEffect(() => {
        if (!ejInstance.current) {
            initEditor();
        }
        return () => {
            ejInstance.current && ejInstance.current.destroy();
            ejInstance.current = null;
        };
    }, [props.editorState]);
    const initEditor = () => {
        editor = new EditorJS(configuration);
    };

    return <div id={`${props.holder}`} />;
};

export default EditorSimple;
