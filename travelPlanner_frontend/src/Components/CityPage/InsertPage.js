import React, {Component} from 'react';
import {Checkbox, Button, Avatar} from 'antd';


class InsertPage extends Component {
    constructor(){
        super();
        this.state = {
            interest: "",
        }

    }

    onChangeInterest = checkedValue => {
        this.setState({
          interest: checkedValue,
        });
        console.log(checkedValue);
    };

    searchPlace = () => {
        this.props.submit(this.state);
    }
    render(){
        const cityInterest = this.props.cityInfo? this.props.cityInfo.interest: [];
 
        return(   
            <div className="insert-box"> 
                <div className='interest'>Please Select Your Interest</div>
                <div >
                <Checkbox.Group className="options"
                 options = {cityInterest}
                    onChange = {this.onChangeInterest}></Checkbox.Group>
                </div>
                <div className="buttonSearch">
                <Button className="search-place-btn"
                onClick = {this.searchPlace}>Search Places</Button>
                </div>
            </div>
        );
    }

}
export default InsertPage;