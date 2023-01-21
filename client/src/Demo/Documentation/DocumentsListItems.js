import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';

class DocumentsListItems extends React.Component {
  render() {
    return (
      <>
        <Row>
          <Col sm={10}>
            {is_TaiGer_AdminAgent(this.props.user) && (
              <HiX
                size={24}
                color="red"
                title="Delete"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  this.props.openDeleteDocModalWindow(this.props.document)
                }
              />
            )}
            {this.props.idx}
            {'. '}
            <Link to={`${this.props.path}/${this.props.document._id}`}>
              {this.props.document.title}
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}

export default DocumentsListItems;
