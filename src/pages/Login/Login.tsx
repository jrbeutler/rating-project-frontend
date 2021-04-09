import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput, Typography,
  useMediaQuery
} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import AppPreviewPanel from '../../components/AppPreviewPanel/AppPreviewPanel';
import { SessionContext, UserContext } from "../../App";
import { login } from "../../utils/requests/User";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    loginPage: {
      display: 'flex',
    },
    loginSection: {
      backgroundColor: '#85CAB0',
      width: '50%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    loginMobileSection: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    welcomeTitle: {
      '@media only screen and (max-width: 1050px)': {
        color: 'white',
      },
      fontWeight: 500,
      fontSize: '2.5rem',
      textAlign: 'center',
      padding: '1rem',
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    textField: {
      width: '20rem',
      margin: '1rem',
    },
  })
);

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const userContext = useContext(UserContext);
  const sessionContext = useContext(SessionContext);
  const mobileViewMatch = useMediaQuery('(max-width: 1050px)')
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    if (userContext.currentUser.email !== '') {
      history.push('/');
    }
  })

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
    <section className={classes.loginPage}>
      {!mobileViewMatch && <AppPreviewPanel />}
      <section className={mobileViewMatch ? classes.loginMobileSection : classes.loginSection}>
        <Typography variant='h1' className={classes.welcomeTitle}>Welcome back, login here</Typography>
        <form className={classes.loginForm}>
          <TextField
            className={classes.textField}
            required
            id="email"
            label="Email"
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl variant="outlined" className={classes.textField}>
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
