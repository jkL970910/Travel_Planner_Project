import React from 'react';
//import echarts from 'echarts/lib/echarts';
import echarts from 'echarts';
import america from '../../assets/Echarts/america.json';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import { Card, Modal } from 'antd';
import LApic from '../../assets/picture/LApic.png';
import SApic from '../../assets/picture/SApic.png';
import TMpic from '../../assets/picture/TMpic.png';


const { Meta } = Card;
class LoadMap extends React.Component {
    constructor() {
        super();
        this.state = {
            chosen: undefined,
            cityname: undefined,
            statename: undefined,
            visible: false,
            imgUrl: undefined,
            description: undefined,
        }
    }

    componentDidMount() {
        this.initalECharts();
    }

    updatePlace = (value) => {
        this.props.selectPlace(value);
    }

    initalECharts() {
        // 需要显示名字的place
        echarts.registerMap('USA', america, {
            Alaska: {              // 把阿拉斯加移到美国主大陆左下方
                left: -131,
                top: 25,
                width: 15
            },
            Hawaii: {
                left: -110,        // 夏威夷
                top: 28,
                width: 5
            },
            'Puerto Rico': {       // 波多黎各
                left: -76,
                top: 26,
                width: 2
            }
        });
        
        const myChart = echarts.init(document.getElementById('map'));
        let option = {
            title: {
                text: 'Select A Recommended Area You Are Interested',
                left: 'center',
                textStyle : {
                    color: '#FFF'
                },
                top: '10'
            },
            // 热力图（未显示）
            visualMap: {
                left: 'right',
                min: 0,
                max: 3000,
                color: ['orangered','yellow','lightskyblue'],
                text:['Liked',''],           // 文本，默认为数值文本
                textStyle : {
                    color: '#FFF'
                },
                itemWidth: '30',
                itemHeight: '160',
                show: true //热力图的映射条
            },
            //鼠标悬浮信息栏
            tooltip: {
                show: true,
                trigger: 'item',
                showContent: true,
                triggerOn: 'mousemove',
                hideDelay: 100,
                backgroundColor: 'rgb(50,50,50,0.7)',
                textStyle: {
                    fontStyle: 'normal',
                    fontWeight: 'bold'
                },
                formatter: '{a0}: <br />{b0}<br />Liked: {c0}'
            },
            //左侧工具栏
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'left',
                top: 'top',
                itemSize: 15,
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [
                {
                    name: 'Recommended For',
                    type: 'map',
                    roam: 'move', // 地图缩放scale 移动scale 均开启true
                    map: 'USA',
                    zoom: 1.5,
                    itemStyle:{
                        opacity: 0.9,
                        areaColor:'rgb(128,128,128,0.5)',
                        emphasis:{
                            label:{
                                show:true,
                                fontStyle:'italic',
                                fontWeight: 'bold'
                            },
                            areaColor:'rgb(255,250,205,0.5)',
                        }
                    },
                    // 文本位置修正
                    textFixed: {
                        Alaska: [0, 0]
                    },
                    data:[ //value为海拔高度，可update为用户喜爱程度
                        {name: 'Alabama', value: 480},
                        {name: 'Alaska', value: 73},
                        {name: 'Arizona', value: 650},
                        {name: 'Arkansas', value: 294},
                        {name: 'California', value: 2880},
                        {name: 'Colorado', value: 518},
                        {name: 'Connecticut', value: 359},
                        {name: 'Delaware', value: 91},
                        {name: 'District of Columbia', value: 63},
                        {name: 'Florida', value: 2742},
                        {name: 'Georgia', value: 991},
                        {name: 'Hawaii', value: 139},
                        {name: 'Idaho', value: 159},
                        {name: 'Illinois', value: 1287},
                        {name: 'Indiana', value: 653},
                        {name: 'Iowa', value: 307},
                        {name: 'Kansas', value: 288},
                        {name: 'Kentucky', value: 438},
                        {name: 'Louisiana', value: 460},
                        {name: 'Maine', value: 132},
                        {name: 'Maryland', value: 588},
                        {name: 'Massachusetts', value: 664},
                        {name: 'Michigan', value: 988},
                        {name: 'Minnesota', value: 537},
                        {name: 'Mississippi', value: 298},
                        {name: 'Missouri', value: 602},
                        {name: 'Montana', value: 100},
                        {name: 'Nebraska', value: 185},
                        {name: 'Nevada', value: 275},
                        {name: 'New Hampshire', value: 132},
                        {name: 'New Jersey', value: 886},
                        {name: 'New Mexico', value: 208},
                        {name: 'New York', value: 1234},
                        {name: 'North Carolina', value: 975},
                        {name: 'North Dakota', value: 69},
                        {name: 'Ohio', value: 1154},
                        {name: 'Oklahoma', value: 381},
                        {name: 'Oregon', value: 389},
                        {name: 'Pennsylvania', value: 1276},
                        {name: 'Rhode Island', value: 105},
                        {name: 'South Carolina', value: 472},
                        {name: 'South Dakota', value: 83},
                        {name: 'Tennessee', value: 645},
                        {name: 'Texas', value: 2605},
                        {name: 'Utah', value: 285},
                        {name: 'Vermont', value: 62},
                        {name: 'Virginia', value: 818},
                        {name: 'Washington', value: 689},
                        {name: 'West Virginia', value: 185},
                        {name: 'Wisconsin', value: 572},
                        {name: 'Wyoming', value: 57},
                        {name: 'Puerto Rico', value: 366}
                    ]
                }
            ]
        };
    
        // load the Map
        myChart.setOption(option);

        // set the description Cart for each recommond city
        // California
        myChart.on('click', {seriesIndex: 0, name: 'California'}, () => {
           this.setState({
               visible: true,
               cityname: 'Los Angeles',
               statename: 'California',
               chosen: 'Los Angeles  CA',
               imgUrl: LApic,
               description: 'Description for Los Angeles',
           })
        })

        // Texas
        myChart.on('click', {seriesIndex: 0, name: 'Texas'}, () => {
            this.setState({
                visible: true,
                cityname: 'San Antonio',
                statename: 'Texas',
                chosen: 'San Antonio  TX',
                imgUrl: SApic,
                description: 'Description for San Antonio',
            })
        })

        // Florida
        myChart.on('click', {seriesIndex: 0, name: 'Florida'}, () => {
            this.setState({
                visible: true,
                cityname: 'Tampa',
                statename: 'Florida',
                chosen: 'Tampa  FL',
                imgUrl: TMpic,
                description: 'Description for Tampa',
            })
        })
    }

    onCancel = () => {
        this.setState({
            visible: false,
        })
    }

    onCreate = () => {
        this.setState({
            visible: false
        }, () => {
            this.updatePlace(this.state.chosen)
        })
    }
    
    
    render() {
        return (
            <div id="map" style={
                { 
                    width: 1920, 
                    height: 770, 
                    marginTop: 32, 
                }
            }
            >
                <Modal
                    title={"Recommend For "+ `${this.state.statename}` + ' : ' + `${this.state.cityname}`} 
                    okText="Go"
                    visible={this.state.visible}
                    onCancel={this.onCancel}
                    onOk={this.onCreate}
                >
                    <Card
                        hoverable
                        style={{ width: 340, marginLeft: '13%' }}
                        cover={<img alt="example" src={`${this.state.imgUrl}`} />}
                    >
                        <Meta title={`${this.state.cityname}`} description={`${this.state.description}`} />
                    </Card>
                </Modal>
            </div>
            
        );
    }
}

export default LoadMap;