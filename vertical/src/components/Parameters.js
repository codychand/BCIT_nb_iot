import axios from "axios";
import classnames from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import AllHumidityChart from "../components/charts/allHumidity";
import AllPressureChart from "../components/charts/allPressure";
import AllTemperatureChart from "../components/charts/allTemperatures";
import Settingmenu from "../containers/MainContent/Subpages/Settingmenu";
import { activateAuthLayout } from "../store/actions";

class Parameters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // tab toggle
      activeTab1: "5",
      // aws data
      startDate: new Date(),
      devices: ["AWS1", "AWS2", "AWS3", "AWS4", "AWS5"],
      tempData: [],
      humidityData: [],
      pressureData: [],
    };
    this.toggle1 = this.toggle1.bind(this);
  }

  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab
      });
    }
  }

  // getTemp() {
  //     axios.get("http://localhost:3010/aws_query_devices")
  //     .then(res => {
  //         console.log(res)
  //         this.setState({ tempData: res.data})
  //     })
  // }

  getData() {
    axios
      .post("http://54.189.101.20:3010/aws_query_devices", {
        parameters: ["temp", "pressure", "humidity", "tsAWS"],
        start_timestamp: Math.floor(Date.now() / 1000 - 1500000),
        end_timestamp: Math.floor(Date.now() / 1000),
        devices: this.state.devices
      })
      .then(d => this.setState({ data: d.data }))
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.getData();
    this.props.activateAuthLayout();
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <div className="content">
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
                  <div className="col-sm-6">
                    <div className="float-right d-none d-md-block">
                      <Settingmenu />
                    </div>
                  </div>
                </div>
              </div>

              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <Nav pills className="navtab-bg nav-justified">
                        <NavItem>
                          <NavLink
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
                              <AllTemperatureChart />
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
                              <AllHumidityChart />
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
                            <AllPressureChart />
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
