import React from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { spinner_style, spinner_style2 } from '../Utils/contants';
import {
  LinkableNewlineText,
  is_TaiGer_role
} from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';

import { TaiGerAiGeneral, cvmlrlAi } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

class CVMLRLGenerator extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    isGenerating: false,
    data: '',
    success: false,
    prompt: '',
    res_status: 0
  };

  componentDidMount() {
    this.setState({
      isLoaded: true
    });
  }

  onSubmit = () => {
    this.setState({
      isGenerating: true
    });
    TaiGerAiGeneral(this.state.prompt).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            isGenerating: false,
            data,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            isGenerating: false,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          isGenerating: false,
          error,
          res_status: 500
        }));
      }
    );
  };
  onChange = (e) => {
    const prompt_temp = e.target.value;
    console.log(prompt_temp);
    this.setState({
      prompt: prompt_temp
    });
  };
  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('TaiGer AI Playground');
    const { res_status, isLoaded } = this.state;

    if (!isLoaded) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    return (
      <Aux>
        {!isLoaded && (
          <div style={spinner_style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <Card>
          <Card.Body>
            <h4>TaiGer AI Playground</h4>
            <Form>
              <Form.Group className="my-0 mx-0">
                <Form.Control
                  as="textarea"
                  placeholder={'Search...'}
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>
            </Form>
            <br />
            <Button disabled={this.state.isGenerating} onClick={this.onSubmit}>
              {this.state.isGenerating ? (
                <div style={spinner_style2}>
                  <Spinner size="sm" animation="border" role="status">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              ) : (
                'Submit'
              )}
            </Button>
            <p>
              <LinkableNewlineText text={this.state.data}></LinkableNewlineText>
            </p>
          </Card.Body>
        </Card>
      </Aux>
    );
  }
}

export default CVMLRLGenerator;
