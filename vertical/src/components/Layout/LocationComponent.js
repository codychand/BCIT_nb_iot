import React, { Component } from 'react';
import Locations from './Locations';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

const dummyData = {
    allDevices: [
      {
        id: 0,
        location: "floor1.png",
        coords: ["35%", "55%"]
      },
      {
        id: 1,
        location: "floor1m.png",
        coords: ["55%", "35%"]
      },
      {
        id: 2,
        location: "floor2.png",
        coords: ["25%", "35%"]
      }
    ],
    floors: ["floor1.png", "floor1m.png", "floor2.png"]
  }

class LocationsComponent extends Component {
  
    componentDidMount () {
        this.props.activateAuthLayout();
    }
  
    render() {
        return (
          <React.Fragment>
            <Row>
              <div className="content">
                <div className="container-fluid col-lg-7">
                  <div className="page-title-box">
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <h4 className="page-title">Device Locations</h4>
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item active">
                            BCIT Downtown Parking Garage
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <Row>
                    <Col>
                      <Locations viewportWidth={this.props.viewportWidth} dummyData={dummyData}/>
                    </Col>
                  </Row>
                </div>
              </div>
            </Row>
          </React.Fragment>
        )
    }
    
}


export default withRouter(connect(null, { activateAuthLayout })(LocationsComponent));

