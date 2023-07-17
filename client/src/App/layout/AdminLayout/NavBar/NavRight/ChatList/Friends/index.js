import React, { Component } from 'react';

import friend from './friends';
import Friend from './Friend';
import Chat from './Chat';
import Aux from '../../../../../../../hoc/_Aux';
import { getMyCommunicationThread } from '../../../../../../../api';
import { Spinner } from 'react-bootstrap';
import { spinner_style } from '../../../../../../../Demo/Utils/contants';

class Friends extends Component {
  state = {
    chatOpen: false,
    user: [],
    students: [],
    isLoaded: false
  };

  componentDidMount() {
    if (this.props.searchMode) {
      this.setState({
        success,
        students: this.props.searchResults,
        isLoaded: true,
        file: null
      });
    } else {
      getMyCommunicationThread().then(
        (resp) => {
          const { success, data } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              success,
              students: data.students,
              isLoaded: true,
              file: null,
              res_status: status
            });
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        },
        (error) => {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.searchMode !== this.props.searchMode) {
      if (this.props.searchMode) {
        this.setState({
          students: this.props.searchResults,
          isLoaded: true,
          file: null
        });
      } else {
        getMyCommunicationThread().then(
          (resp) => {
            const { success, data } = resp.data;
            const { status } = resp;
            if (success) {
              this.setState({
                success,
                students: data.students,
                isLoaded: true,
                file: null,
                res_status: status
              });
            } else {
              this.setState({
                isLoaded: true,
                res_status: status
              });
            }
          },
          (error) => {
            this.setState((state) => ({
              ...state,
              isLoaded: true,
              error,
              res_status: 500
            }));
          }
        );
      }
    }
  }
  // componentWillReceiveProps = (nextProps) => {
  // UNSAFE_componentWillReceiveProps = (nextProps) => {
  //   if (!nextProps.listOpen) {
  //     this.setState({ chatOpen: false, user: [] });
  //   }
  // };

  render() {
    const {
      isLoaded,
      students,
      res_status,
      res_modal_status,
      res_modal_message
    } = this.state;
    if (!isLoaded && !students) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    const friendList = this.state.students.map((f) => {
      if (f.latestCommunication) {
        return (
          <Friend
            key={f.id}
            data={f}
            activeId={this.props.user._id.toString()}
            clicked={this.props.handleCloseChat}
          />
        );
      }
    });

    return (
      <Aux>
        {friendList}
        {/* <Chat
          user={this.state.user}
          chatOpen={this.state.chatOpen}
          listOpen={this.props.listOpen}
          closed={() => this.setState({ chatOpen: false, user: [] })}
        /> */}
      </Aux>
    );
  }
}

export default Friends;
