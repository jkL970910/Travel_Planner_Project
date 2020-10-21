import React, { Component } from 'react';
import { Button, Modal, Form, Input } from 'antd';

class SearchInfo extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            cityName: ' ',
            stateName: ' ',
            searchString: ' ',
        }
    }

    // sent form to MainPage
    updatePlace = () => {
        this.setState({
            searchString: this.state.cityName + '  ' + this.state.stateName
        }, () => {
            this.props.sentPlace(this.state.searchString)
        })
    }

    // show the Search Window
    showModal = () => {
        this.setState({
             visible: true 
        });
    };

    // cancel the search window
    handleCancel = () => {
        this.setState({ 
            visible: false
        });
    };

    // submit the input info and reset the form
    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ 
                visible: false,
                cityName: values.city,
                stateName: values.state 
            }, () => {this.updatePlace()});
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        return(
            <div className="search-box" style={{paddingTop: 82}}>
                <Button 
                    onClick={this.showModal} 
                    loading={this.props.loading} 
                    size="large"
                    ghost
                >
                    Start Your Journey
                </Button>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}


// generate form
const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
      render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Enter Your Interested Place"
                    okText="Go"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="City Name">
                            {getFieldDecorator('city', {
                            rules: [{ required: true, message: 'Please input a City!' }],
                            })(<Input 
                                placeholder="Enter a City (eg: Tampa)" 
                            />)}
                        </Form.Item>
                        <Form.Item label="State Name">
                            {getFieldDecorator('state', {
                            rules: [{ required: true, message: 'Please input a City!' }],
                            })(<Input 
                                    type="textarea" 
                                    placeholder="Enter a State (eg: FL)"
                                />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export default SearchInfo;