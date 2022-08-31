import React, { Component } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';

import Aux from '../../../hoc/_Aux';
import VisaArticleList from '../ArticleList';
import ToggleableArticleForm from '../ToggleableArticleForm';
import {
  updateDoc,
  deleteDoc,
  createArticle,
  getVisaArticle
} from '../../../api';
// import { Stepper, Step } from "react-form-stepper";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = [
  'Step 1: Get an account',
  'Step 2: Fill personal information',
  'Step 3: Choose programs',
  'Step 4: Pay',
  'Step 5: Send copy to Germany'
];
class Visa extends Component {
  state = {
    error: null,
    isLoaded: false,
    articles: [],
    editFormOpen: false,
    role: 'Guest',
    defaultStep: 1,
    activeStep: 0,
    completed: {}
  };
  componentDidMount() {
    getVisaArticle().then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            articles: data,
            isLoaded: true
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error
        });
      }
    );
  }

  handleCreateFormSubmit = (article) => {
    this.createArticle(article);
  };

  createArticle = (article) => {
    console.log('click create new article');
    console.log(article);
    let article_temp = {};
    Object.assign(article_temp, {
      Titel_: article.Titel_,
      Content_: article.Content_,
      Category_: article.Category_,
      LastUpdate_: article.LastUpdate_
    });
    // delete article_temp._id;
    // console.log("article_temp : " + JSON.stringify(article_temp));
    createArticle(article_temp).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            articles: this.state.articles.concat(data)
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error
        });
      }
    );
  };

  handleEditFormSubmit = (update_article) => {
    this.updateArticle(update_article);
  };

  updateArticle = (attrs) => {
    this.setState({
      articles: this.state.articles.map((article) => {
        if (article._id === attrs._id) {
          return Object.assign({}, article, {
            _id: attrs._id,
            Titel_: attrs.Titel_,
            Content_: attrs.Content_,
            Category_: attrs.Category_,
            LastUpdate_: attrs.LastUpdate_
          });
        } else {
          return article;
        }
      })
    });
    //update article
    console.log('click update article');
    console.log(attrs);
    let article_temp = {};
    Object.assign(article_temp, {
      //remove _id
      Titel_: attrs.Titel_,
      Content_: attrs.Content_,
      Category_: attrs.Category_,
      LastUpdate_: attrs.LastUpdate_
    });
    console.log(article_temp);

    updateDoc(attrs._id, article_temp).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: false,
          error
        });
      }
    );
  };

  handleTrashClick = (articleId) => {
    this.deleteArticle(articleId);
  };

  deleteArticle = (articleId) => {
    this.setState({
      articles: this.state.articles.filter(
        (article) => article._id !== articleId
      )
    });

    console.log('click submit article');
    console.log(articleId);
    deleteDoc(articleId).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: false,
          error
        });
      }
    );
  };
  handleClick = (e) => {
    this.setState((state) => ({
      ...state,
      defaultStep: this.state.defaultStep + 1
    }));
  };

  totalSteps = () => {
    return steps.length;
  };

  completedSteps = () => {
    return Object.keys(this.state.completed).length;
  };

  isLastStep = () => {
    return this.state.activeStep === this.totalSteps() - 1;
  };

  allStepsCompleted = () => {
    return this.completedSteps() === this.totalSteps();
  };

  handleNext = () => {
    const newActiveStep =
      this.isLastStep() && !this.allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in this.state.completed))
        : this.state.activeStep + 1;
    this.setState({ activeStep: newActiveStep });
  };

  handleBack = () => {
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
    this.setState((state) => ({
      ...state,
      activeStep: this.state.activeStep - 1
    }));
  };

  handleStep = (step) => () => {
    // setActiveStep(step);
    this.setState((state) => ({ ...state, activeStep: step }));
  };

  handleComplete = () => {
    const newCompleted = this.state.completed;
    newCompleted[this.state.activeStep] = true;
    // setCompleted(newCompleted);
    this.setState((state) => ({
      ...state,
      completed: newCompleted
    }));
    this.handleNext();
  };

  handleReset = () => {
    // setActiveStep(0);
    this.setState((state) => ({ ...state, completed: {}, activeStep: 0 }));
  };
  render() {
    const { error, isLoaded } = this.state;
    const { completed, activeStep } = this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <Aux>
        <Row>
          <Stepper nonLinear activeStep={this.state.activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={this.state.completed[index]}>
                {/* <StepLabel> </StepLabel> */}
                <StepButton
                  color="inherit"
                  onClick={this.handleStep(index)}
                ></StepButton>
                {label}
              </Step>
            ))}
          </Stepper>
        </Row>
        <br />
        <br />
        <Row>
          <div>
            {this.allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={this.handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Step {activeStep + 1}
                  <Row>
                    <Col>
                      <VisaArticleList
                        articles={this.state.articles}
                        category="visa"
                        onFormSubmit={this.handleEditFormSubmit}
                        onTrashClick={this.handleTrashClick}
                        role={this.state.role}
                      />
                      {this.props.user.role === 'Admin' ||
                      this.props.user.role === 'Agent' ? (
                        <ToggleableArticleForm
                          category="visa"
                          onFormSubmit={this.handleCreateFormSubmit}
                        />
                      ) : (
                        <></>
                      )}
                      {!isLoaded && (
                        <div style={style}>
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden"></span>
                          </Spinner>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={this.handleNext} sx={{ mr: 1 }}>
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography
                        variant="caption"
                        sx={{ display: 'inline-block' }}
                      >
                        Step {this.state.activeStep + 1} already completed
                      </Typography>
                    ) : (
                      <Button onClick={this.handleComplete}>
                        {this.completedSteps() === this.totalSteps() - 1
                          ? 'Finish'
                          : 'Complete Step'}
                      </Button>
                    ))}
                </Box>
              </React.Fragment>
            )}
          </div>
        </Row>
      </Aux>
    );
  }
}

export default Visa;
