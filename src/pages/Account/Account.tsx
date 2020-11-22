import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProfilePlaceholder from '../../assets/ProfilePlaceholder.svg';
import { AuthContext, UserContext } from '../../App';

const Account: React.FC = () => {
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
      <section>
        <img src={ProfilePlaceholder} alt='Profile Image' title='Profile Image' />
        <article>
          <button onClick={() => history.push('/rate')}>Rate</button>
          <h1>John Doe</h1>
          <h2>Mobile Apprentice</h2>
          <p>Overall Rating:</p>
        </article>
      </section>
    </section>
  );
};

export default Account;
