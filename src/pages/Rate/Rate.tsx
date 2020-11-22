import React, { useContext, useEffect, useState } from "react";
import { AuthContext, UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { FormLabel } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import Requests from '../../utils/Requests';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";


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
  const [rating, setRating] = useState(0);
  const [users, setUsers] = useState<AllUser>({});


  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const submitRating = () => {
    let results;
    Requests.rate(sessionContext.loginSession, userContext.currentUser.id, state.reviewedID, state.category, rating, state.notes).then((r) => {
      results = r.data;
      if (results.data == null){
        //Show Error Popup
        return null;
      } else {

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

  // @ts-ignore
  // @ts-ignore
  return (
    <section className={classes.ratePage}>
      <h1>Rate an Apprentice</h1>
      <section className={classes.rateBox}>
      <form>
        <FormLabel required className={classes.formLabels} >Apprentice</FormLabel>
      </form>
        <form>
        <Select
          className={classes.selectBox}
          native
          required
          value={state.reviewedID}
          onChange={handleChange}
          inputProps={{
            firstname: "",
            lastname: "",
            id: 'reviewedID',
          }}
        >
          {(users.allUsers && users.allUsers.length > 0) &&
            users.allUsers.filter(user => user.id !== userContext.currentUser.id).map(user => {
            return <option key={user.id}>
              {user.firstname} {user.lastname}</option>
          })
          }
        </Select>
      </form>
      <form>
        <FormLabel required className={classes.formLabels}>Category</FormLabel>
      </form>
        <form>
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
      </form>
        <form>
          <FormLabel required className={classes.formLabels}>Rating</FormLabel>
        </form>
      <form>
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
      </form>
      <form>
        <textarea
          rows={10}
          cols={40}
          value={state.notes}
          onChange={handleChange}
        >
        </textarea>
      </form>
      <button>Submit</button>
      </section>
    </section>
  );
}

export default Rate;
