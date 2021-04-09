import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getAllApprentices, getCurrentUser } from '../../utils/requests/User';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ApprenticeCard from '../../components/ApprenticeCard/ApprenticeCard';
import { Typography } from '@material-ui/core';


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
    apprenticeList: {
      display: 'flex',
      flexWrap: 'wrap',
      listStyleType: 'none',
      margin: 'auto',
      width: '90%',
      maxWidth: '60rem',
      padding: '0',
    },
    apprenticesTitle: {
      margin: '2rem',
    },
  }),
);

const ViewApprentices: React.FC = () => {
  const classes = useStyles();
  const [apprentices, setApprentices] = useState<Apprentices>();
  const history = useHistory();

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    getAllApprentices(sessionToken).then(result => {
      setApprentices(result.data.allApprentices);
    });
  }, [])

  return (
    <section className={classes.apprenticePage}>
      <Typography variant={"h4"} className={classes.apprenticesTitle}>Apprentices</Typography>
      <section>
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
      </section>
    </section>
  );
};

export default ViewApprentices;
