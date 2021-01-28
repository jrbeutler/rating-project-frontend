import React, { useContext, useEffect, useState } from "react";
import { Button, FormLabel, Select, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getCurrentUser } from "../../utils/requests/User";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { createCategory } from "../../utils/requests/Category";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addCategoryPage: {
      backgroundColor: '#85CAB0',
      display: 'flex',
      flexFlow: 'column wrap',
      alignContent: 'center',
      height: '100vh',
      padding: '200px',
    },
    addCategoryItems:{
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-around',
    },
    addCategoryTextField: {
      width: 200,
      height: 30,
      opacity: '100%',
      backgroundColor: '#FFFFFF',
      marginLeft: '10px',
      marginTop: '8px',
    },
    selectBox: {
      opacity: '100%',
      backgroundColor: '#FFFFFF',
      color: '#000000',
    },
    customH1: {
      color: '#000000',
      opacity: '100%',
      fontSize: '3rem',
    },
    formLabels: {
      opacity: '100%',
      color: '#FFFFFF',
      fontSize: '2rem',
    },
    submitButton:{
      backgroundColor: '#FFFFFF',
      fontSize: '1.25rem',
      width: '150px',
      height: '35px',
      marginLeft: '10px',
      marginTop: '8px',
    }
  }),
);

const AddCategory: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const userContext = useContext(UserContext);
  const [categoryName, setCategoryName] = useState<string>();
  const [open, setOpen] = useState(false);

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
      })
    } else {
      history.push('/login');
    }
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = () => {
    if (categoryName) {
      createCategory(sessionToken, categoryName).then(response => {
        if (response.data) {
          setOpen(true);
        } else {
          //handle error
        }
      })
    }
  };

  return(
    <section className={classes.addCategoryPage}>
      <h1 className={classes.customH1}>Add a Category</h1>
      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}>
        <section className={classes.addCategoryItems}>
        <FormLabel required className={classes.formLabels}>Category</FormLabel>
        <TextField
        className={classes.addCategoryTextField}
        id="standard-basic"
        type="string"
        onChange={e => setCategoryName(e.target.value)}
        />
        <Button type='submit' className={classes.submitButton}>Submit</Button>
        </section>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Successful!
        </Alert>
      </Snackbar>
    </section>
  );
};
export default AddCategory;
