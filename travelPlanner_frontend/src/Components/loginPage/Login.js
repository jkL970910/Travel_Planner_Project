import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Button, Icon, Form, Checkbox, Input, Modal, Drawer } from 'antd';
import '../../styles/Login.css';
import Axios from 'axios';
import { BACKEND_FORM_LOGIN_URL, BACKEND_THIRD_LOGIN_URL } from '../../constant';
import Register from './Register';
import bg from '../../assets/picture/loginbg.png';
import Cookies from 'universal-cookie';

class Login extends Component {
    
    constructor() {
        super();
        this.state = {
            visible: false,
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        })
    }

    onClose = () => {
        this.setState({ 
            visible: false,
        })
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    }

    toOtherRoute = (url) => {
        const urlObj = {
            pathname: `${url}`,
        }
        console.log(urlObj)
        this.props.sendPath(urlObj)
    }

    test = () => {
        this.props.test()
    }

    render() {
        return(
            <div className="login-form" >
                <LoginForm 
                    wrappedComponentRef={this.saveFormRef}
                    showDrawer={this.showDrawer}
                    toOtherRoute={this.toOtherRoute}
                    test={this.test}
                />
                <Drawer
                    title="Create a new account"
                    width={720}
                    onClose={this.onClose}
                    //visible={this.state.visible}
                    visible={this.state.visible}
                    drawerStyle={{backgroundColor: 'rgba(0,0,0,0.01)'}}
                    headerStyle={{backgroundColor: 'rgba(0,0,0,0.01)'}}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Register 
                        onClose={this.onClose}
                    />
                </Drawer>
            </div>
        );
    }
}

const LoginForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        constructor() {
            super();
            this.state = ({
                loading: false,
            })
        }
        
        // TODO: Waiting for backend test
        thirdPlacelogin = (msg) => {
            const url = `${BACKEND_THIRD_LOGIN_URL}/${msg}`
            console.log(url)
            Axios.get(url)
                .then(res => {
                    console.log(res)
                    //this.showStatus('Login Success', 'We wil go to the MainPage', true)
                }).catch( e => {
                    console.log('err in getting data back-> ', e.message);
                })
        }
        
        showStatus = (status, msg, loged) => {
            let secondsToGo = 2;
            const modal = Modal.success({
              title: `${status}`,
              content: `${msg}`,
            });
            setTimeout(() => {
              modal.destroy();
              if ( loged ) {
                  //this.props.sendUserName(username);
                  this.props.toOtherRoute('/home/MainPage');
              }
              this.setState({loading: false})
            }, secondsToGo * 1000);
        }
        
        handleSubmit = e => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if ( !err ) {
                    this.setState({
                        loading: true
                    }, () => {
                        console.log(values);
                        // formData is kind like queue, we need to use formData.get/append
                        // to see the data inside
                        const url = `${BACKEND_FORM_LOGIN_URL}`;
                        let data = {
                            'username' : values.username,
                            'password' : values.password
                        }

                        // send the formData to backend and validate
                        // set the header of post
                        Axios({
                            method:'post',
                            url:url,
                            data:data,
                            headers: {'Content-Type': 'application/json'}
                        })
                            .then(res => {
                                console.log(res)
                                const cookies = new Cookies();
                                cookies.set('tokens', res.data);
                                this.showStatus('Login Success', 'We wil go to the MainPage', true, values.username)
                            })
                            .catch( e => {
                                console.log('err in getting data back-> ', e.message);
                                this.showStatus('Login Failed', 'You have entered wrong username or password!', false);
                            })
                    })
                }
            });
        }
        
        render() {
            const IconFont = Icon.createFromIconfontCN({
                scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
            })
            const { form, showDrawer, test } = this.props;
            const { getFieldDecorator } = form;
            return (
                <div id='loginbox' style={styles.loginbox}>
                    <div id='backgroundBox' style={styles.backgroundBox} ></div>
                    <div id='title1' style={styles.title1} >
                        Start Your Journey 
                    </div>
                    <div id='title2' style={styles.title2} >
                        From Here
                    </div>
                    <div id='container' style={styles.container} >
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please input your username'}],
                                }) (
                                    <Input 
                                        prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, 0.25'}} />}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your password'}],
                                }) (
                                    <Input 
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, 0.25'}} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}  
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                }) (<Checkbox style={{color: '#DDD'}} className="login-remember">Remember me</Checkbox>)}
                                <div className="icons-list">
                                    <a style={{color: '#3399FF'}}>Log in with: </a>
                                    <IconFont type="icon-facebook" style={{color: '#DDD', padding: '5px', fontSize: '20px'}} onClick={() => this.thirdPlacelogin('facebook')} />
                                    <IconFont type="icon-github" style={{color: '#DDD', fontSize: '20px'}} onClick={() => this.thirdPlacelogin('github')} />
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Button  htmlType="submit" className="login-form-button" loading={this.state.loading} ghost fontSize="large">
                                    Log in
                                </Button>
                                <a style={{color: '#DDD'}} onClick={() => showDrawer()}>Or register now!</a>
                                <a style={{color: '#DDD', paddingLeft: '10px'}} onClick={() => test()}>test</a>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            );
        }
    },
);

const styles = {
    loginbox: {
        display: 'flex',
    },
    backgroundBox: {
        zIndex: '0',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundImage: 'url(' + bg + ')',
        backgroundSize: '100%, 100%',
    },
    title1: {
        fontFamily: "kaushan_scriptregular",
        fontSize: '400%',
        color: '#CCC',
        zIndex: '1',
        position: 'fixed',
        marginTop: '10%',
        left: '21%',
        width: '1000px',
        height: '100px',
    },
    title2: {
        fontFamily: "kaushan_scriptregular",
        fontSize: '400%',
        color: '#CCC',
        zIndex: '1',
        position: 'fixed',
        marginTop: '15%',
        left: '34%',
        width: '1000px',
        height: '100px',
    },
    container: {
        marginTop: '430px',
    }
}

export default withRouter(Login);