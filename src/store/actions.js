import {reqLogin,reqRegister,reqUpdateUser,reqUser,reqUserList,reqChatMsgList,reqReadChatMsg} from '../api/index';
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ} from './actionTypes';
import {getRedirectPath} from '../utils';
import io from 'socket.io-client';


// 注册/登陆失败的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data:{msg}});
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg});
// 接收消息列表的同步 action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data:
        {users, chatMsgs, userid}});
// 接收消息的同步 action
//const receiveMsg = (chatMsg, isToMe) => ({type: RECEIVE_MSG, data: {chatMsg, isToMe}});
// 读取了消息的同步 action
const msgRead = ({from, to, count}) => ({type: MSG_READ, data: {from, to, count}});

export let userLogin= (username,password)=>{
    if(!username) {  // 必须分发一个同步action对象
        return errorMsg('必须指定用户名') // 此时 return代表结束
    } else if (!password) {
        return errorMsg('必须指定密码')
    }

   return async dispatch=>{
        let result = await reqLogin(username,password);
        if(parseFloat(result.data.code)===0){
            getMsgList(dispatch,result.data.data._id);
            dispatch({
                type:AUTH_SUCCESS,
                data:{username:result.data.data.username, type:result.data.data.type,redirectTo:getRedirectPath(result.data.data.type)}
            })
        }else{
            dispatch({
                type:ERROR_MSG,
                data:{msg:result.data.msg}
            })
        }
    }
};

export let userRegister= ({username,password,password2,type})=>{
    // 前台表单验证
    if(!username) {  // 此时本质是同步action
        return errorMsg('必须指定用户名')
    } else if (!password) {
        return errorMsg('必须指定密码')
    } else if (password2!==password) {
        return errorMsg('密码必须一致')
    } else if (!type) {
        return errorMsg('必须指定用户类型')
    }
    return async dispatch=>{
        let result = await reqRegister({username,password,type});
        if(parseFloat(result.data.code)===0){
            getMsgList(dispatch,result.data.data._id);
            dispatch({
                type:AUTH_SUCCESS,
                data:{username:result.data.data.username, type:result.data.data.type,redirectTo:getRedirectPath(result.data.data.type)}
            })
        }else{
            dispatch({
                type:ERROR_MSG,
                data:{msg:result.data.msg}
            })
        }
    }
};

/*
更新用户的异步action
 */
export function updateUser(user) {
    return async dispatch => {
        const response = await reqUpdateUser(user);
        const result = response.data;
        if(result.code===0) { // 更新用户成功
            const user = result.data;
            dispatch({type: RECEIVE_USER, data: user})
        } else { // 更新失败
            const msg = result.msg;
            dispatch({type: RESET_USER, data: msg})
        }
    }
}

/*
获取当前用户的异步action,自动登陆
 */
export function getUser() {
    return async dispatch => {
        // 发ajax请求, 获取user
        const response = await reqUser();
        const result = response.data;
        // 分发同步action
        if(result.code===0) {// 成功得到user
            getMsgList(dispatch,result.data._id);
            dispatch({type: RECEIVE_USER, data: result.data})
        } else { // 失败
            dispatch({type: RESET_USER, data: result.msg})
        }
    }
}

/*
获取用户列表的异步action
 */
export function getUserList(type) {
    return async dispatch => {
        const response = await reqUserList(type);
        const result = response.data;
        if(result.code===0) {
            const userList = result.data;
            dispatch({type: RECEIVE_USER_LIST, data: userList})
        }
    }
}



/*初始化客户端 socketio
1. 连接服务器
2. 绑定用于接收服务器返回 chatMsg 的监听
*/
function initIO(dispatch, userid) {
    if(!io.socket) {
        io.socket = io('ws://localhost:3001');
        //监听服务器发过来的消息
        io.socket.on('receiveMsg', (chatMsg) => {
            //我发的或者发给我的
            if(chatMsg.from===userid || chatMsg.to===userid) {
                let isToMe = (chatMsg.to === userid);
                dispatch({type: RECEIVE_MSG, data: {chatMsg, isToMe}});
            }
        })
    }
}

/*
发送消息的异步 action
发给服务器后保存
*/
export const sendMsg = ({from, to, content}) => {
    //链接服务器
    // if(!io.socket) {
    //     //     io.socket = io('ws://localhost:3001');
    //     // }
    return async dispatch => {
        io.socket.emit('sendMsg', {from, to, content});
    }
};

/*获取当前用户相关的所有聊天消息列表，服务器那边通过cookie获取的当前用户的_id
(在注册!登陆!获取用户信息成功后调用)
*/
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid);//链接服务器，监听服务器的回应
    const response = await reqChatMsgList();
    const result = response.data;
    if(result.code===0) {

        const {chatMsgs, users} = result.data;
        dispatch({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}})
    }
}


/*更新读取消息的异步 action
*/
export const readMsg = (userid) => {
    return async (dispatch, getState) => {
        const response = await reqReadChatMsg(userid);
        const result = response.data;
        if(result.code===0) {
            const count = result.data;
            const from = userid;
            const to = getState().user._id;
            dispatch(msgRead({from, to, count}))
        }
    }
};

