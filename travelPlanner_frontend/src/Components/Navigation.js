//暂时不用nav
import React, {Component} from 'react';
import Itinary from './Itinary';
import MainPage from './MainPage';
import CityDetails from './CityPage/CityDetails';
import Recommendation from './Recommendation';
import Axios from 'axios';
import { Layout, Menu} from 'antd';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import { GET_CITY } from '../constant';

const { Header, Content, Sider } = Layout;

class Navigation extends Component{
  constructor() {
    super();
    this.state = {
      cityInfo: undefined,
      cityAddress: undefined,
      tourInfo: undefined,
    }
  }

  
  render() {
  return (
      <Router>
        <Layout>
          <Header>
          <Menu theme="dark" mode="horizontal">
              <Menu.Item><Link to="/MainPage">Main Page</Link></Menu.Item>
              <Menu.Item><Link to="/TripPara">Trip Details</Link></Menu.Item>
              <Menu.Item><Link to="/ItinaryHeader">Itinary</Link></Menu.Item>
              <Menu.Item><Link to="/Recommendation">Recommended Trip</Link></Menu.Item>
              <Menu.Item><Link to="/History">Saved Trip</Link></Menu.Item>
          </Menu>
          </Header>
        </Layout>

        <Sider width={100} style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}>
            
          </Sider>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
              <Route path="/MainPage">
              <Layout>
                <Content>
                  <MainPage searchCity = {this.showCity}/>
                </Content>
              </Layout>
              </Route>

              <Route path="/TripPara">
              <Layout>
                <Content>
                  <CityDetails 
                  cityAddress = {this.state.cityAddress}
                  cityInfo = {this.state.cityInfo}
                  desginTour = {this.desginTour}/>
                </Content>
                </Layout>
              </Route>

              <Route path="/ItinaryHeader">
              <Layout>
                <Content>
                  <Itinary tourInfo = {this.state.tourInfo}/> 
                </Content>
              </Layout>
              </Route>
              
              <Route path="/Recommendation">
              <Layout>
                <Content>
                  <Recommendation />
                </Content>
              </Layout>
              </Route>

              <Route path="/History">
              <History />
              </Route>

          </Switch>
      </Router>
      );
  }
}

function History() {
  return <h2>History</h2>;
}

export default Navigation;
