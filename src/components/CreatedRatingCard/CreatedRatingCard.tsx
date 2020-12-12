import React, { useContext } from "react";
import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../../App";

type RatingProps = {
  category: string,
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
  rating,
  notes = ''
}) => {
  const classes = useStyles();

  const userContext = useContext(UserContext);

  return (
    <li className={classes.reviewedCard}>
      <Typography variant='h4'>{userContext.currentUser.firstname + " " + userContext.currentUser.lastname}</Typography>
      <Typography><strong>Category:</strong> {category}</Typography>
      <Typography><strong>Rating:</strong> {rating}</Typography>
      <Typography>{notes}</Typography>
    </li>
  );
}

export default CreatedRatingCard;
