import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
// @material-ui/core components
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import PredictIcon from "@material-ui/icons/Send";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
// core components
import GridItem from "core/components/Grid/GridItem.jsx";
import GridContainer from "core/components/Grid/GridContainer.jsx";
import Card from "core/components/Card/Card.jsx";
import CardHeader from "core/components/Card/CardHeader.jsx";
import CardBody from "core/components/Card/CardBody.jsx";
import Snackbar from "core/components/Snackbar/Snackbar.jsx";
import axios from "axios";
import { config } from "settings/envconfig.js";
import dashboardStyle from "core/resources/reactcss/views/dashboardStyle.jsx";

const allowedForEdit = [
  "ENVIRONMENTSATISFACTION",
  "JOBINVOLVEMENT",
  "JOBSATISFACTION",
  "RELATIONSHIPSATISFACTION",
  "WORKLIFEBALANCE"
];
const hideForEdit = ["ATTRITION", "ATTRITIONPROBABILITIES"];
class RealtimePrediction extends React.Component {
  state = {
    surveyData: new Map(),
    attritionFactors: new Map(),
    completed: 0,
    hideProgress: false,
    snackOpen: false,
    selectedEmployee: null,
    selectedAttrition: null,
    employeeNumbers: []
  };

  onPredict = () => {
    this.timer = setInterval(this.progress, 30);
    this.setState({
      hideProgress: false
    });
    const selectedVal = this.state.selectedAttrition;
    const columnNames = [];
    const columnValues = [];
    Object.keys(selectedVal).map(factor => {
      if (!hideForEdit.some(s => s === factor.toUpperCase())) {
        columnNames.push(factor);
        columnValues.push(selectedVal[factor]);
      }
    });
    var strJson='{ "data" : {  "features": {';
    let i =0;
    for(i=0;i<columnNames.length;i++){
      strJson += '"' + columnNames[i] +'":["'+columnValues[i]+'"], ';
    }
    strJson+="}}}"
console.log(strJson)
    axios
      .post(`${config.Endpoint}/getRealTimePrediction`, strJson)
      .then(res => {
        const outColumns = res.data.Results.output1.value.ColumnNames;
        const outValues = res.data.Results.output1.value.Values[0];
        outColumns.map((fac, i) => {
          let column = fac;
          let value = outValues[i];
          if (column === "Scored Labels") {
            column = "Attrition";
          } else if (column === "Scored Probabilities") {
            column = "AttritionProbabilities";
            value = Math.round(parseFloat(value, 10) * 100);
          }
          selectedVal[column] = value;
        });
        this.setState({
          hideProgress: true,
          completed: 0,
          snackOpen: true,
          selectedAttrition: selectedVal
        });
        // clearInterval(this.timer);
        console.log("updated successfully..");
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
  };

  closeNotification = () => {
    this.setState({
      snackOpen: false
    });
  };

  handleSelectionChange = val => {
    this.setState({
      selectedEmployee: val,
      selectedAttrition: this.state.attritionFactors.get(val.value)
    });
  };

  handleFactorsChange = e => {
    const selectedVal = this.state.selectedAttrition;
    selectedVal[e.target.name] = e.target.value;
    this.setState({
      selectedAttrition: selectedVal,
      attritionFactors: this.state.attritionFactors.set(
        this.state.selectedEmployee.value,
        selectedVal
      )
    });
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 30);
    axios
      .get(`${config.Endpoint}/getAttitionFactorWithValue`)
      .then(response => {
        const factorRows = new Map();
        const empNos = [];
        response.data.recordset.map(item => {
          factorRows.set(item.EmployeeNumber, item);
          empNos.push({
            value: item.EmployeeNumber,
            label: item.EmployeeNumber
          });
        });
        console.log(empNos);
        this.setState({
          attritionFactors: factorRows,
          employeeNumbers: empNos,
          hideProgress: true,
          completed: 0
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
          message={"Attrition Predicted Successfully..."}
          close={true}
          closeNotification={this.closeNotification}
        />
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success">
                <Toolbar>
                  <h4 color="inherit" style={{ flexGrow: "1" }}>
                    Change below factors to predict attrition in real time
                  </h4>
                  <Tooltip placement="bottom" title="Predict Attrition">
                    <Fab
                      variant="extended"
                      aria-label="Predict"
                      className={classes.fab}
                      onClick={this.onPredict}
                      // color="inherit"
                      style={{ backgroundColor: "mediumseagreen" }}
                    >
                      Predict
                      <PredictIcon style={{ paddingLeft: "5%" }} />
                    </Fab>
                    {/* <IconButton
                      onClick={this.onPredict}
                      color="inherit"
                      className={classes.fab}
                      aria-label="Predict"
                      <PredictIcon />
                    </IconButton> */}
                  </Tooltip>
                </Toolbar>
              </CardHeader>
              <CardBody>
                <GridContainer style={{ paddingBottom: "5%" }}>
                  <GridItem xs={12} sm={12} md={5}>
                    <h5 className={classes.cardTitle}>Employee Number</h5>
                    <Select
                      autoFocus={true}
                      placeholder={
                        "Select a Employee number to get factor details"
                      }
                      value={this.state.selectedEmployee}
                      onChange={this.handleSelectionChange}
                      options={this.state.employeeNumbers}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      className={classes.textField}
                      label="Attrition"
                      id="mui-theme-provider-standard-input"
                      disabled={!this.state.selectedEmployee}
                      margin="normal"
                      value={
                        this.state.selectedAttrition
                          ? this.state.selectedAttrition.Attrition
                          : ""
                      }
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      className={classes.textField}
                      label="Attrition Probability"
                      id="mui-theme-provider-standard-input"
                      disabled={!this.state.selectedEmployee}
                      margin="normal"
                      value={
                        this.state.selectedAttrition
                          ? `${
                              this.state.selectedAttrition
                                .AttritionProbabilities
                            }%`
                          : ""
                      }
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </GridItem>
                </GridContainer>

                {this.state.selectedEmployee && this.state.selectedAttrition ? (
                  <div>
                    {Object.keys(this.state.selectedAttrition).map(
                      (factor, i) => (
                        <GridContainer
                          key={i}
                          style={{
                            display: hideForEdit.some(
                              s => s === factor.toUpperCase()
                            )
                              ? "none"
                              : "flex"
                          }}
                        >
                          <GridItem xs={12} sm={12} md={3}>
                            <TextField
                              id="outlined-read-only-text"
                              label="Factor"
                              defaultValue={factor}
                              className={classes.textField}
                              margin="normal"
                              InputProps={{
                                readOnly: true
                              }}
                              variant="outlined"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4}>
                            <TextField
                              id={`outlined-textarea${i}`}
                              fullWidth
                              name={factor}
                              label={factor}
                              className={classes.textField}
                              margin="normal"
                              variant="outlined"
                              value={this.state.selectedAttrition[factor]}
                              onChange={this.handleFactorsChange}
                              helperText={`${factor} is ${
                                allowedForEdit.some(
                                  s => s === factor.toUpperCase()
                                )
                                  ? "editable(Expected range:[1-4])"
                                  : "readonly"
                              }`}
                              InputProps={{
                                readOnly: !allowedForEdit.some(
                                  s => s === factor.toUpperCase()
                                )
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      )
                    )}
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

RealtimePrediction.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(RealtimePrediction);
