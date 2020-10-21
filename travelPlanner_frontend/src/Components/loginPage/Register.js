import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Button, Icon, Modal, Form, Input, Tooltip, Select, AutoComplete } from 'antd';
import '../../styles/Register.css';
import Axios from 'axios';
import { BACKEND_FORM_REGISTER_URL } from '../../constant'

class Register extends Component {
    
    saveFormRef = formRef => {
        this.formRef = formRef;
    }

    onClose = () => {
        this.props.onClose();
    }

    render() {
        return(
            <div className="login-form" >
                <RegisterForm 
                    wrappedComponentRef={this.saveFormRef}
                    Option={Select.Option}
                    onClose={this.onClose}
                    AutoCompleteOption={AutoComplete.Option}
                />
            </div>
        );
    }
}

class Reference extends React.Component {
    constructor() {
        super();
        this.state = ({
            duration: ' ',
            transports: ' ',
            interests: ' ',
            data: ' '
        })
    }

    setData = () => {
        this.setState({
            data: [this.state.duration, this.state.transports, this.state.interests]
        }, () => {
            this.props.onChange(this.state.data)
        })
    }
    
    transportChange = (value) => {
        this.setState({
            transports: value
        }, () => {this.setData()})
    }

    durationChange = (value) => {
        this.setState({
            duration: value
        }, () => {this.setData()})
    }

    interestsChange = (value) => {
        this.setState({
            interests: value
        }, () => {this.setData()})
    }
    
    render() {
        const { Option } = Select;
        const transports = [];
        transports.push(<Option key={'Walking'}>{'Walking'}</Option>);
        transports.push(<Option key={'Bicycle'}>{'Bicycle'}</Option>);
        transports.push(<Option key={'Subway'}>{'Subway'}</Option>);
        transports.push(<Option key={'Vehicle'}>{'Vehicle'}</Option>);

        const interests = [];
        interests.push(<Option key={'A'}>{'A'}</Option>);
        interests.push(<Option key={'B'}>{'B'}</Option>);
        interests.push(<Option key={'C'}>{'C'}</Option>);
        interests.push(<Option key={'D'}>{'D'}</Option>);

        return(
            <div>
                <Select 
                    defaultValue="Duration" 
                    style={{ width: '100%' }} 
                    onChange={this.durationChange}
                >
                    <Option value="1-3 Days">1-3 Days</Option>
                    <Option value="3-5 Fays">3-5 Days</Option>
                    <Option value="5-7 Days">5-7 Days</Option>
                    <Option value="7+ Days">7+ Days</Option>
                </Select>
                <Select  
                    mode="multiple"
                    style={{ width: '100%' }} 
                    placeholder="Transport"
                    onChange={this.transportChange}
                >
                    {transports}
                </Select>
                <Select  
                    mode="multiple"
                    style={{ width: '100%' }} 
                    placeholder="Interests"
                    onChange={this.interestsChange}
                >
                    {interests}
                </Select>
            </div>
        );
    }
}

const RegisterForm = Form.create()(
    class extends React.Component {
        state = {
            confirmDirty: false,
            autoCompleteResult: [],
            loading: false,
        };

        showSuccess = (username) => {
            let secondsToGo = 2;
            const modal = Modal.success({
              title: 'Successful register! You username is '+`${username}`,
              content: 'go back and log in!',
            });
            setTimeout(() => {
              modal.destroy();
              this.props.onClose();
            }, secondsToGo * 1000);
        }

        showFailure = (res) => {
            let secondsToGo = 2;
            const modal = Modal.success({
              title: 'Failure register! Username ' + `${res}`+' is already existed.',
              //title: 'Successful register! You username is '+`${res.username}`,
              content: 'Change Your Username and Try Again!',
            });
            setTimeout(() => {
              modal.destroy();
              this.props.onClose();
            }, secondsToGo * 1000);
        }
        
        handleSubmit = e => {
            e.preventDefault();
            const url = `${BACKEND_FORM_REGISTER_URL}`
            this.setState({loading: true})
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    console.log(url)
                    Axios.post(url, values)
                        .then( res => {
                            console.log(res, values);
                            this.showSuccess(values.username)
                        })
                        .catch( e => {
                            console.log('err in getting data back-> ', e.message);
                            if (e.message === 'Request failed with status code 400') {
                                this.showFailure(values.username)
                            }
                        })
                        .finally(this.setState({loading: false}))
                }
            });
        };
        
        handleConfirmBlur = e => {
            const { value } = e.target;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        };
        
        compareToFirstPassword = (rule, value, callback) => {
            const { form } = this.props;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        };
        
        validateToNextPassword = (rule, value, callback) => {
            const { form } = this.props;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            } 
            callback();
        };
        
        handleWebsiteChange = value => {
            let autoCompleteResult;
            if (!value) {
                autoCompleteResult = [];
            } else {
                autoCompleteResult = ['@gmail.com', '@qq.com', '@163.com', '@hotmai.com' ].map(domain => `${value}${domain}`);
            }
            this.setState({ autoCompleteResult });
        };
      
        render() {
            const { Option, AutoCompleteOption, onClose } = this.props;
            const { getFieldDecorator } = this.props.form;
            const { autoCompleteResult } = this.state;
        
            const formItemLayout = {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
            };
            const tailFormItemLayout = {
                wrapperCol: {
                    xs: {
                        span: 24,
                        offset: 0,
                    },
                    sm: {
                        span: 16,
                        offset: 8,
                    },
                },
            };
            const prefixSelector = getFieldDecorator('prefix', {
                initialValue: '01',
            })(
                <Select style={{ width: 70 }}>
                    <Option value="01">+01</Option>
                    <Option value="86">+86</Option>
                </Select>,
            );
        
            const mailAddress = autoCompleteResult.map(mailAddress => (
                <AutoCompleteOption key={mailAddress}>{mailAddress}</AutoCompleteOption>
            ));
        
            return (
                <Form className="register-form" {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Username">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Password" hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>
                    <Form.Item label="Phone Number">
                        {getFieldDecorator('phone', {
                            rules: [{ required: false, message: 'Please input your phone number!' }],
                        })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item label="Email">
                        {getFieldDecorator('email', {
                            rules: [{ required: false}],
                        })(
                            <AutoComplete
                                dataSource={mailAddress}
                                onChange={this.handleWebsiteChange}
                            >
                                <Input />
                            </AutoComplete>,
                        )}
                    </Form.Item>
                    <Form.Item 
                        label={
                            <span>
                                Preference&nbsp;
                                <Tooltip title="Choose your preferences: It may help us design Your Special Trip!">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator('Preference', {
                            initialValue: [],
                            rules: [
                                { type: 'array', required: false },
                            ],
                        })(<Reference 
                                getData={this.setData} 
                            />)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading} >
                            Register Now
                        </Button>
                    </Form.Item> 
                    <a onClick={() => onClose()}>back to Login</a>
                </Form>
            );
        }
    }
);

export default withRouter(Register);