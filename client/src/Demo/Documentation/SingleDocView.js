import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import EditorNew from '../../components/EditorJs/EditorNew';
import { convertDate } from '../Utils/contants';
// import Blocks from 'editorjs-blocks-react-renderer';
import Output from 'editorjs-react-renderer';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
class SingleDocView extends React.Component {
  render() {
    return (
      <>
        <Card className="mb-2 mx-0">
          <Card.Header>
            <Card.Title>{this.props.document_title}</Card.Title>
          </Card.Header>
          <Card.Body>
            {/* <section>
              <Output data={this.props.editorState} />
            </section> */}
            {/* <Blocks
              data={this.props.editorState}
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
                    stretched: 'ce-block--stretched',
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
              handleClickSave={this.props.handleClickSave}
              handleClickEditToggle={this.props.handleClickEditToggle}
              editorState={this.props.editorState}
            />
            {is_TaiGer_AdminAgent(this.props.user) && (
              <>
                <Row>
                  <Col md={2}>
                    <p className="my-0">Updated at</p>
                  </Col>
                  <Col md={10}>
                    <p className="my-0">
                      {convertDate(this.props.editorState.time)}
                    </p>
                  </Col>
                </Row>
              </>
            )}
            {is_TaiGer_AdminAgent(this.props.user) && (
              <Button
                size="sm"
                onClick={(e) => this.props.handleClickEditToggle(e)}
              >
                Edit
              </Button>
            )}
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleDocView;
