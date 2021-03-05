import React, { useEffect, useState } from "react";
import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getUserByID } from "../../utils/requests/User";
import { NavLink } from "react-router-dom";

type RatingProps = {
  apprenticeID?: string,
  role: string,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    reviewedCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '1rem',
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
      flex: '1 1 30%',
      justifySelf: 'center',
      margin: '4rem',
      textAlign: 'left',
      padding: '1rem',
      maxWidth: '20rem',
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
     <NavLink exact to={'/apprentice/' + apprenticeID}><Typography className={classes.apprenticeName}>{apprenticeName}</Typography></NavLink>
      <Typography><strong>Role:</strong> {role}</Typography>
    </li>
  );
}

export default ApprenticeCard;
