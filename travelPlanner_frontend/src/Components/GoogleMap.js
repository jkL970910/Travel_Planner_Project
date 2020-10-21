/*global google*/
import {Map, InfoWindow, Marker, GoogleApiWrapper, DirectionsRenderer} from 'google-maps-react';
import React, {Component} from 'react';
import MapDirectionsRenderer from './MapDirectionsRenderer';

class GoogleMap extends Component {
  constructor(){
    super();
    this.state = {
      showingInfoWindow: false,  // Hides or shows the InfoWindow
      activeMarker: {},          // Shows the active marker upon click
      selectedPlace: {name: "locationA"},          // Shows the InfoWindow to the selected place upon a marker
      initialCenter: {lat: 47.444, lng: -122.176},
    };
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  onGeneratePin=(names,lats,lons)=>{
    var res = []
    for (var i=0; i<names.length; i++) {
      res.push(this.onGenerateMarker(names, lats, lons, i));
      res.push(this.onGenerateInfo());
    }
    return res;
  }

  onGenerateMarker=(names,lats,lons,i)=>{
    return (
    <Marker
          id={i}
          onClick={this.onMarkerClick}
          name={names[i]}
          position={{lat: lats[i], lng: lons[i]}}
    >
    </Marker>)
  }
  onGenerateInfo=()=>{
    return (
      <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
        <div>
          <h4>{this.state.selectedPlace.name}</h4>
        </div>
      </InfoWindow>
    )
  }

  render() {
    const siteNameList = this.props.nameList;
    const latList = this.props.latList;
    const lonList = this.props.lonList;
    const mapCenter = latList.length>0?this.props.mapCenter:this.state.initialCenter;

    const places = [
      {lat: 25.8103146,lng: -80.1751609},
      {lat: 27.9947147,lng: -82.5943645},
      {lat: 28.4813018,lng: -81.4387899},
    ]

    const mapStyles = {
      width: "80%",
      height: "80%",
    };

    return (
      <div>
        <Map
        google={this.props.google}
        zoom={10}
        style={mapStyles}
        initialCenter = {this.state.initialCenter}
        center={mapCenter}
        >
          {this.onGeneratePin(siteNameList,latList,lonList)}
          {/* <MapDirectionsRenderer places={places} travelMode={window.google.maps.TravelMode.DRIVING} /> */}

          {/* <Polyline
            path={places}
            geodesic= {true}
            strokeColor= '#FF0000'
            strokeOpacity= {1.0}
            strokeWeight= {2}
          /> */}

        </Map>
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyB5Aextt4PuSqpd0F0_fHMY95iTZYA5OkY'
})(GoogleMap);

