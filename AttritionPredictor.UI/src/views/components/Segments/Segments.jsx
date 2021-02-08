import React from "react";
import PropTypes from "prop-types";
import AccountCardComponent from "./AccountCardComponent";
import GridItem from "core/components/Grid/GridItem.jsx";
import GridContainer from "core/components/Grid/GridContainer.jsx";
import "./css/segments.css";
import axios from "axios";
import { config } from "settings/envconfig.js";
import CircularProgress from "@material-ui/core/CircularProgress";

class Segments extends React.Component {
  state = {
    accountLevelData: [],
    completed: 0,
    hideProgress: false
  };
  componentDidMount() {
    this.timer = setInterval(this.progress, 30);
    axios
      .get(`${config.Endpoint}/getSegmentResult`)
      .then(response => {
        const featureLabels = [
          "Environment Satisfaction",
          "Job Involvement",
          "Job Satisfaction",
          "Relationship Satisfaction",
          "Work Life Balance"
          // "Travel",
          // "Compensation"
        ];
        const result = [];
        response.data.recordsets[0].map(acc => {
          const esSeries = [];
          const jiSeries = [];
          const jsSeries = [];
          const rsSeries = [];
          const wlbSeries = [];
          const travelSeries = [];
          const miSeries = [];
          response.data.recordsets[1].map(item => {
            if (item.ACCOUNT === acc.ACCOUNT) {
              esSeries.push(item.ENVIRONMENTSATISFACTION);
              jiSeries.push(item.JOBINVOLVEMENT);
              jsSeries.push(item.JOBSATISFACTION);
              rsSeries.push(item.RELATIONSHIPSATISFACTION);
              wlbSeries.push(item.WORKLIFEBALANCE);
              travelSeries.push(item.DISTANCEFROMHOME);
              miSeries.push(item.MONTHLYINCOME);
            }
          });

          const featureSeries = [
            [
              esSeries.filter(x => x === "1").length,
              jiSeries.filter(x => x === "1").length,
              jsSeries.filter(x => x === "1").length,
              rsSeries.filter(x => x === "1").length,
              wlbSeries.filter(x => x === "1").length
            ],
            [
              esSeries.filter(x => x === "2").length,
              jiSeries.filter(x => x === "2").length,
              jsSeries.filter(x => x === "2").length,
              rsSeries.filter(x => x === "2").length,
              wlbSeries.filter(x => x === "2").length
            ],
            [
              esSeries.filter(x => x === "3").length,
              jiSeries.filter(x => x === "3").length,
              jsSeries.filter(x => x === "3").length,
              rsSeries.filter(x => x === "3").length,
              wlbSeries.filter(x => x === "3").length
            ],
            [
              esSeries.filter(x => x === "4").length,
              jiSeries.filter(x => x === "4").length,
              jsSeries.filter(x => x === "4").length,
              rsSeries.filter(x => x === "4").length,
              wlbSeries.filter(x => x === "4").length
            ]
          ];
          result.push({
            name: acc.ACCOUNT,
            probability: acc.ATTRITIONSCORE,
            data: { labels: featureLabels, series: featureSeries }
          });
        });
        console.log(result);
        this.setState({
          accountLevelData: result,
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

  render() {
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
        <GridContainer id="segment">
          {this.state.accountLevelData.map((item, i) => (
            <GridItem xs={12} sm={6} md={4} key={i}>
              <AccountCardComponent
                probability={item.probability}
                accountName={item.name}
                chartData={item.data}
              />
            </GridItem>
          ))}
        </GridContainer>
      </div>
    );
  }
}

export default Segments;
