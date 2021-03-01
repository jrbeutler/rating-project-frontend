import React, { useEffect, useState } from "react";
import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getUserByID } from "../../utils/requests/User";

type RatingProps = {
  apprenticeID?: string,
  role: string,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    reviewedCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '1rem',
      '@media only screen and (max-width: 1050px)': {
        width: '70%',
      },
      width: '20%',
      justifySelf: 'center',
      marginTop: '1rem',
      marginBottom: '1rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'left',
      padding: '0.2rem',
    },
    apprenticeName:{
      [theme.breakpoints.down("sm")]:{
        fontSize: "large",
      },
      [theme.breakpoints.up("md")]:{
        fontSize: "x-large",
      },
    }
  })
);

const ApprenticeCard: React.FC<RatingProps> = ({
  apprenticeID,
  role
}) => {
  const classes = useStyles();
  const [apprenticeName, setApprenticeName] = useState<string>('');
  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (!apprenticeID) {
      return;
    }
    getUserByID(sessionToken, apprenticeID).then((r) => {
      const user = r.data.userByID;
      setApprenticeName(user.firstname + ' ' + user.lastname);
    });
  }, []);

  return (
    <li className={classes.reviewedCard}>
      <Typography className={classes.apprenticeName}>{apprenticeName}</Typography>
      <Typography><strong>Role:</strong> {role}</Typography>
    </li>
  );
}

export default ApprenticeCard;
