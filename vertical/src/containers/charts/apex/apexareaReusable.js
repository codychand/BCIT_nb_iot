import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

const getTimeTextFromUnixTime = (unixTime) => {
    const dateObj = new Date();

    dateObj.setTime(unixTime);
    // console.log(unixTime)

    // return something like 'Mar 03, 08:01'
    return dateObj.toDateString().substr(4,dateObj.toDateString().length - 9) + " " + dateObj.toTimeString().substr(0,5)
}
class ApexareaReusable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    type: 'area',
                    foreColor: '#9f9ea4',
                    toolbar: {
                        show: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                fill: {
                    colors: [(this.props.color) ? this.props.color : '#4090cb']
                },
                colors: ['#4090cb'],
                xaxis: {
                    type: "text",
                    tickPlacement: 'on'
                },
                grid: {
                    yaxis: {
                        lines: {
                            show: false,
                        }
                    }
                },
            },
            series: [{
                name: this.props.name,
                data: this.props.timestamps.map((ts, i) => {
                        return {
                            x: getTimeTextFromUnixTime(ts*1000),
                            y: this.props.data[i]
                        }
                    })
            }]

        }
    }
    render() {
        
        // console.log("length in the chart is " + this.props.timestamps.length)

        let d = (this.props.dynamo && this.state.data) ? this.state.data : this.state.series;

        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={d} type="area" width="100%" height="600" />
            </React.Fragment>
        );
    }
}

export default ApexareaReusable;