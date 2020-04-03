import axios from 'axios';
import { ConcurrencyManager } from "axios-concurrency";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner } from 'reactstrap';
import Apexbar from '../containers/charts/apex/apexbar';
import Knob from '../containers/charts/knob/Knob';
import { activateAuthLayout } from '../store/actions';
import SimpleDateTimePicker from './SimpleDateTimePicker';


let api = axios.create({
    baseURL: "http://54.189.101.20:3010"
});
  
const MAX_CONCURRENT_REQUESTS = 1;
ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);

const getTimeTextFromUnixTime = (unixTime, displayType) => {
    const dateObj = new Date();
    dateObj.setTime(unixTime * 1000);
    // return something like 'Mar 03, 08:01'
    return (displayType === 'fancy') ? dateObj.toDateString().substr(4,dateObj.toDateString().length - 9) + " " + dateObj.toTimeString().substr(0,5) : dateObj.toDateString().substr(4,dateObj.toDateString().length - 9);
}

class Dashboard extends Component {

    constructor(props) {
        super(props);
        const lsStartTs = localStorage.getItem('start_timestamp');
        const lsEndTs = localStorage.getItem('end_timestamp');
        const newStartTs = Math.floor((Date.now() / 1000) - 2500000);
        const newEndTs = Math.floor(Date.now() / 1000);
        
        if (!lsStartTs && !lsEndTs) {
            localStorage.setItem('start_timestamp', newStartTs);
            localStorage.setItem('end_timestamp', newEndTs);
        }
        
        this.state = { 
            activeTab: '1', 
            activeother: '1', 
            devices: ["AWS1", "AWS2", "AWS3", "AWS4", "AWS5"],
            start_timestamp: parseInt(lsStartTs) || newStartTs,
            end_timestamp: parseInt(lsEndTs) || newEndTs,
            highlightLongerThan: 2000
        }
        this.toggleStock = this.toggleStock.bind(this);
        this.toggleMessages = this.toggleMessages.bind(this);
        this.horizontalScrollEnable = this.horizontalScrollEnable.bind(this);
        this.setHighlightThreshold = this.setHighlightThreshold.bind(this);
    }
    
    setHighlightThreshold (t) {
        if (t === this.state.highlightLongerThan) return;
        this.setState({ highlightLongerThan: t });
    }
    
    setTimestamps (from, to) {
        this.setState({
            start_timestamp: from,
            end_timestamp: to
        })
        window.location.reload();
    }

    getData () {
        api.post('/aws_query_devices', {
            parameters: ["temp", "pressure", "humidity", "tsAWS"],
            start_timestamp: this.state.start_timestamp,
            end_timestamp: this.state.end_timestamp,
            devices: this.state.devices
        })
        .then(d => this.setState({ data: d.data }))
        .catch(e => console.log(e))
    }
    
    horizontalScrollEnable (e) {
        let item = document.getElementById('avg-rate-y');
        if (item === null) return;
        let f = e.target;
        
        while (f.parentElement) {
            f = f.parentElement;
            if (e.target.id === 'avg-rate-y') break;
            if (f.id === 'avg-rate-y') break;
            
            if (!f.parentElement) return;
        }
        
        e.preventDefault();
        if (e.deltaY > 0) item.scrollLeft += 30;
        else item.scrollLeft -= 30;
    }

    componentDidMount() {
        this.getData();
        this.props.activateAuthLayout();
        window.addEventListener('wheel', this.horizontalScrollEnable);
    }

    toggleStock(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    toggleMessages(tab) {
        if (this.state.activeother !== tab) {
            this.setState({
                activeother: tab
            });
        }
    }

    renderGrid () {
        if (this.state.data) {
            let intervals = [];
            for (let i = 0; i < this.state.data.length; i++) {
                // for every device in this.state.data, 
                // maxTimeStamp - minTimeStamp
                
                intervals.push((Math.max(...this.state.data[i].tsAWS) - Math.min(...this.state.data[i].tsAWS)) / this.state.data[i].tsAWS.length);
            }
            let max = Math.max(...intervals);
            
            for (let i=0; i< intervals.length; i++) {
                this.state.data[i].health = intervals[i] / max * 100;
            }
            
            return this.state.data.map(device => {
                let size = (this.props.viewportWidth <= 1700) ? "6" : "4";
                let health = Math.floor((Math.max(...device.tsAWS) - Math.min(...device.tsAWS)) / device.tsAWS.length);
                let health_s = "Transmitting updates every " + health + " seconds (on average)";
                
                return (
                    <Card className="bg-pattern" key={device.deviceID} style={{ minWidth: 200, maxWidth: 200, margin: 10, height: 200, flex: '0 0 auto', borderRadius: 10 }} >
                        <CardBody>
                            <Link to={{
                                pathname: '/iot_devices',
                                state: {
                                    selectedDevice: device.deviceID
                                }
                            }} >
                                <Button 
                                    style={{ marginBottom: 10 }}
                                    className="btn-icon" 
                                    onClick={() => {}}
                                    color="secondary"> 
                                    <span className="btn-icon-label">
                                        <i className="mdi mdi-bullseye-arrow mr-2"></i>
                                    </span> 
                                    {device.deviceID}
                                </Button>
                            </Link>
                            <div 
                                style={{ 
                                    height: '80%', 
                                    width: '100%', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center' 
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <h3 style={{
                                        margin: 0,
                                        padding: 0,
                                        color: (
                                            health >= this.state.highlightLongerThan || 
                                            health === Number.NEGATIVE_INFINITY) ? 'brown' : 'green'
                                    }} >{ health === Number.NEGATIVE_INFINITY ? "No data" : health + ' s' }</h3>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )
            })
        }
    }

    render() {
        let grid = this.renderGrid()
        let latest = null;
        let devices = [];
        let healths = [];
        
        console.log("hereeeee" + this.state.start_timestamp + ", " + this.state.end_timestamp)
        
        const getDailyUpdates = () => {
            if (!this.state.data) return null;
            
            let all = [];
            let daily = {};
            
            for (let i = 0; i < this.state.data.length; i++) all.push(...this.state.data[i].tsAWS);
            for (let i = 0; i < Math.floor((this.state.end_timestamp - this.state.start_timestamp) / 86400 /* number of seconds in a day */); i++) {
                let curr_ts = i * 86400 + this.state.start_timestamp;
                let prev_ts = i == 0 ? 0 : (i - 1) * 86400 + this.state.start_timestamp;
                
                daily[getTimeTextFromUnixTime(curr_ts)] = all.filter(ts => ts < curr_ts && ts > prev_ts).length;
            }
            
            return daily;
        }
        
        const percentageInactive = s => this.state.data ? 
            this.state.data.map(device => ({ 
                name: device.deviceID,
                percentage: (device.tsAWS.length / ((this.state.end_timestamp - this.state.start_timestamp) / (s * 1.0))) * 100.0
            })) : null;
        
        if (this.state.data) {
            latest = this.state.data[0];
            
            for (let i = 0; i < this.state.devices.length; i++) {
                if(this.state.data[i].tsAWS > latest.tsAWS) {
                    latest = this.state.data[i]
                }
            }
            
            for (let i=0;i<this.state.data.length;i++) {
                devices.push(this.state.data[i].deviceID);
                healths.push(this.state.data[i].health);
            }
        }
        
        let spinner = <Spinner color="info" style={{ marginLeft: 75, marginTop: 75 }} />;
        let dailyUpdates = getDailyUpdates();
        let inactivityReport = percentageInactive(60*20);

        return (
            <React.Fragment>
                <div className="content">
                    <div className="container-fluid">
                        <div className="page-title-box">
                            <div className="row align-items-center">
                                <div className="col-sm-6">
                                    <h3 className="page-title">Dashboard</h3>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item active">Latest updates from IoT devices</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: (this.props.viewportWidth <= 1250) ? 'column' : 'row' }}>

                            <div style={{ display: 'flex', flexDirection: 'column', width: (this.props.viewportWidth <= 1250) ? '100%' : '70%', paddingRight: this.props.viewportWidth <= 800 ? 0 : 35 }} >
                                
                                <SimpleDateTimePicker 
                                    viewportWidth={this.props.viewportWidth} 
                                    setTimestamps={(from, to) => this.setTimestamps(from, to)} />
                                
                                <div style={{ display: 'flex', alignItems: this.props.viewportWidth <= 800 ? 'flex-start' : 'center', flexDirection: this.props.viewportWidth <= 800 ? 'column' : 'row', marginTop: 15 }}>
                                    <div>
                                        <h3 style={{ fontWeight: 'normal', margin: 0 }}>Average update interval</h3>
                                        <div style={{ padding: '10px 0px' }} >
                                            Average number of seconds a device took to send an update from 
                                            <span className="text-info">
                                                {' ' + getTimeTextFromUnixTime(this.state.start_timestamp) + ' '}
                                            </span>
                                            to 
                                            <span className="text-info">
                                                {' ' + getTimeTextFromUnixTime(this.state.end_timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: this.props.viewportWidth <= 800 ? 0 : 50, marginTop: 10, marginBottom: 10 }} >
                                        <Dropdown 
                                            isOpen={this.state.drp_main} 
                                            toggle={() => this.setState({ drp_main: !this.state.drp_main })}>
                                            <DropdownToggle style={{ color: 'black' }} className="btn btn-info" caret>
                                                { this.props.viewportWidth <= 380 ?
                                                    "Time > " :
                                                    "Highlight devices that take longer than" }
                                                {' ' + this.state.highlightLongerThan + 's'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => this.setHighlightThreshold(15)} >
                                                    15 seconds {this.state.highlightLongerThan === 15 ? ' ✔' : ''}
                                                </DropdownItem>
                                                <DropdownItem onClick={() => this.setHighlightThreshold(30)}>
                                                    30 seconds {this.state.highlightLongerThan === 30 ? ' ✔' : ''}
                                                </DropdownItem>
                                                <DropdownItem onClick={() => this.setHighlightThreshold(100)}>
                                                    100 seconds {this.state.highlightLongerThan === 100 ? ' ✔' : ''}
                                                </DropdownItem>
                                                <DropdownItem onClick={() => this.setHighlightThreshold(2000)}>
                                                    2000 seconds {this.state.highlightLongerThan === 2000 ? ' ✔' : ''}
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </div>

                                <Row id="avg-rate-y" style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', minHeight: 220, marginRight: 0 }} >
                                    { (this.state.data) ? grid : spinner }
                                </Row>
                                
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                                    <div>
                                        <h3 style={{ fontWeight: 'normal', margin: 0 }}>Daily update numbers</h3>
                                        <div style={{ padding: '10px 0px' }} >
                                            Number of updates sent each day by all devices from
                                            <span className="text-info">
                                                {' ' + getTimeTextFromUnixTime(this.state.start_timestamp, 'fancy') + ' '}
                                            </span>
                                            to
                                            <span className="text-info">
                                                {' ' + getTimeTextFromUnixTime(this.state.end_timestamp, 'fancy')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <Row style={{ marginTop: 15 }} >
                                    <Col xl={this.props.viewportWidth <= 1650 ? "12" : "10"}>
                                        <Card>
                                            <CardBody>
                                                <h4 className="mt-0 header-title mb-4">Number of Updates</h4>
                                                <div id="column-chart" dir="ltr">
                                                    { (this.state.data) ? <Apexbar x={Object.keys(dailyUpdates)} y={Object.values(dailyUpdates)} />: '' }
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', width: (this.props.viewportWidth <= 1250) ? '100%' : '30%', paddingLeft: 15 }} >
                                <div>
                                    <h3 style={{ fontWeight: 'normal', margin: 0 }}>Device Activity report</h3>
                                    <div style={{ padding: '10px 0px' }} >
                                        % time devices were active from
                                        <span className="text-info">
                                            {' ' + getTimeTextFromUnixTime(this.state.start_timestamp, '') + ' '}
                                        </span>
                                        to
                                        <span className="text-info">
                                            {' ' + getTimeTextFromUnixTime(this.state.end_timestamp, '')}
                                        </span>
                                    </div>
                                </div>
                                <Row style={{ maxWidth: this.props.viewportWidth <= 800 ? '100%' : 450 }} >
                                    <div style={{ width: '100%' }} >
                                        <Card style={{ borderRadius: 10 }}>
                                            <CardBody>
                                                <h4 className="mt-0 header-title">Earning</h4>
                                                <div>
                                                    {
                                                        this.state.data ?
                                                        inactivityReport.map(device => {
                                                            return (
                                                                <div className="wid-earning">
                                                                    <div className="row">
                                                                        <div style={{ display: 'flex', padding: '0px 15px', alignItems: 'center', width: '60%' }}>
                                                                            <div>
                                                                            <Link to={{
                                                                                pathname: '/iot_devices',
                                                                                state: {
                                                                                selectedDevice: device.name
                                                                                }
                                                                            }} >
                                                                                <Button 
                                                                                    style={{ marginBottom: 10 }}
                                                                                    className="btn-icon" 
                                                                                    onClick={() => {}}
                                                                                    color="secondary"> 
                                                                                    <span className="btn-icon-label">
                                                                                        <i className="mdi mdi-bullseye-arrow mr-2"></i>
                                                                                    </span> 
                                                                                    {device.name}
                                                                                </Button>
                                                                            </Link>
                                                                                <h5 className="mt-0">{device.percentage.toString().substr(0,5)}%</h5>
                                                                                <p className="text-muted mb-md-0">of 20 minute intervals</p>
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ width: '40%', padding: '0px 15px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                            <div id="radial-chart">
                                                                                <Knob
                                                                                    value={device.percentage}
                                                                                    fgColor={device.percentage < 50 ? "orange" : "green"}
                                                                                    lineCap="round"
                                                                                    onChange={() => {}}
                                                                                    height={75}
                                                                                    width={75}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>  
                                                            );
                                                        }) : ''
                                                    }
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Row>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Dashboard));


