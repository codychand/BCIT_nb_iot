import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import MetisMenu from 'metismenujs';
import { connect } from 'react-redux';
import { toggleSidebar  } from '../../store/actions';

const SideNav = () => { return <div id="sidebar-menu">
                <ul className="metismenu" id="side-menu">
                            <li className="menu-title">Overview</li>
                            <li>
                                <Link to="/dashboard" className="waves-effect">
                                    <i className="ion ion-md-speedometer"></i>
                                    <span> Dashboard </span>
                                </Link>
                            </li>

                            <li className="menu-title">Pages</li>

                            <li>
                                <Link to="/iot_devices" className="waves-effect">
                                    <i className="ion ion-md-cube"></i>
                                    <span> 
                                        Devices
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/iot_locations" className="waves-effect">
                                    <i className="ion ion-md-pin"></i>
                                    <span>
                                        Locations
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/iot_parameters" className="waves-effect">
                                    <i className="ion ion-md-analytics"></i>
                                    <span>
                                        Parameters
                                    </span>
                                </Link>
                            </li>
                        </ul>
    </div>
}

class Sidebar extends Component {

    componentDidMount() {
       new MetisMenu("#side-menu");
       
        var matchingMenuItem = null;
        var ul = document.getElementById("side-menu");
        var items = ul.getElementsByTagName("a");
        for (var i = 0; i < items.length; ++i) {
            if (this.props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
            } else {
                items[i].classList.remove('mm-active');
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }
    }
    
    componentDidUpdate() {
        this.componentDidMount();
    }

    activateParentDropdown = (item) => {

        item.classList.add('mm-active');
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add('mm-active'); // li 
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");
              
                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add('mm-active'); // li
                    parent3.childNodes[0].classList.add('mm-active'); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add('mm-active');
                    }
                }
            }
            return false;
        }
        return false;
    }

    render() {
        return (
            <React.Fragment>
                <div className="left side-menu">
                    {this.props.is_toggle ? 
                        <PerfectScrollbar>
                             <SideNav />
                        </PerfectScrollbar>
                        :
                        <SideNav />
                        }
                    <div className="clearfix"></div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const { is_toggle } = state.Layout;
    return {  is_toggle };
}

export default withRouter(connect(mapStatetoProps, { toggleSidebar })(Sidebar));












