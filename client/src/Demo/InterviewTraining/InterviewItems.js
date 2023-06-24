import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';

class InterviewItems extends React.Component {
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            {is_TaiGer_AdminAgent(this.props.user) && (
              <HiX
                size={24}
                color="red"
                title="Delete"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  this.props.openDeleteDocModalWindow(this.props.interview)
                }
              />
            )}
            <Link
              to={`interview-training/${this.props.interview._id.toString()}`}
            >
              {`${this.props.interview.program_id.school} - ${this.props.interview.program_id.program_name}`}{' '}
              <br />
              <i className="feather icon-calendar me-1" />
              {`${this.props.interview.interview_date} - ${this.props.interview.interview_time}`}
            </Link>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default InterviewItems;
