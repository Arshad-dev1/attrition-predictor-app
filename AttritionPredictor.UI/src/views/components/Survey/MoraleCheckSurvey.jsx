import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Send";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
// core components
import GridItem from "core/components/Grid/GridItem.jsx";
import GridContainer from "core/components/Grid/GridContainer.jsx";
import Card from "core/components/Card/Card.jsx";
import CardHeader from "core/components/Card/CardHeader.jsx";
import CardBody from "core/components/Card/CardBody.jsx";
import StarRatingComponent from "core/components/StarRatingComponent/StarRatingComponent.jsx";
import Snackbar from "core/components/Snackbar/Snackbar.jsx";
import axios from "axios";
import { config } from "settings/envconfig.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  grow: {
    flexGrow: 1
  }
};

class MoraleCheckSurvey extends React.Component {
  state = {
    surveyData: new Map(),
    surveyFactors: [],
    completed: 0,
    hideProgress: false,
    comments: "",
    snackOpen: false,
    isResetRatings: false,
    employeeNumbers: [],
    selectedEmployee: null
  };

  notifyRatingChanged = (key, val) => {
    this.setState({
      surveyData: this.state.surveyData.set(key, val)
    });
  };

  onSurveySubmit = () => {
    this.timer = setInterval(this.progress, 30);
    const survey = this.state.surveyData;
    survey.set("Comments", this.state.comments);
    survey.set("IsSurveyFilled", true);
    this.setState({
      hideProgress: false,
      surveyData: survey
    });
    const data = Array.from(this.state.surveyData);
    axios
      .put(
        `${config.Endpoint}/saveSurveyData/${
          this.state.selectedEmployee.value
        }`,
        data
      )
      .then(res => {
        this.setState({
          hideProgress: true,
          completed: 0,
          snackOpen: true,
          isResetRatings: true,
          comments: "",
          selectedEmployee: null
        });
        // clearInterval(this.timer);
        console.log("updated successfully..");
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({
          hideProgress: true,
          completed: 0,
          isResetRatings: true,
          comments: "",
          selectedEmployee: null
        });
        clearInterval(this.timer);
      });
  };

  onCommentsChange = e => {
    this.setState({
      comments: e.target.value
    });
  };

  closeNotification = () => {
    this.setState({
      snackOpen: false
    });
  };

  handleSelectionChange = val => {
    this.setState({ selectedEmployee: val });
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 30);
    axios
      .get(`${config.Endpoint}/getSurveyFactors`)
      .then(response => {
        this.setState({
          surveyFactors: response.data.recordset.map(item => {
            return { factor: item.FACTOR, displayName: item.DisplayName };
          }),
          hideProgress: true,
          completed: 0,
          employeeNumbers: response.data.recordsets[1].map(en => {
            return { value: en.EMPLOYEENUMBER, label: en.EMPLOYEENUMBER };
          })
        });
        clearInterval(this.timer);
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({
          hideProgress: true,
          completed: 0
        });
        clearInterval(this.timer);
      });
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 5 });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <CircularProgress
          style={{ display: this.state.hideProgress ? "none" : "block" }}
          className="loader"
          color="secondary"
          variant="determinate"
          thickness={5}
          value={this.state.completed}
        />
        <Snackbar
          place={"br"}
          color={"success"}
          open={this.state.snackOpen}
          message={"Survey Saved Successfully..."}
          close={true}
          closeNotification={this.closeNotification}
        />
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="rose">
                <Toolbar>
                  <h4 color="inherit" className={classes.grow}>
                    Please fill Survey Questions below
                  </h4>
                  <Tooltip placement="bottom" title="Submit Survey">
                    <Fab
                      variant="extended"
                      aria-label="Submit"
                      className={classes.fab}
                      onClick={this.onSurveySubmit}
                      // color="inherit"
                      style={{ backgroundColor: "mediumseagreen" }}
                    >
                      Submit
                      <SaveIcon style={{ paddingLeft: "5%" }} />
                    </Fab>
                    {/* <IconButton
                      onClick={this.onSurveySubmit}
                      color="inherit"
                      className={classes.fab}
                      aria-label="Submit"
                    >
                      <SaveIcon />
                    </IconButton> */}
                  </Tooltip>
                </Toolbar>
              </CardHeader>
              <CardBody>
                <GridContainer style={{ paddingBottom: "5%" }}>
                  <GridItem xs={12} sm={12} md={7}>
                    <h5 style={{ color: "grey" }}>
                      Employee Number filter to be removed after SSO auth
                      integration*
                    </h5>
                    <Select
                      autoFocus={true}
                      placeholder={
                        "Select a Employee number to fill the Survey"
                      }
                      value={this.state.selectedEmployee}
                      onChange={this.handleSelectionChange}
                      options={this.state.employeeNumbers}
                    />
                  </GridItem>
                </GridContainer>
                {this.state.selectedEmployee ? (
                  <div>
                    {this.state.surveyFactors.map((factor, i) => (
                      <GridContainer key={i}>
                        <GridItem xs={12} sm={12} md={3}>
                          <TextField
                            id="outlined-read-only-text"
                            error
                            label="Factor"
                            defaultValue={factor.displayName}
                            className={classes.textField}
                            margin="normal"
                            InputProps={{
                              readOnly: true
                            }}
                            variant="outlined"
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={5}>
                          <TextField
                            error
                            required
                            id={`outlined-textarea${i}`}
                            fullWidth
                            label={`${factor.displayName} Rating`}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <StarRatingComponent
                                  componentKey={factor.factor}
                                  isResetRatings={this.state.isResetRatings}
                                  notifyRatingChanged={this.notifyRatingChanged}
                                />
                              )
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    ))}
                    <GridContainer>
                      <GridItem xs={9} sm={9} md={9}>
                        <TextField
                          id="outlined-textarea"
                          fullWidth
                          label="Additional Comments"
                          placeholder="Comments"
                          multiline
                          rows="3"
                          rowsMax="5"
                          className={classes.textField}
                          value={this.state.comments}
                          onChange={this.onCommentsChange}
                          margin="normal"
                          variant="outlined"
                        />
                      </GridItem>
                    </GridContainer>
                  </div>
                ) : null}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

MoraleCheckSurvey.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MoraleCheckSurvey);
