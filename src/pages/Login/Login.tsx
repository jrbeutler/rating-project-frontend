import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import AppPreviewPanel from '../../components/AppPreviewPanel/AppPreviewPanel';
import { SessionContext, UserContext } from "../../App";
import { login } from "../../utils/requests/User";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const userContext = useContext(UserContext);
  const sessionContext = useContext(SessionContext);
  const history = useHistory();

  useEffect(() => {
    if (userContext.currentUser.email !== '') {
      history.push('/');
    }
  }, [])

  const submitLogin = async () => {
    const response = await login(email, password);
    if (response.data == null) {
      return null;
    } else {
      userContext.setCurrentUser(response.data.login.user);
      window.sessionStorage.setItem('ratingToken', response.data.login.accessToken);
      sessionContext.setSessionToken(response.data.login.accessToken);
      history.push('/');
    }
  };

  return (
    <section>
      <AppPreviewPanel />
      <section>
        <AppPreviewPanel />
        <section>
          <div id="topLogo">
            <img id="logo" alt="" src="/EduSourceLogo.png" />
          </div>
          <form className="input-form">
            <ul className="wrapper">
              <li id="welcome">
                <label className="welcome">Welcome back,</label>
                <label className="welcome">Login here</label>
              </li>
              <li id="emailInput">
                <form className={classes.root} noValidate>
                  <TextField
                    className={classes.margin}
                    required
                    id="custom-css-outlined-input"
                    value={email}
                    type="email"
                    label="Email"
                    variant="outlined"
                    inputProps={{ style: { color: "white" } }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </form>
              </li>
              <li id="passwordInput">
                <TextField
                  className={clsx(classes.root, classes.margin, classes.textField)}
                  required
                  id="outlined-adornment-password"
                  variant="outlined"
                  type={values.showPassword ? 'text' : 'password'}
                  label="Password"
                  value={password}
                  inputProps={{ style: { color: "white" } }}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="icon"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

              </li>
            </ul>
          </form>
            <div className="actions">
              <Button id="loginButton" variant="contained" onClick={e => {
                e.preventDefault();
                submitLogin();
              }}>
                Login
              </Button></div>
        </section>
      </section>
    </section>
  );
}

export default Login;
