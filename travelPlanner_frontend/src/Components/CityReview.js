import React, {Component} from 'react';
import 'antd/dist/antd.css';
// import './index.css';
import { Card } from 'antd';

export default class CityReview extends Component{
    // constructor(){
    //     super();
    //     this.state = {

    //     }
    // }

    render() {
        const info = this.props.reviews;
        return (
            <div className = "CityReview">
                <div className = "reviewDisplay">

                <Card size="small" title="City Review"  style={{ width: 300 }}>
                    <p>{info.city} {info.state} {info.country}</p>
                    <p>some images???</p>
                    <p>{info.review}</p>
                </Card>
                
                </div>
            </div>

        )
    }
}