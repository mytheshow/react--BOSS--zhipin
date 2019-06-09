import {combineReducers} from 'redux';
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG,RECEIVE_MSG_LIST,MSG_READ} from '../actionTypes';

const init_state={
    userInit:{username:"",type:"",msg:"",redirectTo:""},
    initUserList:[],
    initChat:{
        chatMsgs: [], // 消息数组 [{from: id1, to: id2}{}]
        users: {}, // 所有用户的集合对象{id1: user1, id2: user2},获取头像
        unReadCount: 0 // 未读消息的数量
    }
};

function user(state=init_state.userInit,action){
    switch (action.type) {
        case AUTH_SUCCESS:
            const user = action.data;
            return {...user};
        case ERROR_MSG:
            const msg = action.data.msg;
            return {...state, msg};
        case RECEIVE_USER:
            return action.data;
        case RESET_USER:
            return {...init_state.userInit, msg: action.data};
        default:
            return state
    }

}

function userList (state=init_state.initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data;
        default:
            return state
    }
}

// 管理聊天相关信息数据的 reducer
function chat(state=init_state.initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG:
            var {chatMsg, userid} = action.data;
            return {
                chatMsgs: [...state.chatMsgs, chatMsg],//获取原state
                users: state.users,//所有的用户，获取头像
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to===userid ? 1 : 0)
            };
        case RECEIVE_MSG_LIST:
            var {chatMsgs, users, userid} = action.data;
            return {
                chatMsgs,
                users,
                unReadCount: chatMsgs.reduce((preTotal, msg) => { // 别人发给我的未读消息
                    return preTotal + (!msg.read&&msg.to===userid ? 1 : 0)
                }, 0)
            };
        case MSG_READ:
            const {count, from, to} = action.data;
            return {
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from===from && msg.to===to && !msg.read) {
// msg.read = true // 不能直接修改状态
                        return {...msg, read: true}
                    } else {
                        return msg
                    }
                }),
                users: state.users,
                unReadCount: state.unReadCount-count
            };
        default:
            return state
    }
}


let reducer=combineReducers({
    user,
    userList,
    chat
});

export default reducer;