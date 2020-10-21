import React, {Component} from 'react';
import LoadMap from './LoadMap';



class SelectInfo extends Component {
    selectedPlace = (value) => {
        this.props.sentPlace(value);
    }

    render() {
        return(
            <div >
                <LoadMap selectPlace = {this.selectedPlace} />
            </div>
        );
    }
}

export default SelectInfo;