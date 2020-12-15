import React, { useContext, useEffect, useState } from "react";
import { Button, FormLabel, Select, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { createUser, getCurrentUser } from "../../utils/requests/User";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addUserPage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100vh',
      paddingTop: '0.5rem',
    },
    addUserTextField: {
      width: 150,
      opacity: '100%',
      backgroundColor: '#FFFFFF'
    },
    selectBox: {
      opacity: '100%',
      backgroundColor: '#FFFFFF',
      color: '#000000'
    },
    formLabels: {
      opacity: '100%',
      color: '#FFFFFF'
    },
    submitButton:{
      backgroundColor: '#FFFFFF'
    }
  }),
);

const AddUser: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const userContext = useContext(UserContext);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (sessionToken) {
      getCurrentUser(sessionToken).then(response => {
        if (response.data) {
          const user = response.data.me;
          userContext.setCurrentUser(user);
        } else {
          history.push('/login');
        }
      });
    } else {
      history.push('/login');
    }
  });

  const submitUser = () => {
    if (role === '') {
      return null;
    }
    if (password === confirmPassword) {
      createUser(sessionToken, firstName, lastName, email, role, password).then(response => {
        if (response.data) {
          setOpen(true);
        } else {
          //handle error
        }
      })
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return(
    <section className={classes.addUserPage}>
    <h1>Add a User</h1>
    <form onSubmit={e => {
      e.preventDefault();
      submitUser();
    }}>
      <FormLabel required className={classes.formLabels}>Email</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
        required
        onChange={e => setEmail(e.target.value)}
      />
      <FormLabel required className={classes.formLabels}>First Name</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
        required
        onChange={e => setFirstName(e.target.value)}
      >
      </TextField>
      <FormLabel required className={classes.formLabels}>Last Name</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
        required
        onChange={e => setLastName(e.target.value)}
      >
      </TextField>
      <FormLabel required className={classes.formLabels}>Role</FormLabel>
      <Select
       required
       className={classes.selectBox}
       value={role ? role : ''}
       defaultValue={'ADMIN'}
      >
        <option value={'ADMIN'} onClick={() => setRole("ADMIN")}>ADMIN</option>
        <option value={'USER'} onClick={() => setRole("USER")}>USER</option>
      </Select>
      <FormLabel required className={classes.formLabels}>Password</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
        required
        onChange={e => setPassword(e.target.value)}
      >
      </TextField>
      <FormLabel required className={classes.formLabels}>Confirm Password</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
        required
        onChange={e => setConfirmPassword(e.target.value)}
      >
      </TextField>
      <Button type='submit' className={classes.submitButton}>Submit</Button>
    </form>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success">
        Successful!
      </Alert>
    </Snackbar>
  </section>
  );
};
export default AddUser;
