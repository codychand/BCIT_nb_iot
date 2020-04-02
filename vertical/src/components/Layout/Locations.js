import React, { Component } from 'react';
import Floor from './floors'
import Floor1 from '../../images/floor1.png'
import Floor1m from '../../images/floor1m.png'
import Floor2 from '../../images/floor2.png'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, CardBody } from 'reactstrap';
import classnames from 'classnames';

const images =[{
    floor: Floor1,
    name:'Floor1',
}, 
{
    floor: Floor1m,
    name: 'Floor1m'
}, 
{
    floor: Floor2,
    name: 'Floor2'
}];

export default class Locations extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentFloor: 0,
            floor: null,
            activeTab: '1',
        };
        
        this.toggleTab = this.toggleTab.bind(this);
    }
    
    toggleTab (tab) {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab, currentFloor: parseInt(tab) });
    }

    render() {
        
        return (
            
            <Card>
                <CardBody style={{ padding: this.props.viewportWidth <= 680 ? 5 : '1.25rem' }}>
                <TabContent activeTab={this.state.activeTab}>
                    {
                        images.map((img) => (
                            <TabPane className="p-3" tabId={images.indexOf(img).toString()}>
                                <Floor
                                    image={img.floor}
                                    devices={this.props.dummyData.allDevices.filter((device) => {
                                        if (this.props.dummyData.floors[this.state.currentFloor] === device.location)
                                            return device
                                            
                                        return false
                                    })} 
                                />
                            </TabPane>
                        ))
                    }
                </TabContent>
                <Nav pills className="navtab-bg nav-justified">
                    {
                        images.map((e) => {
                            let i = images.indexOf(e);
                            let current = this.state.currentFloor === i;
                            
                            return (
                                <NavItem style={{ cursor: 'pointer' }} >
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === i.toString() })}
                                        onClick={() => { this.toggleTab(i.toString()); }}
                                    >
                                        {e.name}
                                    </NavLink>
                                </NavItem>
                            );
                        })
                    }
                </Nav>
                </CardBody>
            </Card>
        )
    }
}
