import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import Requests from "../../utils/Requests";
import { AuthContext } from "../../App";
import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

type RatingProps = {
  category: string,
  reviewedID: string,
  rating: number,
  notes?: string,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    reviewedCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '1rem',
      width: '60%',
      justifySelf: 'center',
      marginTop: '0.25rem',
      marginBottom: '0.25rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'left',
      padding: '0.2rem',
    }
  })
);
const CreatedRatingCard: React.FC<RatingProps> = ({
  category,
  reviewedID,
  rating,
  notes = ''
}) => {
  const sessionContext = useContext(AuthContext);
  const classes = useStyles();
  const [reviewedName, setReviewedName] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    if (sessionContext.loginSession === '') {
      history.push('/login');
    }
    Requests.getUserByID(sessionContext.loginSession, reviewedID).then((r) => {
      const user = r.data.data.userByID;
      setReviewedName(user.firstname + ' ' + user.lastname);
    })
  });

  return (
    <article className={classes.reviewedCard}>
      <Typography variant='h4'>{reviewedName}</Typography>
      <Typography><strong>Category:</strong> {category}</Typography>
      <Typography><strong>Rating:</strong> {rating}</Typography>
      <Typography>{notes}</Typography>
    </article>
  );
}

export default CreatedRatingCard;
