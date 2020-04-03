import React, { Component } from "react";

import ReactApexChart from "react-apexcharts";

const getTimeTextFromUnixTime = unixTime => {
  const dateObj = new Date();

  dateObj.setTime(unixTime);

  // return something like 'Mar 03, 08:01'
  return dateObj.toDateString().substr(4,dateObj.toDateString().length - 9) + " " + dateObj.toTimeString().substr(0,5)
}

// Chart to show the temperature readings from each chart
export class AllPressureChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Chart styling
      options: {
        // data for each series
        series: this.props.devices.map(device => ({
          name: device.deviceID,
          type: "line",
          data: device.tsAWS.map((ts, i) => ({
                  x: getTimeTextFromUnixTime(ts*1000),
                  y: device["pressure"][i]
              })
          ).filter((dataPoint, i) => !props.dataFiltering || i % 15 === 0)
        })),
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
          y: this.props.devices.map(device => ({ formatter: val => val + " hPa" }))
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

export default AllPressureChart;
