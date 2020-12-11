import React from 'react';
import { Button, FormLabel, Select, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addCategoryPage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100vh',
      alignItems: 'center',
      paddingTop: '15rem',
    },
    addCategoryTextField: {
      width: 200,
      opacity: '100%',
      backgroundColor: '#FFFFFF',
    },
    selectBox: {
      opacity: '100%',
      backgroundColor: '#FFFFFF',
      color: '#000000'
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
    }
  }),
);

const AddCategory: React.FC = () => {
  const classes = useStyles();
  return(
    <section className={classes.addCategoryPage}>
      <h1 className={classes.customH1}>Add a Category</h1>
      <form>
        <FormLabel required className={classes.formLabels}>Category</FormLabel>
        <TextField
          className={classes.addCategoryTextField}
          id="standard-basic"
          type="string"
        ></TextField>
      </form>
      <Button className={classes.submitButton}>Submit</Button>
    </section>
  );
};
export default AddCategory;
