import React, { useContext, useEffect, useState } from "react";
import { Button, FormLabel, TextField, Typography } from "@material-ui/core";
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
    addCategorySection: {
      backgroundColor: '#909090',
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '50%',
      margin: 'auto',
      borderRadius: '20px',
    },
    categoryForm: {
      width: '80%',
      padding: '2rem',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    addCategoryTextField: {
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '30%',
      backgroundColor: '#FFFFFF',
      margin: '1rem 0 0.5rem 0',
      borderRadius: '10px',
      overflow: 'hidden',
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
        width: '80%',
      },
      width: '30%',
      backgroundColor: '#F7931E',
      marginBottom: '1rem',
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
      <Typography variant='h1' className={classes.title}>Add a Category</Typography>
      <section className={classes.addCategorySection}>
        <form className={classes.categoryForm} onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}>
          <FormLabel required className={classes.formLabels}>Category</FormLabel>
          <TextField
          className={classes.addCategoryTextField}
          id="standard-basic"
          type="string"
          onChange={e => setCategoryName(e.target.value)}
          />
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
export default AddCategory;
