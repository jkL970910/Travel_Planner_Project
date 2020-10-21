import React, { Component } from 'react'
import { Layout, Menu, Dropdown, Button } from 'antd';
import { withRouter } from 'react-router-dom'
import '../../styles/Admin.css'
import Login from '../loginPage/Login';
import loginbg from '../../assets/picture/headerbg.png';

const { Header, Content, Footer } = Layout;

class Admin extends Component {
    constructor() {
        super();
        this.state=({
            pathname: '/Login',
        })
    }
    
    // function in order to transform page
    go=({ item, key, keyPath, domEvent }) => {  //路由跳转路径，通过onClick设置页面path
        this.props.history.push(key);
    }

    getUserName = (value) => {
        this.setState({
            username: value,
        })
    }

    changePath = (value) => {
        console.log(value)
        this.setState({
            pathname: value
        }, () => {
            this.props.history.push(value)
        })
    }

    test = () => {
        this.setState({
            pathname: 'MainPage'
        }, () => {
            this.props.history.push(this.state.pathname)
        })
    }

    // TODO: Logout func
    logout = () => {
        console.log('log out')
    }

    // TODO: implement Cutmoter Page button using router


    getUserName = (value) => {
        this.setState({
            username: value,
        })
    }

    changePath = (value) => {
        console.log(value)
        this.setState({
            pathname: value
        }, () => {
            this.props.history.push(value)
        })
    }

    test = () => {
        this.setState({
            pathname: 'MainPage'
        }, () => {
            this.props.history.push(this.state.pathname)
        })
    }

    // TODO: Logout func
    logout = () => {
        console.log('log out')
    }

    // TODO: implement Cutmoter Page button using router


    render() {
        const menu = (
            <Menu className='logMenu'>
              <Menu.ItemGroup title='Customer Center' className='logMenu-group'>
                <Menu.Item>Welcome - </Menu.Item>
                <Menu.Item><span onClick={this.logout}>Log out</span></Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title='Setting' className='logMenu-group'>
                <Menu.Item><span onClick={this.props.history.push}>Customer Page</span></Menu.Item>
              </Menu.ItemGroup>
            </Menu>
        );
        return <div>
            { this.state.pathname === '/Login' ? (
            <Layout>
                <Login sendPath={this.changePath} test={this.test} />
            </Layout>) : (
            <Layout>
                <Header className="header" style={{ opacity:'0.9', position:"fixed", zIndex: 1, width: '100%', height: "5%"}}>
                    <div className="logo" style={{ fontFamily: 'kaushan_scriptregular', color: '#FFF', marginTop: '-0.4%', marginLeft: '-2.5%' ,marginRight: '0.8%' }} >
                        Travel  Planner
                    </div>
                    <Menu theme='dark' mode="horizontal" style={{ opacity:'0.9', float: "left"}} selectedKeys={[this.props.history.location.pathname]} >
                        <Menu.Item key="/home/MainPage" onClick={this.go} >MainPage</Menu.Item>
                        <Menu.Item key="/home/Recommondation" onClick={this.go}  >Recommended Trip</Menu.Item>
                        <Menu.Item key="/home/CityDetails" onClick={this.go} >Trip Details</Menu.Item>
                        <Menu.Item key="/home/Itinary" onClick={this.go} >Itinary</Menu.Item>
                    </Menu>   
                    <div style={{ position: 'relative', float: 'right', paddingRight: '-10%', marginTop: '0.45%'}}>
                        <Dropdown overlay={menu} placement="topRight" >
                            <Button style={{ backgroundImage:'url(' + loginbg + ')', backgroundSize: '100%, 100%', position: 'absolute', paddingTop: '-5.1%' }} shape="circle" />
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        background: '#fff',
                        padding: 0,
                        marginTop: 0,
                        marginBottom: 0,
                        minHeight: 600,
                    }}
                >
                    <div className="layout-content" style={{
                        paddingBottom: 0,
                    }}>
                        {this.props.children} {/*渲染的二级路由页面,接收从<Admin>传回的子页面*/}
                    </div>
                </Content>
                <Footer className="footer" style={{ textAlign: 'center', padding: '12px' }}>
                        @2020 Created by Travel Planner Team
                </Footer>
            </Layout>)}
        </div>
    }
}

export default withRouter(Admin);
