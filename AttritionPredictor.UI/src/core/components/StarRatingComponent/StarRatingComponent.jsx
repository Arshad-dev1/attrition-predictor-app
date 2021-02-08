import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
import Checkbox from "@material-ui/core/Checkbox";
import GridItem from "core/components/Grid/GridItem.jsx";
import GridContainer from "core/components/Grid/GridContainer.jsx";

class StarRatingComponent extends React.Component {
  state = {
    ratingOne: false,
    ratingTwo: false,
    ratingThree: false,
    ratingFour: false
    // ratingFive: false
  };
  handleChange = val => event => {
    this.props.notifyRatingChanged(this.props.componentKey, val);
    this.setState({
      ratingOne: val >= 1 ? true : false,
      ratingTwo: val >= 2 ? true : false,
      ratingThree: val >= 3 ? true : false,
      ratingFour: val >= 4 ? true : false
      // ratingFive: val >= 5 ? true : false
    });
  };
  componentDidUpdate(prevProps) {
    if (
      this.props.isResetRatings !== prevProps.isResetRatings &&
      this.props.isResetRatings
    ) {
      this.setState({
        ratingOne: false,
        ratingTwo: false,
        ratingThree: false,
        ratingFour: false
        // ratingFive: false
      });
    }
  }
  render() {
    return (
      <GridContainer>
        <GridItem xs={1} sm={1} md={1}>
          <Checkbox
            style={{ color: "rgb(76, 223, 76)" }}
            checked={this.state.ratingOne}
            icon={<StarBorder fontSize="small" />}
            checkedIcon={<Star fontSize="small" />}
            onChange={this.handleChange(1)}
          />
        </GridItem>
        <GridItem xs={1} sm={1} md={1}>
          <Checkbox
            style={{ color: "rgb(58, 204, 58)" }}
            checked={this.state.ratingTwo}
            icon={<StarBorder fontSize="small" />}
            checkedIcon={<Star fontSize="small" />}
            onChange={this.handleChange(2)}
          />
        </GridItem>
        <GridItem xs={1} sm={1} md={1}>
          <Checkbox
            style={{ color: "rgb(44, 168, 44)" }}
            checked={this.state.ratingThree}
            icon={<StarBorder fontSize="small" />}
            checkedIcon={<Star fontSize="small" />}
            onChange={this.handleChange(3)}
          />
        </GridItem>
        <GridItem xs={1} sm={1} md={1}>
          <Checkbox
            style={{ color: "green" }}
            checked={this.state.ratingFour}
            icon={<StarBorder fontSize="small" />}
            checkedIcon={<Star fontSize="small" />}
            onChange={this.handleChange(4)}
          />
        </GridItem>
        {/* <GridItem xs={1} sm={1} md={1}>
          <Checkbox
            checked={this.state.ratingFive}
            icon={<StarBorder fontSize="small" />}
            checkedIcon={<Star fontSize="small" />}
            onChange={this.handleChange(5)}
          /> 
        </GridItem>*/}
      </GridContainer>
    );
  }
}

StarRatingComponent.propTypes = {
  notifyRatingChanged: PropTypes.any.isRequired,
  componentKey: PropTypes.any.isRequired,
  isResetRatings: PropTypes.bool
};

export default StarRatingComponent;
