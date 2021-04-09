import React, { useContext, useState } from "react";
import { Button, FormLabel, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SessionContext } from "../../App";
import { updateUser } from "../../utils/requests/User";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(() =>
  createStyles({
    editUserPage: {
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
    editUserSection: {
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

const EditUser: React.FC = () => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const sessionContext = useContext(SessionContext);

  const submitForm = () => {
    updateUser(sessionContext.sessionToken, firstName, lastName, oldPassword, newPassword).then(response => {
      if (response.data) {
        setOpen(true);
      } else {
        console.log(response);
      }
    })
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return(
    <section className={classes.editUserPage}>
      <Typography variant='h1' className={classes.title}>Edit Profile</Typography>
      <section className={classes.editUserSection}>
        <form className={classes.addUserForm} onSubmit={e => {
          e.preventDefault();
          submitForm();
        }}>
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
          <FormLabel required className={classes.formLabels}>Old Password</FormLabel>
          <TextField
            className={classes.addUserTextField}
            id="standard-basic"
            type="string"
            required
            onChange={e => setOldPassword(e.target.value)}
          >
          </TextField>
          <FormLabel required className={classes.formLabels}>New Password</FormLabel>
          <TextField
            className={classes.addUserTextField}
            id="standard-basic"
            type="string"
            required
            onChange={e => setNewPassword(e.target.value)}
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
export default EditUser;
