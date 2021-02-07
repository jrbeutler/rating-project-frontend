import React, { useContext, useEffect, useState } from "react";
import { Button, FormLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
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
      '@media only screen and (max-width: 320px)': {
        height: '700px',
      },
      paddingTop: '0.5rem',
    },
    title: {
      fontSize: '2.5rem',
      margin: '1.25rem',
    },
    addUserSection: {
      backgroundColor: '#909090',
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '50%',
      margin: 'auto',
      borderRadius: '20px',
    },
    addUserForm: {
      width: '80%',
      padding: '2rem',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    addUserTextField: {
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
      borderRadius: '10px',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
    },
    selectBox: {
      backgroundColor: '#FFFFFF',
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
    },
    formLabels: {
      color: '#FFFFFF',
      textAlign: 'left',
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
      margin: '1rem 0 0.5rem 0'
    },
    submitButton:{
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
      backgroundColor: '#F7931E',
      marginTop: '1rem',
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
  const [role, setRole] = useState<string>('USER');
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
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRole(event.target.value as string);
  };

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
      <Typography variant='h1' className={classes.title}>Add a User</Typography>
      <section className={classes.addUserSection}>
        <form className={classes.addUserForm} onSubmit={e => {
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
           value={role}
           onChange={handleRoleChange}
          >
            <MenuItem value={"USER"}>USER</MenuItem>
            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
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
      </section>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Successful!
        </Alert>
      </Snackbar>
    </section>
  );
};
export default AddUser;
