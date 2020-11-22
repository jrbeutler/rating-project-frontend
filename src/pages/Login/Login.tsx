import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Requests from '../../utils/Requests';
import AppPreviewPanel from '../../components/AppPreviewPanel/AppPreviewPanel';
import { AuthContext, UserContext } from '../../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();

  const submitLogin = () => {
    let results;
    Requests.login(email, password).then((r) => {
      results = r.data;
      if (results.data == null) {
        //Show Error Popup
        return null;
      } else {
        sessionContext.setLoginSession(results.data.login.accessToken);
        userContext.setCurrentUser(results.data.login.user);
      }
    });
  };

  useEffect(() => {
    if (sessionContext.loginSession !== null) {
      history.push("/");
    }
  });

  return (
    <section>
      <AppPreviewPanel />
      <section>
        <h1>Welcome back, login here</h1>
        <form>
          <TextField
            required
            id="email"
            label="Email"
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <Button variant="contained" color="primary" onClick={e => {
            e.preventDefault();
            submitLogin();
          }}>
            Login
          </Button>
        </form>
      </section>
    </section>
  );
}

export default Login;
