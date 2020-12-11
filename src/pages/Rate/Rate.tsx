import React, { useContext, useEffect, useState } from "react";
import { AuthContext, UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { Button, FormLabel } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import Requests from '../../utils/Requests';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



type AllUser = {
  allUsers?: [{
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    role: string,
  }];
}

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
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [state, setState] = React.useState({
    reviewedID: "",
    category: "",
    notes: "",
  });
  const [rating, setRating] = useState<number>(0);
  const [users, setUsers] = useState<AllUser>({});
  const [selectedUserID, setSelectedUserID] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [open, setOpen] = useState(false);

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

  const handleUserChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedUser(event.target.value as string);
  };

  const submitRating = () => {
    let results;
    Requests.rate(sessionContext.loginSession, userContext.currentUser.id, selectedUserID, state.category, rating, state.notes).then((r) => {
      results = r.data;
      console.log(results);
      if (results.data == null){
        //Show Error Popup
        return null;
      } else {
        setOpen(true);
      }
    })
  }

  useEffect(() => {
    if (sessionContext.loginSession === '') {
      history.push('/login');
    }
  });

  useEffect(() => {
    Requests.getAllUsers(sessionContext.loginSession).then((r) => {
      console.log(r);
      const results = r.data;
      setUsers(results.data);
      console.log(users);
    });
  }, [sessionContext.loginSession])

  return (
    <section className={classes.ratePage}>
      <h1>Rate an Apprentice</h1>
      <form>
        <FormLabel required className={classes.formLabels} >Apprentice</FormLabel>
        <Select
          className={classes.selectBox}
          required
          value={selectedUser}
          defaultValue=''
        >
          {(users.allUsers && users.allUsers.length > 0) &&
            users.allUsers.filter(user => user.id !== userContext.currentUser.id).map(user => {
            return <option key={user.id} onClick={() => {
              setSelectedUser(user.firstname + ' ' + user.lastname)
              setSelectedUserID(user.id);
            }}>
              {user.firstname} {user.lastname}</option>
          })
          }
        </Select>
        <FormLabel required className={classes.formLabels}>Category</FormLabel>
        <Select
          className={classes.selectBox}
          native
          required
          value={state.category}
          onChange={handleChange}
          inputProps={{
            name: "category",
            id: 'category',
          }}
        >
          <option value="">Select A Category:</option>
          <option value={'FRONTEND'}>FRONTEND</option>
          <option value={"BACKEND"}>BACKEND</option>
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
