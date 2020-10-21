import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
import { trips, transportation } from '../TestData.js';
import { GENERATE_TOUR } from '../constant';
import TestMap from './TestMap';
import { InputNumber, List, Avatar, Divider, Rate, Affix, Button } from 'antd';


export default class Itinary extends Component {
    constructor() {
        super();
        this.state = {
            activeDay: 1,
            Sites: [],
            Lats: [],
            Lons: [],
            tourInfo: undefined,
            tourDuration: undefined,
        };
    }


    /*
        onShowSites = (selectedTrip, idx) => {
            var dailyPlan = selectedTrip.length != 0 ? selectedTrip[idx - 1].oneDayPlan : [];
            var siteNames = [];
            var siteLats = [];
            var siteLons = [];
            for (var i = 0; i < dailyPlan.length; i++) {
                siteNames.push(dailyPlan[i].site);
                siteLats.push(dailyPlan[i].lat);
                siteLons.push(dailyPlan[i].lon);
            }
            this.setState({
                Sites: siteNames,
                Lats: siteLats,
                Lons: siteLons,
            })
            console.log(this.state.Sites)
            console.log(this.state.Lats)
        }
    */
    onChangeActiveDay = (value) => {
        console.log(value);
        this.setState({ activeDay: value });
    }

    generatePlaces = (p) => {
        var ID = []            //[[ID1,ID2,ID3],[ID1,ID2,ID3],[ID1,ID2,ID3]]
        var Time = []
        for (var i = 0; i < p.length; i++) {
            var dailyPlan = p[i];
            var dailyPlaces = dailyPlan.placeList;
            var dailyTime = dailyPlan.placeTime;
            Time.push(dailyTime);
            var dailyPlaceID = [];
            for (var j = 0; j < dailyPlaces.length; j++) {
                dailyPlaceID.push(dailyPlaces[j].placeId);
            }
            ID.push(dailyPlaceID);
        }
        this.state.placeId = ID;
        this.state.time = Time;
    }


    render() {
        if (this.props.location.state.selectedTrip == null) {
            return "Loading"
        }
        let selectedTrip = this.props.location.state.selectedTrip;
        console.log(selectedTrip)  //

        this.generatePlaces(selectedTrip);
        // 把time参数依次merge进simpleplace
        const result = selectedTrip.map((o) => Object.assign({}, o, {
            placeList: o.placeList.map((p, index) => Object.assign({ time: o.placeTime[index] }, p))

        }))
        console.log(result);

        return (
            <div className="Itinary">


                <div className="ItemDisplayTable">


                    <div className="tour-list">
                        <div class="tripheader" ><h1 className="display-name"> Your Los Angeles Trip </h1></div>
                        <div className="Date-selection">
                            <Divider> Show on the map </Divider>
                            <label>Select Day: </label>
                            <InputNumber
                                min={selectedTrip.length !== 0 ? 1 : 1}
                                max={selectedTrip.length !== 0 ? selectedTrip.length : 1}
                                defaultValue={1}
                                style={{ margin: "0 2px" }}
                                onChange={this.onChangeActiveDay}
                            />
                        </div>
                        {
                            result.map((day, index) => (
                                <div key={index}>
                                    <Divider> Day {index + 1}</Divider>
                                    <div>
                                        <List
                                            className="place-list"
                                            itemLayout="vertical  "
                                            split="true"
                                            dataSource={day.placeList}
                                            renderItem={item => (
                                                <List.Item >
                                                    <List.Item.Meta
                                                        avatar={<Avatar size={50} src={item.photo} />}
                                                        title={<p>{item.name}</p>}
                                                        description={<p>Starting Time {parseInt(item.time / 60)}:{(Array(2).join(0) + (item.time - 60 * parseInt(item.time / 60))).slice(-2)} </p>}
                                                    />
                                                    {<span>
                                                        <Rate allowHalf value={item.rating} mountNode />
                                                        {<span className="ant-rate-text">{item.rating} stars</span>}
                                                    </span>
                                                    }
                                                </List.Item>
                                            )} />
                                    </div>
                                </div>
                            ))
                        }
                        <div className="Date-selection">
                            <Divider> Save Your Trip </Divider>
                            <label>Ranking: </label>
                            <Rate allowHalf mountNode />
                        </div>

                    </div>

                </div>



                <div className="GoogleMap">
                    {/* <GoogleMap 
                        nameList={this.state.Sites}
                        lonList={this.state.Lons}
                        latList={this.state.Lats}
                        mapCenter={{lat:this.state.Lats[0],lng:this.state.Lons[0]}}
                    /> */}

                    <TestMap
                        placeId={this.state.placeId.length > 0 ? this.state.placeId[this.state.activeDay - 1] : []}
                        transport={transportation}
                    />

                </div>
            </div>
        )
    }
}