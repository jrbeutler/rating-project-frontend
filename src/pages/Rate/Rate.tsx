import React, { useContext, useEffect, useState } from "react";
import { SessionContext, UserContext } from "../../App";
import { Button, FormLabel, MenuItem, Typography } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { rate } from "../../utils/requests/Rating";
import { getAllUsers } from "../../utils/requests/User";
import { getAllCategories } from "../../utils/requests/Category";
import { Rating } from '@material-ui/lab';
import { RadioButtonChecked } from '@material-ui/icons';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type AllUser = [{
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    role: string,
    isActive: boolean,
}];

type Categories = [{
  id: string;
  name: string;
  isActive: boolean;
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
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
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
  const [rating, setRating] = useState<number>(1);
  const [users, setUsers] = useState<AllUser>();
  const [selectedUserID, setSelectedUserID] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('Select a user');
  const [categories, setCategories] = useState<Categories>();
  const [notes, setNotes] = useState<string>('');
  const [selectedCategoryID, setSelectedCategoryID] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>("Select a category");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState("successful");
  const sessionContext = useContext(SessionContext);

  useEffect(() => {
    getAllUsers().then(result => {
      setUsers(result.data.allUsers);
    });
    getAllCategories().then(result => {
      setCategories(result.data.getAllCategories);
    });
  }, [])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleUserChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedUser(event.target.value as string);
  };

  const submitRating = () => {
    rate(sessionContext.sessionToken, userContext.currentUser.id, selectedUserID, selectedCategoryID, rating, notes).then((response) => {
      if (response.data) {
        setAlertOpen(true);
        setAlertType("successful");
      } else {
        setAlertOpen(true);
        setAlertType("failed");
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
              users.filter(user => user.id !== userContext.currentUser.id).filter(user => user.isActive).map(user => {
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
            categories.filter(category => category.isActive).map(category => {
              return <MenuItem key={category.id} value={category.id} onClick={() => setSelectedCategoryID(category.id)}>
                {category.name}
              </MenuItem>
              })
            }
          </Select>
          <FormLabel required className={classes.formLabels}>Rating</FormLabel>
          <Rating
            name="standard-number"
            value={rating}
            size='large'
            icon={<RadioButtonChecked fontSize="inherit"/>}
            onChange={(event, newValue) => {
              if(newValue != null && newValue > 0 && newValue < 6){
                setRating(newValue);
              }
            }}
          />
          <FormLabel className={classes.formLabels}>Comments</FormLabel>
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
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        {alertType === "successful" ?
          <Alert onClose={handleClose} severity={"success"}>
            Rating Recorded!
          </Alert> :
          <Alert onClose={handleClose} severity={"error"}>
            Something went wrong, please try again!
          </Alert>
        }
      </Snackbar>
    </section>
  );
}

export default Rate;
