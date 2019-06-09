import {createStore, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from './reducer';
import {composeWithDevTools} from 'redux-devtools-extension';

let store = createStore(reducer,composeWithDevTools(applyMiddleware(reduxThunk)));
export default store;