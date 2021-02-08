import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import { DiscreteColorLegend } from "react-vis";
// core components
import GridItem from "core/components/Grid/GridItem.jsx";
import GridContainer from "core/components/Grid/GridContainer.jsx";
import Card from "core/components/Card/Card.jsx";
import CardHeader from "core/components/Card/CardHeader.jsx";
import CardBody from "core/components/Card/CardBody.jsx";
import { stackChart } from "settings/chartsettings.jsx";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import dashboardStyle from "core/resources/reactcss/views/dashboardStyle.jsx";
import CircularProgressbar from "react-circular-progressbar";

class AccountCardComponent extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes, accountName, probability } = this.props;
    return (
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            {accountName.toUpperCase()}
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
              percentage={probability}
              text={`${probability}%`}
              // Path width must be customized with strokeWidth,
              // since it informs dimension calculations.
              strokeWidth={5}
              styles={{
                // Customize the root svg element
                root: {},
                // Customize the path
                path: {
                  // Tweak path color:
                  stroke: "orange",
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
                  fill: "orange",
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
              fontSize="60px"
              fontFamily="Arial"
              dy=".3em"
            >
              {probability}%
            </text>
          </svg> */}
        </CardHeader>
        <CardBody>
          <GridContainer>
            <DiscreteColorLegend
              orientation="horizontal"
              items={[
                { title: "1 - Low", color: "rgba(11, 66, 23, 0.8)" },
                { title: "2 - Good", color: "#f05b4f" },
                {
                  title: "3 - Excellent",
                  color: "#f4c63d"
                },
                {
                  title: "4 - Outstanding",
                  color: "#d17905"
                }
              ]}
            />
          </GridContainer>
          <h5 className={classes.cardTitle}>Key drivers of Attrition</h5>
          <ChartistGraph
            className="ct-chart"
            data={this.props.chartData}
            type="Bar"
            options={stackChart.options}
            responsiveOptions={stackChart.responsiveOptions}
            listener={stackChart.animation}
          />
        </CardBody>
      </Card>
    );
  }
}

AccountCardComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  accountName: PropTypes.string,
  chartData: PropTypes.any,
  probability: PropTypes.any
};

export default withStyles(dashboardStyle)(AccountCardComponent);
