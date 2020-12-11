import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Account from './pages/Account/Account';
import Login from './pages/Login/Login';
import Rate from './pages/Rate/Rate';
import AddUser from './pages/AddUser/AddUser';
import Requests from "./utils/Requests";
import AddCategory from "./pages/AddCategory/AddCategory";

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

export const AuthContext = React.createContext({
  loginSession: '',
  setLoginSession(accessToken: string) {},
});

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


const App: React.FC = () => {
  const [loginSession, setLoginSession] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User>({id: '', email: '', firstname: '', lastname: '', role: ''});
  const history = useHistory();

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    const token = window.sessionStorage.getItem('ratingToken');
    if (token) {
      if (isMounted) setLoginSession(token);
      Requests.getCurrentUser(token).then((r) => {
        const user = r.data.data;
        if (user == null) {
          if (history) history.push('/login');
        }
        if (isMounted && user) setCurrentUser(user.me);
      });
    }
    console.log("LOGIN TIME!");
    return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
  }, [loginSession]);

  return (
    <section className='App'>
      <AuthContext.Provider value={{ loginSession, setLoginSession }}>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <Router>
            {loginSession !== '' &&
              <Header />
            }
            <Switch>
              <Route exact path={'/login'} component={Login} />
              <Route exact path={'/rate'} component={Rate} />
              <Route exact path={'/addUser'} component={AddUser} />
              <Route exact path={'/addCategory'} component={AddCategory} />
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
