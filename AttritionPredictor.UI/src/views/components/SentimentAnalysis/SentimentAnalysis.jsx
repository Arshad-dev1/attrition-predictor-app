import React from "react";
import PropTypes from "prop-types";
import ChartistGraph from "react-chartist";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
// core components
import GridItem from "core/components/Grid/GridItem.jsx";
import GridContainer from "core/components/Grid/GridContainer.jsx";
import Card from "core/components/Card/Card.jsx";
import CardHeader from "core/components/Card/CardHeader.jsx";
import CardBody from "core/components/Card/CardBody.jsx";
import WordCloud from "react-d3-cloud";
import { gaugeChart } from "settings/chartsettings.jsx";
import { DiscreteColorLegend } from "react-vis";
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
  }
};

const fontSizeMapper = word => Math.log2(word.value) * 2;
const rotate = word => word.value % 360;

class SentimentAnalysis extends React.Component {
  state = {
    accountSentimentData: [],
    wordClouds: [],
    completed: 0,
    hideProgress: false,
    locationAttritionData: []
  };
  componentDidMount() {
    this.timer = setInterval(this.progress, 30);
    axios
      .get(`${config.Endpoint}/getMoraleCheckData`)
      .then(response => {
        let keyPhrases = [];
        response.data.recordset.map(item =>
          keyPhrases.push(...item.KeyPhrases.split(","))
        );
        keyPhrases = [
          ...new Set(keyPhrases.map(s => s.replace(/[^\w\s]/gi, "")))
        ].filter(w => w !== "");
        let wordSize = 3;
        this.setState({
          wordClouds: keyPhrases.map(word => {
            wordSize = wordSize + 2;
            return { text: word, value: wordSize };
          }),
          hideProgress: true,
          completed: 0,
          accountSentimentData: response.data.recordsets[1].map(item => {
            return {
              account: item.Account,
              data: {
                series: [
                  {
                    value: item.SENTIMENTSCORE,
                    className: "ct-gauge-series-a"
                  },
                  {
                    value: 100 - item.SENTIMENTSCORE,
                    className: "ct-gauge-series-b"
                  }
                ]
              }
            };
          }),
          locationAttritionData: response.data.recordsets[2].map(en => {
            return {
              location: en.Location,
              attrition: en.Attrition,
              attritionCount: en.AttritionCount
            };
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
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>
                  Account Sentiment Analysis
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <DiscreteColorLegend
                    items={[{ title: "Positive", color: "green" }]}
                  />
                  <DiscreteColorLegend
                    items={[{ title: "Negative", color: "brown" }]}
                  />
                </GridContainer>
                {this.state.accountSentimentData.map((item, i) => (
                  <div key={i}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <h5 style={{ color: "green" }}>{item.account}</h5>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <ChartistGraph
                          className="ct-chart"
                          data={item.data}
                          type="Pie"
                          options={gaugeChart.options}
                          listener={gaugeChart.animation}
                        />
                      </GridItem>
                    </GridContainer>
                    <Divider />
                  </div>
                ))}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Key Topics</h4>
              </CardHeader>
              <CardBody>
                <WordCloud
                  height={300}
                  width={400}
                  data={this.state.wordClouds}
                  fontSizeMapper={fontSizeMapper}
                  // rotate={rotate}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

SentimentAnalysis.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SentimentAnalysis);
