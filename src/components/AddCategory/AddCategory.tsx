import React, { useState } from "react";
import { Button, FormLabel, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { createCategory } from "../../utils/requests/Category";

type AddCategoryProps = {
  sessionToken: string,
};

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant={"filled"} {...props} />;
};

const useStyles = makeStyles(() =>
  createStyles({
    addCategoryTitle: {
      marginTop: '2.5rem',
      marginBottom: '0.25rem',
      fontSize: '2rem',
      width: '50%',
      margin: 'auto',
      textAlign: 'left',
    },
    addCategorySection: {
      backgroundColor: '#909090',
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '50%',
      margin: 'auto',
      borderRadius: '20px',
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
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

const AddCategory: React.FC<AddCategoryProps> = ({sessionToken}) => {
  const classes = useStyles();
  const [categoryName, setCategoryName] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState("successful");

  const handleSubmit = () => {
    if (categoryName) {
      createCategory(sessionToken, categoryName).then(response => {
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
      <Typography variant={"h2"} className={classes.addCategoryTitle}>Add Category</Typography>
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
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
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

export default AddCategory;
