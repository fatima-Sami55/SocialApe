import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED, SET_SERVER_ERROR } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// Components
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/layout/ErrorBoundary';
import themeObject from './util/theme';
import AuthRoute from './util/AuthRoute';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

// Lazy load pages for optimized loading speed and visual user feedback
const home = React.lazy(() => import('./pages/home'));
const login = React.lazy(() => import('./pages/login'));
const signup = React.lazy(() => import('./pages/signup'));
const user = React.lazy(() => import('./pages/user'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const LazyLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <CircularProgress size={60} thickness={4} style={{ color: '#1D9BF0' }} />
  </div>
);



const theme = createMuiTheme(themeObject);

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://api-3ygbceyoja-el.a.run.app';  

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response || error.response.status === 500) {
      store.dispatch({ type: SET_SERVER_ERROR });
    }
    return Promise.reject(error);
  }
);

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <Router>
              <AppLayout>
                <React.Suspense fallback={<LazyLoader />}>
                  <Switch>
                    <Route exact path="/" component={home} />
                    <AuthRoute exact path="/login" component={login} />
                    <AuthRoute exact path="/signup" component={signup} />
                    <Route exact path="/users/:handle" component={user} />
                    <Route
                      exact
                      path="/users/:handle/scream/:screamId"
                      component={user}
                    />
                    <Route component={NotFound} />
                  </Switch>
                </React.Suspense>
              </AppLayout>
            </Router>
          </Provider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

export default App;