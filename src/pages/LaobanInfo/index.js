/*
老板信息完善路由组件
 */
import React from 'react';
import {NavBar, InputItem, TextareaItem, Button,List,WingBlank} from 'antd-mobile';
import  HeaderSelector from '../../components/Header-selector';
import {connect} from 'react-redux';
import {updateUser} from '../../store/actions';
import {Redirect} from 'react-router-dom';

class LaobanInfo extends React.Component{
    state = {
        header: '',
        info: '',
        position: '',
        salary: '',
        company: ''
    };
    setHeader = (header) => {
        this.setState({
            header
        })
    };
    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    };
    save = () => {
        // 分发异步action更新后台用户信息同时更新redux中的user状态
        this.props.updateUser(this.state)
        //console.log(this.state);
    };
    render() {
        // 如果用户信息已完善, 自动跳转到老板主界面
        if (this.props.header) {
            return <Redirect to='/laoban'/>
        }
        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <WingBlank>
                    <List>
                        <InputItem placeholder='招聘职位' onChange={value => this.handleChange('position', value)} >招聘职位:</InputItem>
                        <InputItem placeholder='公司名称'onChange={value => this.handleChange('company', value)} >公司名称:</InputItem>
                        <InputItem placeholder='职位薪资' onChange={value => this.handleChange('salary', value)} >职位薪资:</InputItem>
                        <TextareaItem title="职位要求:" placeholder='职位要求' rows={3} onChange={value => this.handleChange('info', value)} />
                        <Button type='primary' onClick={this.save}>保存</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(state => ({...state.user}), {updateUser})(LaobanInfo)