import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

import EditorNew from '../../components/EditorJs/EditorNew';
import { convertDate } from '../Utils/contants';
// import Blocks from 'editorjs-blocks-react-renderer';
// import Output from 'editorjs-react-renderer';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';

function DocPageView(props) {
  const { user } = useAuth();
  return (
    <>
      <Card className="mb-2 mx-0">
        <Card.Body>
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
            readOnly={true}
            handleClickSave={props.handleClickSave}
            handleClickEditToggle={props.handleClickEditToggle}
            editorState={props.editorState}
          />
          {is_TaiGer_AdminAgent(user) && (
            <>
              <Row>
                <Col md={2}>
                  <p className="my-0">Updated at</p>
                </Col>
                <Col md={2}>
                  <p className="my-0">{convertDate(props.editorState.time)}</p>
                </Col>
                <Col md={2}>
                  <p className="my-0">Updated by</p>
                </Col>
                <Col md={6}>
                  <p className="my-0">{props.author ? props.author : '-'}</p>
                </Col>
              </Row>
            </>
          )}
          {is_TaiGer_AdminAgent(user) && (
            <Button size="sm" onClick={() => props.handleClickEditToggle()}>
              Edit
            </Button>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
export default DocPageView;
