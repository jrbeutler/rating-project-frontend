import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Account from './pages/Account/Account';
import Login from './pages/Login/Login';
import Rate from './pages/Rate/Rate';

type User = {
  id: string;
  email: string;
}

export const AuthContext = React.createContext({
  loginSession: '',
  setLoginSession(accessToken: string) {},
});

export const UserContext = React.createContext({
  currentUser: {
    id: '',
    email: '',
  },
  setCurrentUser(user: {}) {},
});


const App: React.FC = () => {
  const [loginSession, setLoginSession] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User>({id: '', email: ''});

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
            <Header />
            <Switch>
              <Route exact path={'/login'} component={Login} />
              <Route exact path={'/rate'} component={Rate} />
              <Route exact path={'/'} component={Account} />
              <Redirect from={'*'} to={'/404'} />
            </Switch>
          </Router>
        </UserContext.Provider>
      </AuthContext.Provider>
    </section>
  );
}

export default App;
