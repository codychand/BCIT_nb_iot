import axios from "axios";
import { ConcurrencyManager } from "axios-concurrency";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";
import Apexarea from "../containers/charts/apex/apexarea";
import { activateAuthLayout } from "../store/actions";
import "./devices.css";
import SimpleDateTimePicker from "./SimpleDateTimePicker";
import SingleDeviceView from "./SingleDeviceView";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

let api = axios.create({
  baseURL: "http://54.189.101.20:3010"
});

const AWS_DEVICES = ["AWS1", "AWS2", "AWS3", "AWS4", "AWS5"];
const getDeviceIndexFromName = name => AWS_DEVICES.indexOf(name);
const MAX_CONCURRENT_REQUESTS = 1;
ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);
var CancelTokenSource = axios.CancelToken.source();

const getRandomKey = () => Math.floor(Math.random() * Math.floor(10000));

const DeviceCard = props => {
  const AWS_DATA_QUERY_URL = "/aws_query_devices";
  const [deviceData, setDeviceData] = useState(null);
  let content = (
    <Col xl="4">
      <Card>
        <CardBody>
          <h4>
            <Spinner type="grow" color="primary" />
            Loading...
          </h4>
        </CardBody>
      </Card>
    </Col>
  );

  useEffect(() => {
    // const lsCheck = localStorage.getItem(props.deviceName);

    // if (lsCheck) {
    //     let d = JSON.parse(lsCheck);
    //     if (props.default) {
    //         setDeviceData(d.data);
    //         return;
    //     }
    // }

    api
      .post(
        AWS_DATA_QUERY_URL,
        {
          parameters: ["temp", "pressure", "humidity", "tsAWS"],
          start_timestamp: props.timestamps[0],
          end_timestamp: props.timestamps[1],
          devices: [props.deviceName]
        },
        { cancelToken: CancelTokenSource.token }
      )
      .then(res => {
        setDeviceData(res.data);
        // localStorage.setItem(
        //     props.deviceName,
        //     JSON.stringify(Object.assign({
        //         timestamps: props.timestamps,
        //         data: res.data
        //     }))
        // );
      })
      .catch(err => console.log(err));

    return () => {
      CancelTokenSource.cancel("long request cancelled at re-render");
      CancelTokenSource = axios.CancelToken.source();
    };
  }, [props.deviceName, props.timestamps, props.default]);

  if (deviceData) {
    return deviceData.map((device, index) => {
      let size = props.viewportWidth <= 1700 ? "6" : "4";

      return (
        <Col key={index} xl={size}>
          <Card>
            <CardBody
              style={{ padding: props.viewportWidth <= 680 ? 5 : "1.25rem" }}
            >
              <Button
                className="btn-icon"
                onClick={() =>
                  props.setSelectedDevice(
                    getDeviceIndexFromName(device.deviceID)
                  )
                }
                color="secondary"
              >
                <span className="btn-icon-label">
                  <i className="mdi mdi-bullseye-arrow mr-2"></i>
                </span>
                {device.deviceID}
              </Button>
              <div id="area-chart">
                <Apexarea
                  dataFiltering={props.dataFiltering}
                  device={device}
                  left={props.displayParameters[0]}
                  right={props.displayParameters[1]}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
    );
    
    useEffect(() => {
        api.post(AWS_DATA_QUERY_URL, {
            parameters: ["temp", "pressure", "humidity", "tsAWS"],
            start_timestamp: props.timestamps[0],
            end_timestamp: props.timestamps[1],
            devices: [props.deviceName]
        }, { cancelToken: CancelTokenSource.token })
        .then(res => {
            setDeviceData(res.data);
        })
        .catch(err => console.log(err))
        
        return () => {
            CancelTokenSource.cancel("long request cancelled at re-render");
            CancelTokenSource = axios.CancelToken.source();
        }
    }, [props.deviceName, props.timestamps, props.default]);
    
    if (deviceData) {
        return deviceData.map((device, index) => {
            let size = (props.viewportWidth <= 1700) ? "6" : "4";
            
            return (
                <Col key={index} xl={size}>
                    <Card>
                        <CardBody style={{ padding: props.viewportWidth <= 680 ? 5 : '1.25rem' }} >
                            <Button 
                                className="btn-icon" 
                                onClick={() => props.setSelectedDevice(getDeviceIndexFromName(device.deviceID)) }
                                color="secondary">  
                                <span className="btn-icon-label">
                                    <i className="mdi mdi-bullseye-arrow mr-2"></i>
                                </span> 
                                {device.deviceID}
                            </Button>
                            <div id="area-chart">
                                <Apexarea 
                                    dataFiltering={props.dataFiltering}
                                    device={device} 
                                    left={props.displayParameters[0]} 
                                    right={props.displayParameters[1]} />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            )
        })[0];
    } else {
      currentParams[0] = param;
    }

const Devices = props => {
    // constants
    const lsStartTs = localStorage.getItem('start_timestamp');
    const lsEndTs = localStorage.getItem('end_timestamp');
    const AAA = ["temp", "humidity", "pressure"];
    const ALLOWED_DISPLAY_PARAMS = ["Temperature", "Humidity", "Pressure"];
    const VIEWPORT_CHANGE_FLEX_PX = 1630;
    const newStartTs = Math.floor((Date.now() / 1000) - 1500000);
    const newEndTs = Math.floor(Date.now() / 1000);
    
    if (!lsStartTs && !lsEndTs) {
        localStorage.setItem('start_timestamp', newStartTs);
        localStorage.setItem('end_timestamp', newEndTs);
    }
    
    let sd = null;
    if (props.location && props.location.state && props.location.state.selectedDevice) {
        sd = getDeviceIndexFromName(props.location.state.selectedDevice)
    }
    
    // state 
    const [selectedDevice, setSelectedDevice] = useState(sd);
    const [displayParameters, setDisplayParameters] = useState([0,1].map(i => ALLOWED_DISPLAY_PARAMS[i]));
    const [dataFiltering, setDataFiltering] = useState(true);
    const [defaultRange, setDefaultRange] = useState(true);
    const [timestamps, setTimestamps] = useState([
        parseInt(lsStartTs) || newStartTs, 
        parseInt(lsEndTs) || newEndTs
    ])
    
    // functions
    const toggleDisplayParameter = param => {
        let currentParams = displayParameters.slice();
        const i = currentParams.indexOf(param);
        const j = currentParams.indexOf(null);
        
        if (i > -1) {
            currentParams[i] = null;
        } else if (j > -1) {
            currentParams[j] = param;
        } else {
            currentParams[0] = param;
        }
        
        setDisplayParameters(currentParams);
    }
    const back = () => setSelectedDevice(null);
    
    console.log("hereeeeeeee" + timestamps)
    
    // render logic
    useRouteMatch("/iot_devices");
    let content; 
    let backButton = '';
    
    props.activateAuthLayout();
    
    content = (
        <Row style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            { 
                AWS_DEVICES.map(device => {
                    return (
                    <DeviceCard 
                        dataFiltering={dataFiltering}
                        deviceName={device}
                        displayParameters={displayParameters}
                        setSelectedDevice={setSelectedDevice}
                        timestamps={timestamps}
                        default={defaultRange}
                        key={timestamps[0] + getRandomKey()}
                        viewportWidth={props.viewportWidth} />
                )}) 
            }
        </Row>
    );
    
    // open a single device view if a device is selected
    if (selectedDevice != null) {
        let allowedParams = AAA.slice(0);
        
        backButton = (
            <div className="col-sm-1">
                <i className="ion ion-md-arrow-back devices_back_button" onClick={() => back()} />
            </div>
        );
        content = '';
        content = (
            <SingleDeviceView 
                deviceName={AWS_DEVICES[selectedDevice]} 
                displayParameters={displayParameters}
                timestamps={timestamps}
                key={timestamps[0] + getRandomKey()}
                allowedParams={allowedParams} />
        )
    }
    
    let chkbox = '';
    if (selectedDevice == null) {
        chkbox = (
            <div 
                style={{ 
                    padding: (props.viewportWidth <= VIEWPORT_CHANGE_FLEX_PX) ? '5px 25px' : '5px 50px', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center'
                }} 
                className="custom-control custom-checkbox">
                { 
                    (dataFiltering) ?
                        <input 
                            type="checkbox" 
                            className="custom-control-input" 
                            id="customCheck1" 
                            onChange={() => setDataFiltering(!dataFiltering)}
                            checked /> :
                        <input 
                            type="checkbox" 
                            className="custom-control-input" 
                            id="customCheck1" 
                            onChange={() => setDataFiltering(!dataFiltering)} />
                }
                <label className="custom-control-label" htmlFor="customCheck1">Filter/Aggregate data to load charts faster</label>
            </div>
        )
    }
    
    return (
        <React.Fragment>
            <div className="content">
                <div className={props.viewportWidth >= 1200 ? "container-fluid" : "container-fluid col-lg-7"}>
                    <div className="page-title-box">
                        <div style={{ 
                            display: 'flex',  
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: "flex" }} >
                                { backButton }
                                <div>
                                    <h4 className="page-title">Devices</h4>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item active">
                                            {
                                                (selectedDevice != null) ? 
                                                    AWS_DEVICES[selectedDevice] : 
                                                    'All devices'
                                            }
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: (props.viewportWidth <= VIEWPORT_CHANGE_FLEX_PX) ? "flex-start" : "center", 
                                flexDirection: (props.viewportWidth <= VIEWPORT_CHANGE_FLEX_PX) ? "column" : "row"
                            }} >
                                <SimpleDateTimePicker 
                                    viewportWidth={props.viewportWidth} 
                                    setTimestamps={(from, to) => setTimestamps([from, to])} />
                                { chkbox }
                                <div className="float-right d-none d-md-block">
                                    <Row style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        margin: 0
                                    }} >
                                        <p style={{ margin: 0, padding: 5 }}>Show parameters => </p>
                                        {
                                            ALLOWED_DISPLAY_PARAMS.map(param => {
                                                if (displayParameters.indexOf(param) > -1) {
                                                        return (
                                                            <Button 
                                                                key={displayParameters.indexOf(param)}
                                                                color="success"
                                                                style={{
                                                                    margin: 5,
                                                                    color: 'black'
                                                                }}
                                                                onClick={() => { toggleDisplayParameter(param) }}
                                                                >{param}</Button>
                                                        )
                                                    } else {
                                                        return (
                                                            <Button
                                                                key={getRandomKey()}
                                                                outline
                                                                color="info"
                                                                style={{
                                                                    margin: 5
                                                                }}
                                                                onClick={() => { toggleDisplayParameter(param) }}
                                                                >{param}</Button>
                                                        )
                                                    }
                                            })
                                        }
                                    </Row>
                                </div>
                            </div>
                            
                        </div>
                    </div>

  return (
    <React.Fragment>
      <div className="content">
        <div className="container-fluid">
          <div className="page-title-box">
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ display: "flex" }}>
                {backButton}
                <div>
                  <h4 className="page-title">Devices</h4>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item active">
                      {selectedDevice != null
                        ? AWS_DEVICES[selectedDevice]
                        : "All devices"}
                    </li>
                  </ol>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems:
                    viewportWidth <= VIEWPORT_CHANGE_FLEX_PX
                      ? "flex-start"
                      : "center",
                  flexDirection:
                    viewportWidth <= VIEWPORT_CHANGE_FLEX_PX ? "column" : "row"
                }}
              >
                <SimpleDateTimePicker
                  setTimestamps={(from, to) => setTimestampsHandler(from, to)}
                />
                {chkbox}
                <div className="float-right d-none d-md-block">
                  <Row
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: 0
                    }}
                  >
                    <p style={{ margin: 0, padding: 5 }}>Show parameters => </p>
                    {ALLOWED_DISPLAY_PARAMS.map(param => {
                      if (displayParameters.indexOf(param) > -1) {
                        return (
                          <Button
                            key={displayParameters.indexOf(param)}
                            color="success"
                            style={{
                              margin: 5
                            }}
                            onClick={() => {
                              toggleDisplayParameter(param);
                            }}
                          >
                            {param}
                          </Button>
                        );
                      } else {
                        return (
                          <Button
                            key={getRandomKey()}
                            outline
                            color="info"
                            style={{
                              margin: 5
                            }}
                            onClick={() => {
                              toggleDisplayParameter(param);
                            }}
                          >
                            {param}
                          </Button>
                        );
                      }
                    })}
                  </Row>
                </div>
              </div>
            </div>
          </div>

          {content}
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(connect(null, { activateAuthLayout })(Devices));
