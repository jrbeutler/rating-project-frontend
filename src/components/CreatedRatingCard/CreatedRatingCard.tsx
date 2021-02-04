import React, { useEffect, useState } from "react";
import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getUserByID } from "../../utils/requests/User";
import { getCategoryByID } from "../../utils/requests/Category";
import { RadioButtonChecked } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';

type RatingProps = {
  createdAt: string,
  reviewedID: string,
  categoryID: string,
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
      marginTop: '1rem',
      marginBottom: '1rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'left',
      padding: '0.2rem',
    },
    reviewerName:{
      [theme.breakpoints.down("sm")]:{
        fontSize: "large",
      },
      [theme.breakpoints.up("md")]:{
        fontSize: "x-large",
      },
    }
  })
);
const CreatedRatingCard: React.FC<RatingProps> = ({
  createdAt,
  reviewedID,
  categoryID,
  rating,
  notes = ''
}) => {
  const classes = useStyles();

  const [reviewedName, setReviewedName] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    getUserByID(sessionToken, reviewedID).then((r) => {
      const user = r.data.userByID;
      setReviewedName(user.firstname + ' ' + user.lastname);
    });
    getCategoryByID(sessionToken, categoryID).then(response => {
      setCategory(response.data.getCategoryByID.name);
    });
  }, []);

  return (
    <li className={classes.reviewedCard}>
      <Typography className={classes.reviewerName}>{reviewedName}</Typography>
      <Typography><strong>Category:</strong> {category}</Typography>
      <Typography>Reviewed: {createdAt}</Typography>
      <Typography><strong>Rating:</strong> <Rating name="reviewRating" defaultValue={rating} precision={0.1} icon={<RadioButtonChecked fontSize="inherit"/>} size="small" readOnly/></Typography>
      <Typography>{notes}</Typography>
    </li>
  );
}

export default CreatedRatingCard;
