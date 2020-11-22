import React, { useContext, useEffect, useState } from "react";
import { AuthContext, UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { FormLabel } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import Requests from '../../utils/Requests';

type AllUser = {
  allUsers?: [{
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    role: string,
  }];
}

const Rate: React.FC = () => {
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [state, setState] = React.useState({
    reviewedID: "",
    Category: "",
  });
  const [users, setUsers] = useState<AllUser>({});

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

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
    <section>
      <h1>Rate an Apprentice</h1>
      <form>
        <FormLabel required>Apprentice</FormLabel>
      </form>
        <form>
        <Select
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
        <FormLabel required>Category</FormLabel>
      </form>
        <form>
        <Select
          native
          required
          value={state.Category}
          onChange={handleChange}
          inputProps={{
            name: "Category",
            id: 'Category',
          }}
        >
          <option value="">Select A Category:</option>
          <option value={'FRONTEND'}>FRONTEND</option>
          <option value={"BACKEND"}>BACKEND</option>
        </Select>
      </form>
      <form>
        <textarea>
        </textarea>
      </form>
      <button>Submit</button>
    </section>
  );
}

export default Rate;
