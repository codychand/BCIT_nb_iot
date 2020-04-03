import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const styles = {
    deviceBlip: { 
        position: "absolute", 
        backgroundColor: "red", 
        borderRadius: 5 ,
        cursor: "pointer",
        padding: '5px 10px'
    }
}

export default class Floor extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    renderDeviceView() {
        return this.props.devices.map(
            device => (
            <Link to={{
                pathname: '/iot_devices',
                state: {
                  selectedDevice: device.id
                }
              }} >
                <div 
                className="device_blip"
                key={device.id} 
                
                style={Object.assign({ 
                    top: device.coords[1], 
                    left: device.coords[0] 
                }, styles.deviceBlip)} 
            >{ device.id }</div></Link> )
        );
    }

    renderImage() {
        console.log(this)
            return (
                <div style={{}}>
                    <img style={{ width: "100%", height: "50%"}} src={this.props.image} alt={'floor'} />
                    {this.renderDeviceView()}
                </div>
            )
    }

    render() {
        return (
            <div style={{ position: "relative", width: "100%" }}>
                {this.renderImage()}
                
            </div>
     )};
}

