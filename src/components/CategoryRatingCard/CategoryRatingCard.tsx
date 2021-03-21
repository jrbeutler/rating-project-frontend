import React, { useEffect, useState } from "react";
import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getUserByID } from "../../utils/requests/User";
import { RadioButtonChecked } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';

type RatingProps = {
  createdAt: string,
  reviewedID?: string,
  rating: number,
  notes?: string,
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

const CategoryRatingCard: React.FC<RatingProps> = ({
  createdAt,
  reviewedID,
  rating,
  notes =''
}) => {
  const classes = useStyles();

  const [reviewedName, setReviewedName] = useState<string>('');

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (!reviewedID) {
      return;
    }
    getUserByID(sessionToken, reviewedID).then((r) => {
      const user = r.data.userByID;
      setReviewedName(user.firstname + ' ' + user.lastname);
    });
  }, []);

  return (
    <li className={classes.reviewedCard}>
      {reviewedID ??
        <Typography className={classes.reviewerName}>{reviewedName}</Typography>
      }
      <Typography><strong>Reviewed:</strong> {createdAt}</Typography>
      <Typography><strong>Rating:</strong> <Rating name="reviewRating" defaultValue={rating} precision={0.1} icon={<RadioButtonChecked fontSize="inherit"/>} size="small" readOnly/></Typography>
      <Typography>{notes}</Typography>
    </li>
  );
}

export default CategoryRatingCard;
