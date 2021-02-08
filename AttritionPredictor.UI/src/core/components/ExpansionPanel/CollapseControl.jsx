import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChartistGraph from "react-chartist";
import CardHeader from "core/components/Card/CardHeader.jsx";
import { lineChart, distributeBarChart } from "settings/chartsettings.jsx";

const styles = theme => ({
  root: {
    width: "100%",
    paddingBottom: "2%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  statusHeading: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.text.secondary
  }
});

class ControlledExpansionPanels extends React.Component {
  state = {
    expanded: null
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <div className={classes.root} id="collapseGraph">
        <ExpansionPanel
          disabled={this.props.disabled}
          expanded={expanded === "panel"}
          onChange={this.handleChange("panel")}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              {this.props.collapseTitle}
            </Typography>
            <div>
              <Typography className={classes.secondaryHeading}>
                {this.props.collapseSecondTitle}
              </Typography>
              <Typography className={classes.statusHeading}>
                {this.props.collapseSecondSubTitle}
              </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CardHeader style={{ width: "100%" }} color={this.props.chartColor}>
              {/* <h6 className={classes.cardTitle}>{this.props.chartLabel}</h6> */}
              {/* <ChartistGraph
                className="ct-chart"
                data={this.props.chartData}
                type="Line"
                options={lineChart.options}
                listener={lineChart.animation}
              /> */}
              <ChartistGraph
                className="ct-chart"
                data={this.props.chartData}
                type="Bar"
                options={distributeBarChart.options}
                responsiveOptions={distributeBarChart.responsiveOptions}
                listener={distributeBarChart.animation}
              />
            </CardHeader>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
  chartColor: PropTypes.string,
  chartData: PropTypes.object.isRequired,
  collapseTitle: PropTypes.string,
  collapseSecondTitle: PropTypes.string,
  collapseSecondSubTitle: PropTypes.string,
  chartLabel: PropTypes.string,
  disabled: PropTypes.bool
};

export default withStyles(styles)(ControlledExpansionPanels);
