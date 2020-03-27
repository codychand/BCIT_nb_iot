import axios from 'axios';
import { ConcurrencyManager } from "axios-concurrency";
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Spinner } from 'reactstrap';
import ApexareaReusable from '../containers/charts/apex/apexareaReusable';

let api = axios.create({
  baseURL: "http://54.189.101.20:3010"
});

const MAX_CONCURRENT_REQUESTS = 1;
ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);

const SingleDeviceView = props => {
    const AWS_DATA_QUERY_URL = '/aws_query_devices';
    const [deviceData, setDeviceData] = useState(null);
    let content = (
      <h4>
        <Spinner type="grow" color="primary" />
        Loading...
      </h4>
    );
    
    useEffect(() => {
        api.post(AWS_DATA_QUERY_URL, {
            parameters: ["temp", "pressure", "humidity", "tsAWS"],
            start_timestamp: props.timestamps[0],
            end_timestamp: props.timestamps[1],
            devices: [props.deviceName]
        })
        .then(res => setDeviceData(res.data))
        .catch(err => console.log(err))
    }, [props.timestamps, props.deviceName]);
    
    if (deviceData) {
        content = (
          <Row style={{ display: 'flex'}}>
            {
              props.allowedParams.map(param => {
                // console.log(deviceData[0] )
                let h4Title = param + " readings";
                
                // console.log("length in the component is " + deviceData[0].tsAWS.length);
                
                return (
                  <Col xl="6">
                      <Card>
                          <CardBody>
                              <h4 className="mt-0 header-title mb-4">
                                  { h4Title }
                              </h4>
                              <div id="area-chart">
                                  <ApexareaReusable 
                                      data={deviceData[0][param]} 
                                      timestamps={deviceData[0].tsAWS} 
                                      color={'#32a852'}
                                      name={deviceData[0].deviceID} />
                              </div>
                          </CardBody>
                      </Card>
                  </Col>
                )
              })
            }
          </Row>
        );
    }
    
    return content;
};

export default SingleDeviceView;
