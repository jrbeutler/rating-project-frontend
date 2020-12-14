import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { Button, FormControl, FormLabel, InputLabel, MenuItem } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ratePage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100vh',
      paddingTop: '0.5rem',
    },
    rateBox: {
      backgroundColor: '#000000',
      opacity: '60%',
      width: '40%',
      height: '40vh',
      marginLeft: 570,
      marginTop: 100,
    },
    ratingTextField: {
      width: 300,
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
    }
  }),
);

const Rate: React.FC = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [state, setState] = React.useState({
    reviewedID: "",
    category: "",
    notes: "",
  });
  const [rating, setRating] = useState<number>(0);
  const [users, setUsers] = useState<AllUser>();
  const [selectedUserID, setSelectedUserID] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [categories, setCategories] = useState<Categories>();
  const [selectedCategoryID, setSelectedCategoryID] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
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
  }, [])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as string);
  };

  const submitRating = () => {
    let results;
    rate(sessionToken, userContext.currentUser.id, selectedUserID, selectedCategoryID, rating, state.notes).then((r) => {
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
      <h1>Rate an Apprentice</h1>
      <form>
        <FormLabel required className={classes.formLabels} >Apprentice</FormLabel>
        <Select
          className={classes.selectBox}
          required
          value={selectedUser ? selectedUser : ''}
          defaultValue=''
        >
          {(users && users.length > 0) &&
            users.filter(user => user.id !== userContext.currentUser.id).map(user => {
            return <option key={user.id} onClick={() => {
              setSelectedUser(user.firstname + ' ' + user.lastname)
              setSelectedUserID(user.id);
            }}>
              {user.firstname} {user.lastname}</option>
          })
          }
        </Select>
        <FormControl required>
          <InputLabel id="category" required className={classes.formLabels}>Category</InputLabel>
          <Select
            labelId="category"
            id="category-selector"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={classes.selectBox}
          >
            {(categories && categories.length > 0) &&
            categories.map(category => {
              return <MenuItem key={category.id} value={category.id} onClick={() => setSelectedCategoryID(category.id)}>
                {category.name}
              </MenuItem>
              })
            }
          </Select>
        </FormControl>
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
        <textarea
          rows={10}
          cols={40}
          value={state.notes}
          onChange={handleChange}
        >
        </textarea>
      </form>
        <Button onClick={(e) => {
          e.preventDefault();
          submitRating();
        }}>Submit</Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Successful!
          </Alert>
        </Snackbar>
    </section>
  );
}

export default Rate;
