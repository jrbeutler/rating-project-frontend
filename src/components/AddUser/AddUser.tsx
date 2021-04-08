import React, { useState } from "react";
import { Button, FormLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { createUser } from "../../utils/requests/User";

type AddUserProps = {
  sessionToken: string,
};

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant={"filled"} {...props} />;
};

const useStyles = makeStyles(() =>
  createStyles({
    addUserTitle: {
      marginTop: '2.5rem',
      marginBottom: '0.25rem',
      fontSize: '2rem',
      width: '50%',
      margin: 'auto',
      textAlign: 'left',
    },
    addUserSection: {
      backgroundColor: '#909090',
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '50%',
      margin: 'auto',
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
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

const AddUser: React.FC<AddUserProps> = ({sessionToken}) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('APPRENTICE');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState("successful");

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
          setAlertOpen(true);
          setAlertType("successful");
        } else {
          setAlertOpen(true);
          setAlertType("failed");
        }
      })
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Typography variant={"h2"} className={classes.addUserTitle}>Add User</Typography>
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
            <MenuItem value={"APPRENTICE"}>APPRENTICE</MenuItem>
            <MenuItem value={"FTE"}>Full-Time Employee</MenuItem>
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
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        {alertType === "successful" ?
          <Alert onClose={handleClose} severity={"success"}>
            Added Category!
          </Alert> :
          <Alert onClose={handleClose} severity={"error"}>
            Something went wrong, please try again!
          </Alert>
        }
      </Snackbar>
    </>
  );
};

export default AddUser;
