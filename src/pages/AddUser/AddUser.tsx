import React from 'react';
import { Button, FormLabel, Select, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addUserPage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100vh',
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
  return(
    <section className={classes.addUserPage}>
    <h1>Add a User</h1>
    <form>
      <FormLabel required className={classes.formLabels}>Email</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
      >
      </TextField>
      <FormLabel required className={classes.formLabels}>First Name</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
      >
      </TextField>
      <FormLabel required className={classes.formLabels}>Last Name</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
      >
      </TextField>
      <FormLabel required className={classes.formLabels}>Role</FormLabel>
      <Select
       required
       className={classes.selectBox}
      >
        <option value="">Select a Role</option>
        <option value={'ADMIN'}>ADMIN</option>
        <option value={'USER'}>USER</option>
      </Select>
      <FormLabel required className={classes.formLabels}>Password</FormLabel>
      <TextField
        className={classes.addUserTextField}
        id="standard-basic"
        type="string"
      >
      </TextField>
    </form>
      <Button className={classes.submitButton}>Submit</Button>
  </section>
  );
};
export default AddUser;
