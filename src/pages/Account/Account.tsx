import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProfilePlaceholder from '../../assets/ProfilePlaceholder.svg';
import { AuthContext, UserContext } from '../../App';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountPage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100vh',
    },
    profile: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'space-evenly',
    },
    profileImage: {
      width: '20rem',
      height: 'auto',
    },
  }),
);

const Account: React.FC = () => {
  const classes = useStyles();
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (sessionContext.loginSession === '') {
      history.push('/login');
    }
  });

  console.log(userContext.currentUser);

  return (
    <section className={classes.accountPage}>
      <section className={classes.profile}>
        <img src={ProfilePlaceholder} alt='Profile Image' title='Profile Image' className={classes.profileImage} />
        <article>
          <Typography variant='h1'>{userContext.currentUser.firstname} {userContext.currentUser.lastname}</Typography>
          <Typography variant='h2'>{userContext.currentUser.role}</Typography>
          <Typography>Overall Rating:</Typography>
        </article>
      </section>
    </section>
  );
};

export default Account;
