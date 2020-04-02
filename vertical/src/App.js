import React, { Component } from 'react';
import Layout from './components/Layout/';
import { withRouter, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/dashboard';
import LocationsComponent from './components/Layout/LocationComponent';
import Parameters from './components/Parameters';
import Devices from './components/Devices';

import './custom.css';
import './App.scss';

// function withLayout(WrappedComponent) {
//   return class extends React.Component {
//     render() {
//       return <Layout>
//         <WrappedComponent></WrappedComponent>
//       </Layout>
//     }
//   };
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewportWidth: window.innerWidth // should probably be in the redux store or something.
    }
    
    this.updateViewportWidthOnResize = this.updateViewportWidthOnResize.bind(this);
  }
  
  updateViewportWidthOnResize () {
    this.setState({ viewportWidth: window.innerWidth })
  }
  
  componentDidMount() {
    window.addEventListener("resize", this.updateViewportWidthOnResize);
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateViewportWidthOnResize);
  }

  render() {

    return (
      <React.Fragment>
        <Router>
          <Switch>
            
            <Route exact path="/dashboard">
              <Layout>
                <Dashboard viewportWidth={this.state.viewportWidth} />
              </Layout>
            </Route>
            
            <Route exact path="/iot_devices">
              <Layout>
                <Devices viewportWidth={this.state.viewportWidth} />
              </Layout>
            </Route>
            
            <Route exact path="/iot_parameters">
              <Layout>
                <Parameters viewportWidth={this.state.viewportWidth} />
              </Layout>
            </Route>
            
            <Route exact path="/iot_locations">
              <Layout>
                <LocationsComponent viewportWidth={this.state.viewportWidth} />
              </Layout>
            </Route>
            
            <Route path="/">
              <Layout>
                <Dashboard viewportWidth={this.state.viewportWidth} />
              </Layout>
            </Route>
            
            {/* {
              routes.map((route, index) => (
                <Route path={route.path} key={index}>
                  { route.component }
                </Route>
              ))
            } */}
            
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}


export default withRouter(App);


