import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

const getTimeTextFromUnixTime = unixTime => {
    const dateObj = new Date();

    dateObj.setTime(unixTime);

    // return something like 'Mar 03, 08:01'
    return dateObj.toDateString().substr(4,dateObj.toDateString().length - 9) + " " + dateObj.toTimeString().substr(0,5)
}

const displayParamParsable = p => {
    if (p === "Temperature") return "temp";
    if (p === "Pressure") return "pressure";
    if (p === "Humidity") return "humidity";
}

const getColors = params => {
    return params.map(p => {
        if (p === "Temperature") return '#008080';
        if (p === "Humidity") return '#FFFF00';
        if (p === "Pressure") return '#4B0082';
        return '#008080';
    })
}

class Apexarea extends Component {

    constructor(props) {
        super(props);

        let displayParams = []

        if (this.props.left !== null) displayParams.push(this.props.left);
        if (this.props.right !== null) displayParams.push(this.props.right);

        let stateObj = {
            options: {
                chart: {
                    type: 'area',
                    foreColor: '#9f9ea4',
                    toolbar: {
                        show: true,
                    },
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                colors: getColors(displayParams),
                xaxis: {
                    type: "text",
                    tickPlacement: 'on'
                },
                yaxis: displayParams.map(p => {
                    return {
                        title: {
                            text: p
                        },
                        seriesName: p
                    }
                }),
                grid: {
                    yaxis: {
                        lines: {
                            show: false,
                        }
                    },
                    padding: {
                        left: 30,
                        right: 30
                    }
                },
                series: displayParams.map(p => ({
                        name: p,
                        data: this.props.device.tsAWS.map((ts, i) => ({
                                x: getTimeTextFromUnixTime(ts*1000),
                                y: this.props.device[displayParamParsable(p)][i]
                            })
                        ).filter((dataPoint, i) => !props.dataFiltering || i % 15 === 0)
                    })
                )
            }
        }

        if (displayParams.length === 2) stateObj.options.yaxis[1].opposite = true;
        this.state = stateObj;
    }

    render() {
        // console.log(this.props.device.tsAWS.length + ' => ' + this.state.options.series[0].data.length);
        
        // let x = this.props.device.tsAWS.sort((a, b) => a - b);
        // console.log(x[0] + " to " + x[x.length-1])
        
        return (
            <React.Fragment>
                <ReactApexChart id={this.props.device.deviceID} options={this.state.options} series={this.state.options.series} type="area" width="100%" height="299" />
            </React.Fragment>
        );
    }
}

export default Apexarea;