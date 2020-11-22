import React, { useContext, useEffect } from "react";
import { AuthContext, UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { FormLabel } from "@material-ui/core";
import Select from '@material-ui/core/Select';

const Rate: React.FC = () => {
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [state, setState] = React.useState({
    reviewedID: "",
    Category: "",
  });
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
            name: "Apprentice",
            id: 'Apprentice',
          }}
        >
          <option value="">Select an Apprentice:</option>
          <option value={'Bart Simpson'}>Bart Simpson</option>
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
