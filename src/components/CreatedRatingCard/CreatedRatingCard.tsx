import React, { useEffect, useState } from "react";
import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getUserByID } from "../../utils/requests/User";

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
  const classes = useStyles();
  const [reviewedName, setReviewedName] = useState<string>('');

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    getUserByID(sessionToken, reviewedID).then((r) => {
      const user = r.data.userByID;
      setReviewedName(user.firstname + ' ' + user.lastname);
    })
  }, []);

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
