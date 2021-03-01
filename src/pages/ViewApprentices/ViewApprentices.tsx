import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getAllApprentices, getCurrentUser } from '../../utils/requests/User';
import { NavLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ApprenticeCard from '../../components/ApprenticeCard/ApprenticeCard';


type Apprentices = [{
  id: string,
  rating?: number,
  role: string,
}];


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    apprenticePage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100vh',
      paddingTop: '0.5rem',
    },
    userReviewedSection: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      marginLeft: '25%',
      marginRight:'25%',
    },
    apprenticeList: {
      listStyleType: 'none',
      margin: 'auto',
      width: '90%',
      padding: '0',
    },
  }),
);

const ViewApprentices: React.FC = () => {
  const classes = useStyles();
  const [apprentices, setApprentices] = useState<Apprentices>();
  const history = useHistory();

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (sessionToken) {
      getCurrentUser(sessionToken).then(response => {
        if (response.data) {
          getAllApprentices(sessionToken).then(result => {
            setApprentices(result.data.allApprentices);
          });
        } else {
          history.push('/login');
        }
      })
    } else {
      history.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classes.apprenticePage}>
      <h1>Apprentices</h1>
      <NavLink exact to='/'>&#8592; Back</NavLink>
      <ul className={classes.apprenticeList}>
        {(apprentices && apprentices.length > 0) &&
        apprentices.map(apprentice => {
          return <ApprenticeCard
            apprenticeID={apprentice.id}
            role={apprentice.role}
          />
        })
        }
      </ul>
    </div>
  );
};

export default ViewApprentices;
