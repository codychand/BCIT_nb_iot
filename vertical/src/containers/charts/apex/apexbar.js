import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Apexbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            apexBarChartOpt: {
                chart: {
                    type: 'bar',
                    foreColor: '#9f9ea4',
                    toolbar: {
                      show: false,
                    }
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: '14%',
                      endingShape: 'rounded'
                    }
                  },
                  dataLabels: {
                    enabled: false
                  },grid: {
                    yaxis: {
                      lines: {
                        show: false,
                      }
                    }
                  },
                  xaxis: {
                    labels: {
                      rotate: -90
                    },
                    categories: this.props.x,
                  },
                  colors: ['#e74c5e'],
                
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'dark',
                      type: "vertical",
                      shadeIntensity: 1,
                      gradientToColors: [ '#4090cb'],
                      inverseColors: true,
                      opacityFrom: 0.85,
                      opacityTo: 0.85,
                      stops: [0, 100, 100, 100]
                    },
                  },
            }
        }
    }

    render() {
        const apexBarChartData = [{
            name: 'Total Device Updates',
            data: this.props.y
          }];

        return (
            <React.Fragment>
                <ReactApexChart options={this.state.apexBarChartOpt} series={apexBarChartData}  width="100%" height="299"  type="bar"  />
            </React.Fragment>
        );
    }
}

export default Apexbar;   