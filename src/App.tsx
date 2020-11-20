import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Account from './pages/Account/Account';
import Login from './pages/Login/Login';
import Rate from './pages/Rate/Rate';

export const AuthContext = React.createContext({
  loginSession: '',
  setLoginSession(accessToken: string) {},
});

export const UserContext = React.createContext({
  currentUser: {},
  setCurrentUser(user: {}) {},
});


const App: React.FC = () => {
  const [loginSession, setLoginSession] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<Object>({});

  const getAuthToken = () => {
    const token = window.sessionStorage.getItem('ratingToken');
    return token ? setLoginSession(token) : null;
  }

  useEffect(() => {
    getAuthToken();
  });

  return (
    <section className='App'>
      <AuthContext.Provider value={{ loginSession, setLoginSession }}>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <Router>
            <Switch>
              <Route exact path={'/'} component={Account} />
              <Route exact path={'/login'} component={Login} />
              <Route exact path={'/rate'} component={Rate} />
              <Redirect from={'*'} to={'/'} />
            </Switch>
          </Router>
        </UserContext.Provider>
      </AuthContext.Provider>
    </section>
  );
}

export default App;
