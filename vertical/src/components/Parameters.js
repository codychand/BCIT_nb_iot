import axios from 'axios';
import { ConcurrencyManager } from "axios-concurrency";
import classnames from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Spinner } from "reactstrap";
import AllHumidityChart from "../components/charts/allHumidity";
import AllPressureChart from "../components/charts/allPressure";
import AllTemperatureChart from "../components/charts/allTemperatures";
import Settingmenu from "../containers/MainContent/Subpages/Settingmenu";
import { activateAuthLayout } from "../store/actions";
import SimpleDateTimePicker from './SimpleDateTimePicker';

let api = axios.create({
  baseURL: "http://54.189.101.20:3010"
});

const MAX_CONCURRENT_REQUESTS = 1;
ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);

const getRandomKey = () => Math.floor(Math.random() * Math.floor(10000));

class Parameters extends Component {
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
      activeTab1: "5",
      devices: ["AWS1", "AWS2", "AWS3", "AWS4", "AWS5"],
      start_timestamp: parseInt(lsStartTs) || newStartTs,
      end_timestamp: parseInt(lsEndTs) || newEndTs,
      dataFiltering: true
    };
    this.toggle1 = this.toggle1.bind(this);
  }
  
  setTimestamps (from, to) {
    this.setState({
        start_timestamp: from,
        end_timestamp: to
    })
    window.location.reload();
  }

  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab
      });
    }
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

  componentDidMount() {
    this.getData();
    this.props.activateAuthLayout();
  }
  
  render() {
    let spinner = <Spinner color="info" style={{ marginLeft: 75, marginTop: 75 }} />;
    let chkbox = (
      <div 
          style={{ 
              padding: 25,
              margin: 0,
              display: 'flex',
              alignItems: 'center'
          }} 
          className="custom-control custom-checkbox">
          { 
              (this.state.dataFiltering) ?
                  <input 
                      type="checkbox" 
                      className="custom-control-input" 
                      id="customCheck1" 
                      onChange={() => this.setState({ dataFiltering: !this.state.dataFiltering })}
                      checked /> :
                  <input 
                      type="checkbox" 
                      className="custom-control-input" 
                      id="customCheck1" 
                      onChange={() => this.setState({ dataFiltering: !this.state.dataFiltering })} />
          }
          <label className="custom-control-label" htmlFor="customCheck1">Filter/Aggregate data to load charts faster</label>
      </div>
  );
    
    return (
      <React.Fragment>
        <Row>
          <div className="content col-lg-7">
            <div className="container-fluid">
              <div className="page-title-box">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <h4 className="page-title">Parameters</h4>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item active">
                        Toggle devices and parameters to compare device data
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <Row>
                <Col>
                  <SimpleDateTimePicker 
                    viewportWidth={this.props.viewportWidth} 
                    setTimestamps={(from, to) => this.setTimestamps([from, to])} />
                </Col>
              </Row>
              
              <Row>
                <Col lg='4'>
                  { chkbox }
                </Col>
              </Row>

              <Row>
                <Col>
                  <Card>
                    <CardBody style={{ padding: this.props.viewportWidth <= 680 ? 5 : '1.25rem' }}>
                      <Nav pills className="navtab-bg nav-justified">
                        <NavItem>
                          <NavLink
                            style={{ cursor: 'pointer' }}
                            className={classnames({
                              active: this.state.activeTab1 === "5"
                            })}
                            onClick={() => {
                              this.toggle1("5");
                            }}
                          >
                            Temperature
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: 'pointer' }}
                            className={classnames({
                              active: this.state.activeTab1 === "6"
                            })}
                            onClick={() => {
                              this.toggle1("6");
                            }}
                          >
                            Humidity
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: 'pointer' }}
                            className={classnames({
                              active: this.state.activeTab1 === "7"
                            })}
                            onClick={() => {
                              this.toggle1("7");
                            }}
                          >
                            Pressure
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={this.state.activeTab1}>
                        <TabPane tabId="5" className="p-3">
                          <Row>
                            <Col
                              sm="12"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              { this.state.data ? 
                                <AllTemperatureChart 
                                  devices={this.state.data}
                                  key={getRandomKey()}
                                  dataFiltering={this.state.dataFiltering} /> : 
                                spinner }
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="6" className="p-3">
                          <Row>
                            <Col
                              sm="12"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              { this.state.data ? 
                                <AllHumidityChart 
                                  devices={this.state.data}
                                  key={getRandomKey()}
                                  dataFiltering={this.state.dataFiltering} /> : 
                                spinner }
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="7" className="p-3">
                          <Row>
                            <Col
                              sm="12"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              { this.state.data ? 
                                <AllPressureChart 
                                  devices={this.state.data}
                                  key={getRandomKey()}
                                  dataFiltering={this.state.dataFiltering} /> : 
                                spinner }
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(connect(null, { activateAuthLayout })(Parameters));
