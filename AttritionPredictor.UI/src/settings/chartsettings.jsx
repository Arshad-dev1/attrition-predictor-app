import Chartist from "chartist";

const delays = 80,
  durations = 500;

const lineChart = {
  options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0.2
    }),
    low: 0,
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    axisX: {
      labelInterpolationFnc: value => {
        return value[0];
      }
    }
  },
  // for animation
  animation: {
    draw: data => {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

const barChart = {
  options: {
    axisX: {
      showGrid: false
    },
    low: 0,
    // high: 100,
    chartPadding: {
      top: 0,
      right: 5,
      bottom: 0,
      left: 0
    }
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: value => {
            return value[0];
          }
        }
      }
    ]
  ],
  animation: {
    draw: data => {
      if (data.type === "bar") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

const distributeBarChart = {
  options: {
    axisX: {
      showGrid: false
    },
    low: 0,
    // high: 100,
    distributeSeries: true,
    chartPadding: {
      top: 0,
      right: 5,
      bottom: 0,
      left: 0
    }
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: value => {
            return value[0];
          }
        }
      }
    ]
  ],
  animation: {
    draw: data => {
      if (data.type === "bar") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

const stackChart = {
  options: {
    axisX: {
      showGrid: false,
      offset: 0
    },
    axisY: {
      offset: 90
    },
    horizontalBars: true,
    seriesBarDistance: 20,
    stackBars: true,
    reverseData: true,
    low: 0
    // high: 100
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 2
      }
    ]
  ],
  animation: {
    draw: data => {
      if (data.type === "bar") {
        data.element.attr({
          style: "stroke-width: 13px"
        });
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};
const doughnutChart = {
  options: {
    donut: true,
    startAngle: 270,
    total: 100,
    showLabel: true
  },
  animation: {
    draw: data => {
      if (data.type === "slice") {
        // Get the total path length in order to use for dash array animation
        const pathLength = data.element._node.getTotalLength();
        // const deg = (data.value / 100) * 360;
        // data.element.attr({
        //   style:
        //     "stroke: hsla(" +
        //     deg +
        //     ", 60%, 35%, 1);stroke-width: 20px !important;"
        // });
        data.element.attr({
          style: "stroke-width: 20px !important;"
        });
        data.element.attr({
          "stroke-dasharray": pathLength + "px " + pathLength + "px"
        });

        const animationDefinition = {
          "stroke-dashoffset": {
            id: "anim" + data.index,
            dur: durations,
            from: -pathLength + "px",
            to: "0px",
            easing: Chartist.Svg.Easing.easeOutQuint,
            fill: "freeze"
          }
        };

        if (data.index !== 0) {
          animationDefinition["stroke-dashoffset"].begin =
            "anim" + (data.index - 1) + ".end";
        }

        data.element.attr({
          "stroke-dashoffset": -pathLength + "px"
        });

        data.element.animate(animationDefinition, false);
      }
    }
  }
};

const pieChart = {
  options: {
    width: "300px",
    height: "300px",
    labelInterpolationFnc: value => {
      return value;
    }
  },
  responsiveOptions: [
    [
      "screen and (min-width: 640px)",
      {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: "explode",
        labelInterpolationFnc: function(value) {
          return value;
        }
      }
    ],
    [
      "screen and (min-width: 1024px)",
      {
        labelOffset: 80,
        chartPadding: 20
      }
    ]
  ]
};

const gaugeChart = {
  options: {
    donut: true,
    startAngle: 270,
    total: 200,
    showLabel: true
  },
  animation: {
    draw: data => {
      if (data.type === "slice") {
        // Get the total path length in order to use for dash array animation
        const pathLength = data.element._node.getTotalLength();
        // const deg = (data.value / 100) * 360;
        // data.element.attr({
        //   style:
        //     "stroke: hsla(" +
        //     deg +
        //     ", 60%, 35%, 1);stroke-width: 20px !important;"
        // });
        data.element.attr({
          style: "stroke-width: 30px !important;"
        });
        data.element.attr({
          "stroke-dasharray": pathLength + "px " + pathLength + "px"
        });

        const animationDefinition = {
          "stroke-dashoffset": {
            id: "anim" + data.index,
            dur: durations,
            from: -pathLength + "px",
            to: "0px",
            easing: Chartist.Svg.Easing.easeOutQuint,
            fill: "freeze"
          }
        };

        if (data.index !== 0) {
          animationDefinition["stroke-dashoffset"].begin =
            "anim" + (data.index - 1) + ".end";
        }

        data.element.attr({
          "stroke-dashoffset": -pathLength + "px"
        });

        data.element.animate(animationDefinition, false);
      }
    }
  }
};

export {
  lineChart,
  barChart,
  stackChart,
  doughnutChart,
  pieChart,
  gaugeChart,
  distributeBarChart
};
