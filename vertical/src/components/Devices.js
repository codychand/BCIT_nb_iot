import axios from "axios";
import { ConcurrencyManager } from "axios-concurrency";
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row, Spinner } from 'reactstrap';
import Apexarea from '../containers/charts/apex/apexarea';
import { activateAuthLayout } from '../store/actions';
import './devices.css';
import SimpleDateTimePicker from './SimpleDateTimePicker';
import SingleDeviceView from './SingleDeviceView';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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
    const lsCheck = localStorage.getItem(props.deviceName);

    if (lsCheck) {
      let d = JSON.parse(lsCheck);
      if (props.default) {
        setDeviceData(d.data);
        return;
      }
    }

    console.log(props.timestamps);

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
        localStorage.setItem(
          props.deviceName,
          JSON.stringify(
            Object.assign({
              timestamps: props.timestamps,
              data: res.data
            })
          )
        );
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

      console.log(props.displayParameters);

      return (
        <Col key={index} xl={size}>
          <Card>
            <CardBody>
              <Button
                className="btn-icon"
                onClick={() => props.setSelectedDevice(index)}
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
        // const lsCheck = localStorage.getItem(props.deviceName);
        
        // if (lsCheck) {
        //     let d = JSON.parse(lsCheck);
        //     if (props.default) {
        //         setDeviceData(d.data);
        //         return;
        //     }
        // }
        
        api.post(AWS_DATA_QUERY_URL, {
            parameters: ["temp", "pressure", "humidity", "tsAWS"],
            start_timestamp: props.timestamps[0],
            end_timestamp: props.timestamps[1],
            devices: [props.deviceName]
        }, { cancelToken: CancelTokenSource.token })
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
    const AAA = ["temp", "humidity", "pressure"];
    const ALLOWED_DISPLAY_PARAMS = ["Temperature", "Humidity", "Pressure"];
    const VIEWPORT_CHANGE_FLEX_PX = 1630;
    const newTime = [
        ['', Math.floor((Date.now() / 1000) - 1500000)],
        ['', Math.floor(Date.now() / 1000)]
    ];
    
    let sd = null;
    if (props.location && props.location.state && props.location.state.selectedDevice) {
        sd = getDeviceIndexFromName(props.location.state.selectedDevice)
    }
    
    // state 
    const [selectedDevice, setSelectedDevice] = useState(sd);
    const [displayParameters, setDisplayParameters] = useState([0,1].map(i => ALLOWED_DISPLAY_PARAMS[i]));
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [dataFiltering, setDataFiltering] = useState(true);
    const [defaultRange, setDefaultRange] = useState(true);
    const [timestampsWithValue, setTimestampsWithValue] = useState(newTime)
    const [timestamps, setTimestamps] = useState([newTime[0][1], newTime[1][1]])
    
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
        
        if (document.getElementById('from-timestamp-input').value === timestampsWithValue[0][0] &&
            document.getElementById('to-timestamp-input').value === timestampsWithValue[1][0]) {
                setDefaultRange(true);
            } else {
                setDefaultRange(false);
            }
    }
    const back = () => setSelectedDevice(null);
    const updateViewportWidthOnResize = () => setViewportWidth(window.innerWidth);
    const setTimestampsHandler = (from, to) => {
        setTimestamps([from[1], to[1]]);
        setTimestampsWithValue([from, to])
        if (from[0] === "" && to[0] === "") {
            setDefaultRange(true);
        } else {
            setDefaultRange(false);
        }
    };
    
    // render logic
    useRouteMatch("/iot_devices");
    let content; 
    let backButton = '';
    
    props.activateAuthLayout();
    
    useEffect(() => {
        window.addEventListener("resize", updateViewportWidthOnResize);
        
        return () => window.removeEventListener("resize", updateViewportWidthOnResize);
    }, [])
    
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
                        viewportWidth={viewportWidth} />
                )}) 
            }
        </Row>
    );
  }

  let chkbox = "";
  if (selectedDevice == null) {
    chkbox = (
      <div
        style={{
          padding:
            viewportWidth <= VIEWPORT_CHANGE_FLEX_PX ? "5px 25px" : "5px 50px",
          margin: 0,
          display: "flex",
          alignItems: "center"
        }}
        className="custom-control custom-checkbox"
      >
        {dataFiltering ? (
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
            onChange={() => setDataFiltering(!dataFiltering)}
            checked
          />
        ) : (
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
            onChange={() => setDataFiltering(!dataFiltering)}
          />
        )}
        <label className="custom-control-label" htmlFor="customCheck1">
          Filter/Aggregate data to load charts faster
        </label>
      </div>
    );
  }

export default withRouter(connect(null, { activateAuthLayout })(Devices));

export default withRouter(connect(null, { activateAuthLayout })(Devices));
