import React, { Component } from 'react';
import { Collapse, Select, Button, List, Checkbox, Avatar, Divider, Rate } from 'antd';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { withRouter } from "react-router-dom";
import Axios from 'axios';
import { BACKEND_CITY_URL, BACKEND_TOUR_URL } from '../constant';
import { tours } from '../TestData';
import nextId from "react-id-generator";
import Cookies from 'universal-cookie';

const { Panel } = Collapse;
//const { Option } = Select;

var No_Rec = "No Recommendation available.";
var No_Review = "No Review Available.";

class Recommendation extends Component {
    constructor() {
        super();
        this.state = {
            expandIconPosition: 'left',
            recommended: false,
            loading: false,
            tour:{}
        };
    }

    componentDidMount() {
        console.log(this.props)
        // Axios.post(`${BACKEND_CITY_URL}`, {"city": `${city}`})
        // .then( res => {
        //     console.log(res);
        //     this.setState({
        //        recommendedTourID: res
        //     })
        // })
        // .catch( e => {
        //    console.log('err in getting recommended tour ID-> ', e.message);
        //    this.setState({
        //        searchLoading: false
        //    })
        // })
        // .finally( () => {
        //     this.setState({
        //         // stop loading
        //         searchLoading: false
        //     }, () => {
        //        console.log(this.state.searchData.data)
        //        this.turningPage(this.state.searchData.data);
        //     })
        // })

        // Axios.get("https://travelplannerbackend.azurewebsites.net/tour/133")
        // .then(response => {
        //     console.log(response.data);
        //     this.setState({
        //        cityData: JSON.parse(JSON.stringify(response.data[0].city_states, ['city','state']))
        //     }, () => {
        //         this.sentCityData(this.state.cityData)
        //     })
        // })
        // .catch(error => {
        //     // input valid
        //    console.log('input invalid -> ', error);
        //    this.setState({
        //        searchLoading: false
        //    })
        // })
    }

    // jump page function
    toOtherRoute = () => {
        const urlObj = {
            pathname: `/home/CityDetails`,
            state: {
                cityInfo: {city: this.props.location.cityData.data.city,
                            state: this.props.location.cityData.data.state}
            }
        }

        console.log(this.props.location.cityData.data.city);
        this.props.history.push(urlObj);
    }

    toItinary = (idx) => {
        const urlObj = {
            pathname: `/home/Itinary`,
            state: {
                selectedTrip: this.state.tour[idx],
            }
        }
        this.props.history.push(urlObj);
    }

    onSelect = (value) => {
        console.log(value);
        this.toItinary(value);
    }

    onRecommend = () => {
        this.setState({
            recommended: true,
            loading: true,
        })
    }

    generatePanel = () => {
        // console.log(this.props)
        const toursId = this.props.location.cityData.data.recommendTourId

        // console.log(toursId);
        if (toursId.length === 0 || this.state.recommended === false) {
            return (
                <Button
                    onClick={this.onRecommend}
                >
                    See Recommendations
                </Button>
            )
        }



        var panelList = []
        for (var i = 0; i < toursId.length; i++) {
            panelList.push(this.createPanel(toursId, i));
            // console.log("paneList", panelList)
        }
        return (
            <>
                <Collapse 
                    className='recommendedListHolder'
                    defaultActiveKey={[]}
                    expandIconPosition={this.state.expandIconPosition}
                >
                    {panelList}
                </Collapse>
            </>

        )
    }


    onCollapseClick = (tripID) =>{
        if (this.state.tour[tripID] != null) return;
        console.log(tripID);
        const cookies = new Cookies();
        const token = cookies.get('tokens').access_token;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        Axios.get(`${BACKEND_TOUR_URL}/${tripID}`, config)
            .then(res => {
                this.setState(prevState => {
                    let tour = Object.assign({}, prevState.tour);  
                    tour[tripID] = res.data.days;                                  
                    return { tour };                         
                  })
            })
            .catch(e => {
                console.log('err in getting tour info-> ', e.message);
            })
    }


    createPanel = (toursId, i) => {

        return (
            <Panel
                key={nextId()}
                tourId={toursId[i]}
                onItemClick={this.onCollapseClick(toursId[i])}

                className='recommendedList'
                header={`Recommended Plan ${i + 1}`}
            // extra={<Popup 
            //             trigger={<button>Reviews</button>} 
            //             position="bottom"
            //             closeOnDocumentClick={true}
            //             >
            //             {trips.review?trips.review:No_Review}
            //         </Popup>}
            >
                <div>{this.generateTripSites(toursId[i])}</div>

                <Button
                    type="default"
                    size="default"
                    onClick={() => this.onSelect(toursId[i])}
                >
                    Show Itinary
                    </Button>
            </Panel>
        )
    }

    generateTripSites = (tripID) => {
        // var text = [];
        // for (var j=0; j<trip.length; j++) {
        //     var eachDay = trip[j].placeList;
        //     text.push(`Day ${j+1} : `);

        //     for (var k=0; k<eachDay.length; k++) {
        //         if (k===0) text.push(eachDay[k].name);
        //         else text.push(` -> ${eachDay[k].name}`);
        //     }
        //     text.push(<br/>);
        // }
        // return text;




        if (this.state.tour[tripID] == null) return ("loading"); 
        let trip = this.state.tour[tripID];
        let text = [];
        for (var j = 0; j < trip.length; j++) {
            let eachDay = trip[j].placeList;
            let eachTime = trip[j].placeTime;

            text.push(
                <div key={nextId()}>
                    <Divider orientation='left'
                    >Day {j + 1}</Divider>
                    <List
                        className="recommendedList"
                        itemLayout="horizontal"
                        size="small"
                        dataSource={eachDay}
                        renderItem={item => (
                            <List.Item
                            // actions={[
                            // <Checkbox dataInfo={item}
                            //     onChange={this.onChange}/>]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar shape='square' size={100} src={item.photos} />}
                                    title={<p>{item.name}</p>}
                                    description={
                                        <span>
                                            <Rate allowHalf value={item.rating} mountNode />
                                            {<span className="ant-rate-text">{item.rating} stars</span>}
                                        </span>}
                                />
                            </List.Item>
                        )}
                    />
                </div>)

        }
        return text;


    }


    render() {




        return (
            <div className="background">
                <div className="recommendation">
                    <div className="recommendationlist">
                        <div className="design">
                            <Button onClick={this.toOtherRoute}>
                                Design your own tour
                            </Button>
                        </div>
                        {this.generatePanel()}
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(Recommendation);