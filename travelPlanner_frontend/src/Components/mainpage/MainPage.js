import React, {Component} from 'react';
import SelectInfo from './SelectInfo';
import SearchInfo from './SearchInfo';
import Axios from 'axios';
import '../../styles/MainPage.css';
import { BACKEND_CITY_URL, SMARTY_STREETS_BASE_URL, SMARTY_STREETS_API_WEBSITE_KEY } from '../../constant';
import { withRouter } from "react-router-dom"
import {  Modal } from 'antd';
import bg from '../../assets/picture/bg.png';
import Cookies from 'universal-cookie';

class MainPage extends Component{
    // Jump to the Recommondation Page and pass searchData
    // Debug: passed
    toOtherRoute = (value) => {
        const urlObj = {
            pathname: '/home/Recommondation',
            cityData: this.state.searchData
        }
        console.log(value)
        this.props.history.push(urlObj)
    }
    
    constructor() {
        super();
        this.state = ({
            searchLoading: false,
            selectLoading: false,
            chosenPlace: undefined,
            cityData: undefined,
            searchData: undefined,
            error: false,
        })
    }

    // get place data from search / select
    // start loading animation
    setPlace = (chosen) => {
        this.setState({
            // start loading
            searchLoading: true,
            chosenPlace: chosen
        }, () => {
            this.validatePlace(this.state.chosenPlace)
        })
    }
    
    // validate the place entered by the customers
    // Debug: passed
    validatePlace = (value) => {
        let value1 = value.split("  ");
        let cityName = value1[0];
        let stateName = value1[1];
        // console.log(cityName);
        // console.log(stateName);
        
        // const url = `${SMARTY_STREETS_BASE_URL}?key=${SMARTY_STREETS_API_WEBSITE_KEY}&city=${cityName}&state=${stateName}`;
        // console.log(url);
        
        let cityData = {"city" : cityName, "state":stateName};
 
        console.log(cityData)
        this.sentCityData(cityData)

        // Axios.get(url)
        //      .then(response => {
        //          console.log(response.data);
        //          this.setState({
        //             cityData: JSON.parse(JSON.stringify(response.data[0].city_states, ['city','state']))
        //          }, () => {
        //              this.sentCityData(this.state.cityData)
        //          })
        //      })
        //      .catch(error => {
        //          // input valid
        //         console.log('input invalid -> ', error);
        //         this.setState({
        //             searchLoading: false
        //         }, this.showInvalid('You have entered a wrong place'))
        //      })
    }

    // after validate, post the city info to the backend 
    // Debug: passed
    
    sentCityData = (data) => {
        console.log(data);
        const cookies = new Cookies();
        const token = cookies.get('tokens').access_token;
        const config = {
          headers: { Authorization: `Bearer ${token}` }
       };
        Axios.post(`${BACKEND_CITY_URL}`, data, config)
             .then( res => {
                 console.log(res);
                 this.setState({
                    searchData: res
                 })
             })
             .catch( e => {
                console.log('err in getting data back-> ', e.message);
                this.setState({
                    searchLoading: false
                }, this.showInvalid('We do not found Places Around'))
             })
             .finally( () => {
                 this.setState({
                     // stop loading
                     searchLoading: false
                 }, () => {
                    console.log(this.state.searchData.data)
                    this.turningPage(this.state.searchData.data);
                 })
             })
    }

    // sent the return-info to the detail page
    // Debug: passed
    turningPage = (data) => {
        this.toOtherRoute(data)
    }

    // show invalid info
    showInvalid = (msg) => {
        let secondsToGo = 5;
        const modal = Modal.success({
          title: 'Oops, Something Went Wrong',
          content: msg,
        });
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      }
    
    render() {
        return (
            <div className='PlaceInfo' style={{
                backgroundImage: 'url(' + bg + ')',
                backgroundPosition: '100%, 100%',
            }}>
                <SearchInfo sentPlace={this.setPlace} loading={this.state.searchLoading} />
                <SelectInfo sentPlace={this.setPlace} loading={this.state.selectLoading} />
            </div>
        );
    }
}

export default withRouter(MainPage);
