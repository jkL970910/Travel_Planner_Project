/*global google*/
import React, { Component } from "react";
import {withGoogleMap,withScriptjs,GoogleMap,DirectionsRenderer} from "react-google-maps";

class TestMap extends Component {
    constructor(){
      super();
      this.state = {
        direction: null,
        rending: false,
      };
  }

addWayPoints(places) {
  if (places === undefined) return [];
  var res = [];
  for (var i=1; i<places.length-1;i++) {
    // res.push({location: new google.maps.LatLng('placeId': places[i])})
    res.push({location: {'placeId': places[i]}})
  };
  return res;
}

componentDidMount () {
    const points = this.props.placeId.length<=2?null:this.addWayPoints(this.props.placeId);
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
        {
            origin: {
                'placeId': this.props.placeId[0]
              },
            destination: {
            'placeId': this.props.placeId[this.props.placeId.length-1]
            },
            waypoints: points,
            optimizeWaypoints: true,
            travelMode: this.props.transport,
        },
        (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                console.log(result)
                this.setState({
                    directions: result
                });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        }
    );
}

componentDidUpdate () {
    const points = this.props.placeId.length<=2?null:this.addWayPoints(this.props.placeId);
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
        {
            origin: {
                'placeId': this.props.placeId[0]
              },
            destination: {
            'placeId': this.props.placeId[this.props.placeId.length-1]
            },
            waypoints: points,
            optimizeWaypoints: true,
            travelMode: this.props.transport,
        },
        (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                console.log(result)
                this.setState({
                    directions: result
                });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        }
    );
}

render() {
    const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap
            center={{lat:36.77,lng:-119.41}}
            defaultZoom={5}
        >
            <DirectionsRenderer
                directions={this.state.directions}
            />
        </GoogleMap>
    ));

    return (
        <div>
            <GoogleMapExample
                containerElement={<div style={{ height: `650px`, width: "650px" }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
       );
    }
}

export default TestMap;