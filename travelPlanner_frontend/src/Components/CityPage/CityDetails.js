import React, {Component} from 'react';
import InsertPage from './InsertPage';
import PlaceList from './PlaceList';
import Axios from 'axios';
import {GENERATE_TOUR, GET_PLACE, GET_SPECIFIC_PLACE} from '../../constant';
import {List, Modal, Spin, Drawer, Divider, Col, Row} from 'antd';
import { withRouter } from "react-router-dom";
import Cookies from 'universal-cookie';

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

class CityDetails extends Component{
  constructor () {
      super();
      this.state = {
        cityAddress: "seattle",
        choosedInfo: undefined,
        placeInfo: undefined,
        placeDetail: undefined,
        tourInfo: undefined,
        nextPageTokens: [],
        disabledNext: true,
        disabledPlaces: true,
        designLoading: false,
        successDesign: false,
        placeSearched: true,
        visible: false,
      }
    }

    

    toOtherRoute = () => {
      let data = this.state.selectedTrip.day.map(item => {
        return {
          placeList: item.simplePlaces,
          placeTime: item.time
        };
      });
      console.log('tootherrout', this.state.selectedTrip);
      const urlObj = {
          pathname: `/home/Itinary`,

          state: {
            tourInfo: this.state.tourInfo,
            selectedTrip: data

          }
      }
      this.props.history.push(urlObj);
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

    //当有下一页，让下一页按钮可点击，当没有下一页，让下一页按钮不可点击
    setNextPageDisabled = (nextPageToken) => {
      if(nextPageToken != null){
        this.setState({
          disabledNext: false,
        })
      }
      else{
        this.setState({
          disabledNext: true,
        })
      }
    }

    searchPlaces = (choosedInfo) => {
      this.setState({
        choosedInfo: choosedInfo,
      })
      this.fetchPlaces(choosedInfo);
    }

    //传interest和transportation，拿到places
    fetchPlaces = (choosedInfo) =>{
      const {interest} = choosedInfo;
      const url = `${GET_PLACE}city=${this.props.location.state.cityInfo.city},${this.props.location.state.cityInfo.state}`;
      const cookies = new Cookies();
      const token = cookies.get('tokens').access_token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
     };
      Axios.get(url, config)
        .then(response => {
          let list = [];
          list.push(response.data.nextPageToken);
          this.setState({
            placeInfo: response.data.entity,
            nextPageTokens: list,
            selected: [],
            placeSearched: false,
          })
          this.setNextPageDisabled(response.data.nextPageToken);
        })
    }

    
    fetchPreviousPlaces = (pageNumber) => {
      let url = null;
      if(pageNumber === 2) {
        url = `${GET_PLACE}city=${this.props.location.state.cityInfo.city},${this.props.location.state.cityInfo.state}`;
      }
      else {
        url = `${GET_PLACE}nextPageToken=${this.state.nextPageTokens[pageNumber - 3]}`;
      }
      const cookies = new Cookies();
      const token = cookies.get('tokens').access_token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
     };
      Axios.get(url, config)
      .then(response => {
        this.setState({
          placeInfo: response.data.entity,
        })
        this.setNextPageDisabled(response.data.nextPageToken);
      })
      
    }
    //获取下一页的信息 还未做上一页，同时存储上一页的nextpagetoken
    fetchNextPlaces = (pageNumber) => {
      const url = `${GET_PLACE}nextPageToken=${this.state.nextPageTokens[pageNumber - 1]}`;
      const cookies = new Cookies();
      const token = cookies.get('tokens').access_token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
     };
      Axios.get(url, config)
        .then(response => {
          let list = this.state.nextPageTokens;
          console.log(pageNumber);
          console.log(list.length);
          if(pageNumber >= list.length ){
            list.push(response.data.nextPageToken);
          }
          console.log(list);
          this.setState({
            placeInfo: response.data.entity,
            nextPageTokens: list,
          })
          this.setNextPageDisabled(response.data.nextPageToken);
        })
    }
    //modal part
    showErrorModal = (error) => {
      const modal = Modal.success({
        title: 'Something went wrong',
        content: `You got this ${error}`,
      });
    }

    
    designTour = (places, duration, transportation) => {
      const url = `${GENERATE_TOUR}`;
      this.setState({
        designLoading: true,
      })
      const cookies = new Cookies();
      const token = cookies.get('tokens').access_token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
     };
      Axios.post(url, {
          placeIdSet: places, 
          duration: duration,
          travelType: transportation,
      }, config)
        .then(response => {
          this.setState({
            tourInfo: response.data,
            designLoading: false,
            successDesign: true,
            selectedTrip: response.data,

          })
          this.toOtherRoute()
        })
        .catch(error => {
          this.showErrorModal(error);
          this.setState({
            designLoading: false,
            successDesign: false,
          })
        })
    }


    showSpecificPlaces = (placeId) => {
      const url = `${GET_SPECIFIC_PLACE}${placeId}`;
      const cookies = new Cookies();
      const token = cookies.get('tokens').access_token;
      const config = {
      headers: { Authorization: `Bearer ${token}` }
      };
      Axios.get(url, config)
      .then(response=> {
          this.setState({
            placeDetail: response.data,
          })
      })
      this.showDrawer();
    }
    //输入第一部分，收集用户的兴趣和交通工具，filter出places
    //输入第二部分，将filte 过的places 展示给用户，然后用户选择部分
    //将选择的时间和places全都输出得到tour的数据
    render() {
      let cityInfo = this.props.location.state.cityInfo ? this.props.location.state.cityInfo: [];
      let placeDetail = this.state.placeDetail? this.state.placeDetail: [];
        return (
          <div className="main">
            <p className="cityName">{cityInfo.city}</p>
            <div className="city-input">

                <InsertPage cityInfo = {cityInfo}
                submit={this.searchPlaces}/>
                {this.state.designLoading ? 
                    <Spin tip="Designing your tour" /> : null}
            </div>

            <div className="city-content">
            <PlaceList 
                cityInfo = {cityInfo}
                placeInfo = {this.state.placeInfo}
                disabledNext = {this.state.disabledNext}
                placeSearched = {this.state.placeSearched}
                successDesign = {this.state.successDesign}
                designTour = {this.designTour}
                previousPage = {this.fetchPreviousPlaces}
                nextPage = {this.fetchNextPlaces}
                showSpecificPlaces={this.showSpecificPlaces}/>
            </div>
            <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
                >
                <h3 className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
                    Place Detail
                </h3>
                <p className="site-description-item-profile-p">{placeDetail.name}</p>
                <Row>
                    <Col span={12}>
                    <DescriptionItem title="Full Name" content={placeDetail.name} />
                    </Col>
                    <Col span={12}>
                    <DescriptionItem title="Address" content={placeDetail.formattedAddress} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <DescriptionItem title="Rating" content={placeDetail.rating} />
                    </Col>
                    <Col span={12}>
                    <DescriptionItem title="Number of Rating users" content={placeDetail.userRatingsTotal} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <DescriptionItem title="Phone Number" content={placeDetail.internationalPhoneNumber} />
                    </Col>
                    <Col span={12}>
                    <DescriptionItem title="Website" content={placeDetail.website} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                    <DescriptionItem
                        title="Description"
                        content="Sorry, there is no description"
                    />
                    </Col>
                </Row>
                <Divider/>
                <List className="list"
                    itemLayout="horizontal"
                    size="small"
                    dataSource={placeDetail.photos}
                    renderItem={item => (
                        <List.Item
                          extra={<img width={575} alt="" src={item}/>}
                        >  
                        </List.Item>
                    )}
                />
                </Drawer>
          </div>
        )
    }
}


export default withRouter(CityDetails);