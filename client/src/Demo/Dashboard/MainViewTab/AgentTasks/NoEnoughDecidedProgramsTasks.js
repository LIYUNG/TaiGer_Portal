import React from 'react';
import { Link } from 'react-router-dom';
import {
  areProgramsDecidedMoreThanContract,
  is_num_Program_Not_specified
} from '../../../Utils/checking-functions';

class NoEnoughDecidedProgramsTasks extends React.Component {
  render() {
    return (
      <>
        {/*  */}
        {is_num_Program_Not_specified(this.props.student) ? (
          <tr>
            <td>
              <Link
                to={
                  '/student-applications/' + this.props.student._id.toString()
                }
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                <b>
                  {this.props.student.firstname} {this.props.student.lastname}{' '}
                </b>
                Applications
              </Link>
            </td>
            <td>
              Contact Sales or Admin for the number of program of
              <b>
                {this.props.student.firstname} {this.props.student.lastname}
              </b>
            </td>
            <td></td>
          </tr>
        ) : (
          <>
            {/* select enough program task */}
            {!areProgramsDecidedMoreThanContract(this.props.student) && (
              <>
                <tr>
                  <td>
                    <Link
                      to={
                        '/student-applications/' +
                        this.props.student._id.toString()
                      }
                      style={{ textDecoration: 'none' }}
                      className="text-info"
                    >
                      <b>
                        {' '}
                        {this.props.student.firstname}{' '}
                        {this.props.student.lastname}{' '}
                      </b>
                      Applications
                    </Link>
                  </td>
                  <td>
                    Please select enough programs for{' '}
                    <b>
                      {this.props.student.firstname}{' '}
                      {this.props.student.lastname}
                    </b>
                  </td>
                  <td></td>
                </tr>
              </>
            )}
          </>
        )}
        {/* TODO: add Portal register tasks */}
      </>
    );
  }
}

export default NoEnoughDecidedProgramsTasks;
