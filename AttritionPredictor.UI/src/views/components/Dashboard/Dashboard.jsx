import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
// @material-ui/icons
import TrackChanges from "@material-ui/icons/TrackChanges";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import AccessTime from "@material-ui/icons/AccessTime";
import Assessment from "@material-ui/icons/Assessment";
import SentimentDissatisfied from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfied from "@material-ui/icons/SentimentSatisfied";
import SentimentVerySatisfied from "@material-ui/icons/SentimentVerySatisfied";
import Divider from "@material-ui/core/Divider";
import ExpandMoreRounded from "@material-ui/icons/ExpandMoreRounded";
import ExpandLessRounded from "@material-ui/icons/ExpandLessRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ContinuousColorLegend, DiscreteColorLegend } from "react-vis";
// core components
import GridItem from "core/components/Grid/GridItem.jsx";
import GridContainer from "core/components/Grid/GridContainer.jsx";
import Card from "core/components/Card/Card.jsx";
import CardHeader from "core/components/Card/CardHeader.jsx";
import CardIcon from "core/components/Card/CardIcon.jsx";
import CardBody from "core/components/Card/CardBody.jsx";
import CardFooter from "core/components/Card/CardFooter.jsx";
import CollapseControl from "core/components/ExpansionPanel/CollapseControl.jsx";
import { barChart, doughnutChart } from "settings/chartsettings.jsx";
import dashboardStyle from "core/resources/reactcss/views/dashboardStyle.jsx";
import axios from "axios";
import { config } from "settings/envconfig.js";
import CircularProgressbar from "react-circular-progressbar";

class Dashboard extends React.Component {
  state = {
    value: 0,
    overAllAttritionProbability: 0,
    attritionFactors: [],
    locationevelData: {},
    rangeProbabilityData: {},
    itemsToShow: 3,
    expanded: false,
    completed: 0,
    hideProgress: false,
    sentimentScore: 0,
    surveyParticipation: 0
  };
  componentDidMount() {
    this.timer = setInterval(this.progress, 30);
    axios
      .get(`${config.Endpoint}/getAttitionResult`)
      .then(response => {
        // handle success
        const esSeries = [];
        const jiSeries = [];
        const jsSeries = [];
        const rsSeries = [];
        const wlbSeries = [];
        const travelSeries = [];
        const miSeries = [];
        const contriFactorLabels = ["Low", "Good", "Excellent", "Outstanding"];
        response.data.recordsets[3].map(item => {
          esSeries.push(item.ENVIRONMENTSATISFACTION);
          jiSeries.push(item.JOBINVOLVEMENT);
          jsSeries.push(item.JOBSATISFACTION);
          rsSeries.push(item.RELATIONSHIPSATISFACTION);
          wlbSeries.push(item.WORKLIFEBALANCE);
          travelSeries.push(item.DISTANCEFROMHOME);
          miSeries.push(item.MONTHLYINCOME);
        });
        const locLabels = [];
        const locAttrScores = [];
        const locSentimentScores = [];
        response.data.recordsets[2].map(loc => {
          locLabels.push(loc.LOCATION);
          locAttrScores.push(loc.LOCLATTRITIONSCORE);
          locSentimentScores.push(loc.LOCSENTIMENTSCORE);
        });
        this.setState({
          attritionFactors: [
            {
              title: "Environment Satisfaction",
              data: {
                labels: contriFactorLabels,
                series: [
                  esSeries.filter(x => x === "1").length,
                  esSeries.filter(x => x === "2").length,
                  esSeries.filter(x => x === "3").length,
                  esSeries.filter(x => x === "4").length
                ]
              },
              disabled: false
            },
            {
              title: "Job Involvement",
              data: {
                labels: contriFactorLabels,
                series: [
                  jiSeries.filter(x => x === "1").length,
                  jiSeries.filter(x => x === "2").length,
                  jiSeries.filter(x => x === "3").length,
                  jiSeries.filter(x => x === "4").length
                ]
              },
              disabled: false
            },
            {
              title: "Job Satisfaction",
              data: {
                labels: contriFactorLabels,
                series: [
                  jsSeries.filter(x => x === "1").length,
                  jsSeries.filter(x => x === "2").length,
                  jsSeries.filter(x => x === "3").length,
                  jsSeries.filter(x => x === "4").length
                ]
              },
              disabled: false
            },
            {
              title: "Relationship Satisfaction",
              data: {
                labels: contriFactorLabels,
                series: [
                  rsSeries.filter(x => x === "1").length,
                  rsSeries.filter(x => x === "2").length,
                  rsSeries.filter(x => x === "3").length,
                  rsSeries.filter(x => x === "4").length
                ]
              },
              disabled: false
            },
            {
              title: "Work Life Balance",
              data: {
                labels: contriFactorLabels,
                series: [
                  wlbSeries.filter(x => x === "1").length,
                  wlbSeries.filter(x => x === "2").length,
                  wlbSeries.filter(x => x === "3").length,
                  wlbSeries.filter(x => x === "4").length
                ]
              },
              disabled: false
            },
            {
              title: "Travel Disance",
              data: { labels: contriFactorLabels, series: [travelSeries] },
              disabled: true
            },
            {
              title: "Compensation",
              data: { labels: contriFactorLabels, series: [miSeries] },
              disabled: true
            }
          ],
          itemsToShow: 3,
          expanded: false,
          overAllAttritionProbability:
            response.data.recordsets[1][0].OVERALLATTRITIONSCORE,
          sentimentScore: response.data.recordsets[4][0].SENTIMENTSCORE,
          surveyParticipation:
            response.data.recordsets[5][0].SurveyParticipation,
          locationevelData: {
            labels: locLabels,
            series: [locAttrScores, locSentimentScores]
          },
          rangeProbabilityData: {
            series: [
              {
                value: response.data.recordsets[0][0].RANGE50TO60,
                className: "custom-dougnut-series-a"
              },
              {
                value: response.data.recordsets[0][0].RANGE60TO80,
                className: "custom-dougnut-series-b"
              },
              {
                value: response.data.recordsets[0][0].RANGE80TO100,
                className: "custom-dougnut-series-c"
              }
            ]
          },
          hideProgress: true
        });
        clearInterval(this.timer);
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({
          hideProgress: true
        });
        clearInterval(this.timer);
      });
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 5 });
  };

  showMore = () => {
    this.state.itemsToShow === 3
      ? this.setState({
          itemsToShow: this.state.attritionFactors.length,
          expanded: true
        })
      : this.setState({ itemsToShow: 3, expanded: false });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
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
        <GridContainer>
          <GridItem xs={12} sm={12} md={7}>
            <Card chart>
              <CardHeader color="info">
                <GridContainer>
                  <GridItem xs={12} sm={6} md={6}>
                    <h4 className={classes.cardTitleWhite}>
                      {"ATTRITION RATE"}
                    </h4>
                    <div
                      style={{
                        width: "200px",
                        paddingTop: "3%",
                        paddingLeft: "3%",
                        height: "200px"
                      }}
                    >
                      <CircularProgressbar
                        percentage={this.state.overAllAttritionProbability}
                        text={`${this.state.overAllAttritionProbability}%`}
                        // Path width must be customized with strokeWidth,
                        // since it informs dimension calculations.
                        strokeWidth={5}
                        styles={{
                          // Customize the root svg element
                          root: {},
                          // Customize the path
                          path: {
                            // Tweak path color:
                            stroke: "orangered",
                            // Tweak path to use flat or rounded ends:
                            strokeLinecap: "butt",
                            // Tweak transition animation:
                            transition: "stroke-dashoffset 0.5s ease 0s"
                          },
                          // Customize the circle behind the path
                          trail: {
                            // Tweak the trail color:
                            stroke: "#d6d6d6"
                          },
                          // Customize the text
                          text: {
                            // Tweak text color:
                            fill: "orangered",
                            // Tweak text size:
                            fontSize: "30px"
                          }
                        }}
                      />
                    </div>
                    {/* <svg width="250" height="250">
                      <circle
                        className={classes.strokeText}
                        cx="125"
                        cy="125"
                        r="100"
                        fill="none"
                        strokeWidth="6"
                      />
                      <text
                        x="50%"
                        y="50%"
                        className={classes.fillText}
                        textAnchor="middle"
                        fontSize="65px"
                        fontFamily="Arial"
                        dy=".3em"
                      >
                        {this.state.overAllAttritionProbability}%
                      </text>
                    </svg> */}
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <h4 className={classes.cardTitleWhite}>{"MORALE CHECK"}</h4>
                    <h4>Sentiment Score {this.state.sentimentScore}%</h4>
                    <ContinuousColorLegend
                      startTitle="0"
                      midTitle="50"
                      endTitle="100"
                    />
                    <h4
                      className={
                        this.state.sentimentScore >= 5
                          ? classes.successText
                          : classes.dangerText
                      }
                    >
                      Overall Status:{" "}
                      {this.state.sentimentScore >= 5 ? "Good" : "Bad"}
                    </h4>
                  </GridItem>
                </GridContainer>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className={classes.cardTitle}>Attrition Probability</h6>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <ChartistGraph
                      className="ct-chart"
                      data={this.state.rangeProbabilityData}
                      type="Pie"
                      options={doughnutChart.options}
                      listener={doughnutChart.animation}
                    />
                  </GridItem>
                  <div className="vertical-divider" />
                  <GridItem xs={12} sm={12} md={7}>
                    <GridContainer>
                      <GridItem xs={7} sm={7} md={7}>
                        <DiscreteColorLegend
                          items={[
                            { title: "Most Likely (80-100%)", color: "#cb6141" }
                          ]}
                        />
                      </GridItem>
                      <GridItem
                        style={{ marginTop: "3%", color: "#cb6141" }}
                        xs={12}
                        sm={12}
                        md={2}
                      >
                        <SentimentDissatisfied />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={7} sm={7} md={7}>
                        <DiscreteColorLegend
                          items={[{ title: "Likely (60-80%)", color: "#f93" }]}
                        />
                      </GridItem>
                      <GridItem
                        style={{ marginTop: "3%", color: "#f93" }}
                        xs={12}
                        sm={12}
                        md={2}
                      >
                        <SentimentSatisfied />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={7} sm={7} md={7}>
                        <DiscreteColorLegend
                          items={[
                            {
                              title: "Least Likely (50-60%)",
                              color: "#3a3"
                            }
                          ]}
                        />
                      </GridItem>
                      <GridItem
                        style={{ marginTop: "3%", color: "#3a3" }}
                        xs={12}
                        sm={12}
                        md={2}
                      >
                        <SentimentVerySatisfied />
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={5}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                  <CardHeader color="success">
                    <GridContainer>
                      <DiscreteColorLegend
                        items={[{ title: "Attrition", color: "whitegray" }]}
                      />
                      <DiscreteColorLegend
                        items={[{ title: "Sentiment", color: "#d43840" }]}
                      />
                    </GridContainer>
                    <ChartistGraph
                      className="ct-chart"
                      data={this.state.locationevelData}
                      type="Bar"
                      options={barChart.options}
                      responsiveOptions={barChart.responsiveOptions}
                      listener={barChart.animation}
                    />
                  </CardHeader>
                  <CardBody>
                    <h4 className={classes.cardTitle}>Locationwise Analysis</h4>
                    <p className={classes.cardCategory}>
                      Overall Attrition
                      <span className={classes.successText}>
                        <ArrowDownward
                          className={classes.upArrowCardCategory}
                        />{" "}
                        2%
                      </span>{" "}
                      less than previous year.
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                      <Assessment />
                    </CardIcon>
                    <h5 className={classes.cardTitle}>
                      Overall Survey Participation
                    </h5>
                    <p className={classes.cardCategory}>
                      {this.state.surveyParticipation}% aggregated participation
                      rate
                    </p>
                  </CardHeader>
                  <CardFooter stats>
                    <div
                      className={
                        this.state.surveyParticipation < 50
                          ? classes.dangerText
                          : this.state.surveyParticipation > 50 &&
                            this.state.surveyParticipation < 70
                          ? classes.warningText
                          : classes.successText
                      }
                    >
                      Participation rate:{" "}
                      {this.state.surveyParticipation < 50
                        ? "Low"
                        : this.state.surveyParticipation > 50 &&
                          this.state.surveyParticipation < 70
                        ? "Medium"
                        : "High"}
                    </div>
                  </CardFooter>
                </Card>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
        <Divider />
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <TrackChanges />
                </CardIcon>
                <h3 className={classes.cardTitle}>Key drivers of Attrition</h3>
              </CardHeader>
              <CardBody>
                <div className={classes.stats}>
                  Drivers discover how satisfied employees are with the culture,
                  leadership, and responsibilities that make up their
                  experiences at work.
                </div>
                <GridContainer>
                  <DiscreteColorLegend
                    items={[
                      { title: "1 - Low", color: "rgba(54, 227, 233, 0.8)" },
                      { title: "2 - Good", color: "rgba(212, 228, 70, 0.8)" },
                      {
                        title: "3 - Excellent",
                        color: "rgba(230, 133, 209, 0.8)"
                      },
                      {
                        title: "4 - Outstanding",
                        color: "rgba(110, 233, 94, 0.8)"
                      }
                    ]}
                  />
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="danger">
                    <h4 className={classes.cardTitleWhite}>
                      Top Contributed Factors
                    </h4>
                  </CardHeader>
                  <CardBody>
                    {this.state.attritionFactors &&
                    this.state.attritionFactors.length > 0 ? (
                      <div>
                        {this.state.attritionFactors
                          .slice(0, this.state.itemsToShow)
                          .map((item, i) => (
                            <CollapseControl
                              key={i}
                              chartColor={"danger"}
                              chartData={item.data}
                              chartLabel={`${item.title} vs Employee`}
                              collapseTitle={item.title}
                              disabled={item.disabled}
                              collapseSecondTitle={`Expand ${item.title}`}
                              collapseSecondSubTitle={
                                "to check its attrition distributions"
                              }
                            />
                          ))}
                        <Button
                          onClick={this.showMore}
                          style={{ textTransform: "none" }}
                          size="small"
                        >
                          {this.state.expanded ? "Show Less" : "Show More"}
                          {this.state.expanded ? (
                            <ExpandLessRounded style={{ fontSize: "20" }} />
                          ) : (
                            <ExpandMoreRounded style={{ fontSize: "20" }} />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <h5 className={classes.dangerText}>
                        No Items to Display..
                      </h5>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
