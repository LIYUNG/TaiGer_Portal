import React from 'react';
import { Button, Card, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_AdminAgent } from '@taiger-common/core';

import EditorNew from '../../components/EditorJs/EditorNew';
import { convertDate } from '../../utils/contants';
// import Blocks from 'editorjs-blocks-react-renderer';
// import Output from 'editorjs-react-renderer';
import { useAuth } from '../../components/AuthProvider';

const DocPageView = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    return (
        <Card sx={{ p: 2 }}>
            {/* <section>
              <Output data={props.editorState} />
            </section> */}
            {/* <Blocks
              data={props.editorState}
              config={{
                code: {
                  className: 'language-js'
                },
                delimiter: {
                  className: 'border border-2 w-16 mx-auto'
                },
                embed: {
                  className: 'border-0'
                },
                header: {
                  className: 'font-bold'
                },
                image: {
                  className: 'w-full max-w-screen-md',
                  actionsClassNames: {
                    stretched: 'w-full h-80 object-cover',
                    withBorder: 'border border-2',
                    withBackground: 'p-2'
                  }
                },
                list: {
                  className: 'list-inside'
                },
                paragraph: {
                  className: 'text-base text-opacity-75',
                  actionsClassNames: {
                    alignment: 'text-{alignment}' // This is a substitution placeholder: left or center.
                  }
                },
                quote: {
                  className: 'py-3 px-5 italic font-serif'
                },
                table: {
                  className: 'table-auto'
                }
              }}
            /> */}
            <EditorNew
                editorState={props.editorState}
                handleClickEditToggle={props.handleClickEditToggle}
                handleClickSave={props.handleClickSave}
                readOnly={true}
            />
            {is_TaiGer_AdminAgent(user) ? (
                <>
                    <Typography>
                        {t('Updated at')} {convertDate(props.editorState.time)}
                    </Typography>
                    <Typography>
                        {t('Updated by')} {props.author ? props.author : '-'}
                    </Typography>
                </>
            ) : null}
            {is_TaiGer_AdminAgent(user) ? (
                <Button
                    color="secondary"
                    onClick={() => props.handleClickEditToggle()}
                    size="small"
                    variant="contained"
                >
                    {t('Edit', { ns: 'common' })}
                </Button>
            ) : null}
        </Card>
    );
};
export default DocPageView;
