import React, {Component} from 'react';
import { List, Avatar, Button, Checkbox, InputNumber} from 'antd';


class PlaceList extends Component {
    constructor(){
        super();
        this.state = {
            duration: 0,
            pageNumber: 1,
            transportation: [],
            selectedPlaces: [],
            disabledPrevious: true,
        }
    }
    

    onChangeDuration = insertValue => {
        if(insertValue > 15) {
            insertValue = 15;
        } else if( insertValue < 0) {
            insertValue = 1;
        }
        this.setState({
          duration: insertValue,
        });
    };

    addOrRemovePlace = (selectedPlace, isSelected) => {
        let list = this.state.selectedPlaces;
        if(isSelected) {
            list.push(selectedPlace);
        } else {
            list = list.filter(list => list !== selectedPlace);
        }
        console.log(list);
        this.setState ({
            selectedPlaces: list,
        })
    }
    
    onChangeBox = setting => {
        this.addOrRemovePlace(setting.target.value, setting.target.checked);
    }

    onChangeTransp = (checkedValue) => {
        this.setState({
            transportation: checkedValue,
        })
      }

    designTour = () => {
        this.props.designTour(this.state.selectedPlaces, this.state.duration, this.state.transportation);
        if(this.props.successDesign) {
            this.setState({
                selectedPlaces: [],
                duration: 0,
            })
        }
    }

    previousPage = () => {
        //=2是因为setstate会在之后触发，现在还没有减页数就是2，减了之后就是
        if(this.state.pageNumber === 2) {
            this.setState({
                disabledPrevious: true,
            })
        }
        this.setState({
            pageNumber: this.state.pageNumber - 1,
        })
        this.props.previousPage(this.state.pageNumber);
    }

    nextPage = () => {
        this.props.nextPage(this.state.pageNumber);
        this.setState({
            pageNumber: this.state.pageNumber + 1,
            disabledPrevious: false,
        })
    }

    getSpecificPlaces = (setting) => {
        this.props.showSpecificPlaces(setting.target.value);
    }


    render(){
        const cityTransp = this.props.cityInfo? this.props.cityInfo.transportation: [];
        const placeList = this.props.placeInfo ? this.props.placeInfo : [];
        return(
            <div >
                <div className="info-collector">
                    <div className="Duration">
                        <label>Duration: </label>
                        <InputNumber
                            min={0}
                            max={15}
                            defaultValue={0}
                            disabled = {this.props.placeSearched}
                            style={{margin: "0 2px"}}
                            onChange={this.onChangeDuration}
                        />
                        <label>days  (1-15)</label>
                    </div>
                    <br/>
                    <label>Transportation: </label>
                    <Checkbox.Group options = {cityTransp} 
                    disabled = {this.props.placeSearched}
                    onChange = {this.onChangeTransp}></Checkbox.Group>
                    <br/>
                    <Button className = "design-btn" 
                    disabled = {this.props.placeSearched}
                    onClick = {this.designTour}>Desgin Your Own Tour</Button>
                </div>
                <div className="place-list-box">
                <label className="interest">Please Select Your Desired Places</label>
                <List className="list"
                    itemLayout="horizontal"
                    size="large"
                    dataSource={placeList}
                    renderItem={item => (
                        <List.Item
                            actions={[<Checkbox dataInfo={item} 
                                defaultChecked = {false} 
                                checked = {this.state.selectedPlaces.includes(item.placeId)}
                            onChange={this.onChangeBox}
                            value = {item.placeId}/>]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar shape="square" size={150} src = {item.photos} />}
                                title={<h6 className="listItem">{item.name}</h6>}
                                description={<Button value={item.placeId} onClick={this.getSpecificPlaces}>
                                    Show specific information</Button>}
                            />  
                        </List.Item>
                    )}
                />
                </div>
                <div>
                    <Button disabled = {this.state.disabledPrevious} 
                    onClick ={this.previousPage}>previousPage</Button>
                    <Button disabled = {this.props.disabledNext}
                    onClick={this.nextPage}>nextPage</Button>
                </div>
                <br/>
            </div>
        );
    }
}
export default PlaceList;