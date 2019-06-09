import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter,Route,Switch} from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import store from './store';
import {Provider} from 'react-redux';
import './assets/css/index.less';

ReactDOM.render(<Provider store={store}>
    <HashRouter>
    <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route component={Main} />
    </Switch>
    </HashRouter>
</Provider>, document.getElementById('root'));

