import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { Button, FormLabel, MenuItem, Typography } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { rate } from "../../utils/requests/Rating";
import { getAllUsers, getCurrentUser } from "../../utils/requests/User";
import { getAllCategories } from "../../utils/requests/Category";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type AllUser = [{
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    role: string,
}];

type Categories = [{
  id: string;
  name: string;
}];

const useStyles = makeStyles(() =>
  createStyles({
    ratePage: {
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
    rateUserSection: {
      backgroundColor: '#909090',
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '50%',
      margin: 'auto',
      borderRadius: '20px',
    },
    rateUserForm: {
      width: '80%',
      padding: '2rem',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    ratingTextField: {
      width: '30%',
      backgroundColor: '#FFFFFF',
      margin: '1rem 0 0.5rem 0',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    selectBox: {
      backgroundColor: '#FFFFFF',
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
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
    notesField: {
      height: '10rem',
      width: '100%',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    submitButton: {
      '@media only screen and (max-width: 1050px)': {
        width: '80%',
      },
      width: '30%',
      backgroundColor: '#F7931E',
      marginBottom: '1rem',
    }
  }),
);

const Rate: React.FC = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [rating, setRating] = useState<number>(1);
  const [users, setUsers] = useState<AllUser>();
  const [selectedUserID, setSelectedUserID] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('Select a user');
  const [categories, setCategories] = useState<Categories>();
  const [notes, setNotes] = useState<string>('');
  const [selectedCategoryID, setSelectedCategoryID] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>("Select a category");
  const [open, setOpen] = useState(false);

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (sessionToken) {
      getCurrentUser(sessionToken).then(response => {
        if (response.data) {
          getAllUsers(sessionToken).then(result => {
            setUsers(result.data.allUsers);
          });
          getAllCategories(sessionToken).then(result => {
            setCategories(result.data.getAllCategories);
          })
        } else {
          history.push('/login');
        }
      })
    } else {
      history.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleUserChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedUser(event.target.value as string);
  };

  const submitRating = () => {
    let results;
    rate(sessionToken, userContext.currentUser.id, selectedUserID, selectedCategoryID, rating, notes).then((r) => {
      console.log(r);
      results = r.data;
      if (results == null){
        //Show Error Popup
        return null;
      } else {
        setOpen(true);
      }
    })
  }

  return (
    <section className={classes.ratePage}>
      <Typography variant='h1' className={classes.title}>Rate an Apprentice</Typography>
      <section className={classes.rateUserSection}>
        <form className={classes.rateUserForm}>
          <FormLabel required className={classes.formLabels} >Apprentice</FormLabel>
          <Select
            className={classes.selectBox}
            required
            value={selectedUser ? selectedUser : ''}
            onChange={handleUserChange}
          >
            <MenuItem value={"Select a user"}>Select a user</MenuItem>
            {(users && users.length > 0) &&
              users.filter(user => user.id !== userContext.currentUser.id).map(user => {
              return <MenuItem key={user.id} value={user.firstname + " " + user.lastname} onClick={() => {
                setSelectedUser(user.firstname + ' ' + user.lastname)
                setSelectedUserID(user.id);
              }}>
                {user.firstname} {user.lastname}</MenuItem>
            })
            }
          </Select>
          <FormLabel required className={classes.formLabels} >Category</FormLabel>
          <Select
            labelId="category"
            id="category-selector"
            required
            value={selectedCategory ? selectedCategory : ''}
            onChange={handleCategoryChange}
            className={classes.selectBox}
          >
            <MenuItem value={"Select a category"}>Select a category</MenuItem>
            {(categories && categories.length > 0) &&
            categories.map(category => {
              return <MenuItem key={category.id} value={category.id} onClick={() => setSelectedCategoryID(category.id)}>
                {category.name}
              </MenuItem>
              })
            }
          </Select>
          <FormLabel required className={classes.formLabels}>Rating</FormLabel>
          <TextField
            className={classes.ratingTextField}
            id="standard-number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                max:5, min: 1
              }
            }}
            value={rating}
            onChange={(event) => setRating(parseInt(event.target.value))}
          >
          </TextField>
          <FormLabel required className={classes.formLabels}>Comments</FormLabel>
          <textarea
            className={classes.notesField}
            rows={10}
            cols={40}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          >
          </textarea>
        </form>
        <Button className={classes.submitButton} onClick={(e) => {
          e.preventDefault();
          submitRating();
        }}>Submit</Button>
      </section>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Successful!
          </Alert>
        </Snackbar>
    </section>
  );
}

export default Rate;
