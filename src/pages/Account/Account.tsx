import React, { useContext, useEffect } from 'react';
import ProfilePlaceholder from '../../assets/ProfilePlaceholder.svg';
import { AuthContext, UserContext } from '../../App';

const Account: React.FC = () => {
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  useEffect()

  return (
    <section>
      <section>
        <img src={ProfilePlaceholder} alt='Profile Image' title='Profile Image' />
        <article>
          <h1>John Doe</h1>
          <h2>Mobile Apprentice</h2>
          <p>Overall Rating:</p>
        </article>
      </section>
    </section>
  );
};

export default Account;
