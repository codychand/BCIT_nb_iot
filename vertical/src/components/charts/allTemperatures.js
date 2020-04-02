import React, { Component } from "react";

import ReactApexChart from "react-apexcharts";

const getTimeTextFromUnixTime = unixTime => {
  const dateObj = new Date();

  dateObj.setTime(unixTime);

  // return something like 'Mar 03, 08:01'
  return (
    dateObj.toDateString().substr(4, dateObj.toDateString().length - 9) +
    " " +
    dateObj.toTimeString().substr(0, 5)
  );
};

// Chart to show the temperature readings from each chart
export class AllTemperatureChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Chart styling
      options: {
        // data for each series
        series: [
          {
            // device 1 temperature
            name: "Device1",
            type: "line",
            data: [7, 8, 5, 2, 9, 2]
          },
          {
            // device 2 temperature
            name: "Device2",
            type: "line",
            data: [3, 4, 7, 4, 7, 2] // TODO: add data
          },
          {
            // device 3 temperature
            name: "Device3",
            type: "line",
            data: [7, 4, 2, 8, 9, 1] // TODO: add data
          }
        ],
        chart: {
          height: 900,
          type: "line",
          foreColor: "#9f9ea4",
          zoom: {
            enabled: false
          },
          toolbar: {
            show: true
          }
        },
        colors: ["#4090cb", "#e74c5e", "#47bd9a"],
        dataLabels: {
          enabled: false
        },
        title: {
          text: "Temperature From All Devices",
          align: "left"
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          type: "text",
          tickPlacement: "on"
        },
        yaxis: {},
        legend: {
          show: true,
          position: "bottom",
          height: 50,
          offsetY: 15
        },
        tooltip: {
          enabled: true,
          shared: true,
          y: [
            {
              title: {
                formatter: function(val) {
                  return val;
                }
              }
            },
            {
              title: {
                formatter: function(val) {
                  return val;
                }
              }
            },
            {
              title: {
                formatter: function(val) {
                  return val;
                }
              }
            }
          ]
        },
        grid: {
          borderColor: "#f1f1f1"
        }
      }
    };
  }
  render() {
    return (
      <React.Fragment>
        <ReactApexChart
          // id = {this.props.device.deviceID}
          options={this.state.options}
          series={this.state.options.series}
          type="line"
          width="100%"
        />
      </React.Fragment>
    );
  }
}

export default AllTemperatureChart;
