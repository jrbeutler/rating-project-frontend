import React, { useContext, useEffect } from "react";
import { AuthContext, UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { FormLabel } from "@material-ui/core";

const Rate: React.FC = () => {
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();

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
    </section>
  );
}

export default Rate;
