import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import './App.css';
import Header from './components/Header/Header';
import Account from './pages/Account/Account';
import Login from './pages/Login/Login';
import Rate from './pages/Rate/Rate';
import { getCurrentUser } from "./utils/requests/User";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Category from "./pages/Category/Category";
import EditProfile from "./pages/EditProfile/EditProfile";
import ViewApprentices from './pages/ViewApprentices/ViewApprentices';

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

export const UserContext = React.createContext({
  currentUser: {
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    role: ''
  },
  setCurrentUser(user: {}) {},
});

export const SessionContext = React.createContext({
  sessionToken: '',
  setSessionToken(token: string) {},
})


const App: React.FC = () => {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState<User>({id: '', email: '', firstname: '', lastname: '', role: ''});
  const [sessionToken, setSessionToken] = useState<string>('');

  useEffect(() => {
    const token = window.sessionStorage.getItem('ratingToken') ?? '';
    setSessionToken(token);
    if (sessionToken !== '') {
      getCurrentUser(sessionToken).then(response => {
        if (response.data) {
          setCurrentUser(response.data.me);
        } else {
          history.push('/login');
        }
      });
    }
  }, [history, sessionToken])

  return (
    <section className='App'>
        <SessionContext.Provider value={{ sessionToken, setSessionToken }}>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          {currentUser.email !== '' &&
            <Header />
          }
          <Switch>
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/rate'} component={Rate} />
            <Route exact path={'/manage'} component={AdminPanel} />
            <Route exact path={'/editProfile'} component={EditProfile} />
            <Route exact path={'/viewApprentices'} component={ViewApprentices} />
            <Route exact path={'/'} component={Account} />
            <Route exact path={'/category/:categoryID'} component={Category} />
            <Route exact path={'/apprentice/:apprenticeID'} component={Account} />
            <Route exact path={'/apprentice/:apprenticeID/category/:categoryID'} component={Category} />
            <Redirect from={'*'} to={'/404'} />
          </Switch>
        </UserContext.Provider>
        </SessionContext.Provider>
    </section>
  );
}

export default App;
