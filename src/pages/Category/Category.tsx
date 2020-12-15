import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getUserCategoryRatings } from "../../utils/requests/Rating";
import { getCurrentUser } from "../../utils/requests/User";
import { UserContext } from "../../App";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { getCategoryByID } from "../../utils/requests/Category";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface ParamTypes {
  categoryID: string
}

type UserRatings = [{
  id: string,
  categoryID: string,
  reviewedID: string,
  reviewerID: string,
  reviewerName?: string,
  rating: number,
  notes: string,
}];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    categoryPage: {
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
  }),
);

const Category: React.FC = () => {
  const classes = useStyles();
  const [userRatings, setUserRatings] = useState<UserRatings>();
  const [categoryName, setCategoryName] = useState<string>('');
  let { categoryID } = useParams<ParamTypes>();
  const userContext = useContext(UserContext);
  const history = useHistory();

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  // useEffect(() => {
  //   if (sessionToken) {
  //     getCurrentUser(sessionToken).then(response => {
  //       if (response.data) {
  //         const user = response.data.me;
  //         userContext.setCurrentUser(user);
  //         getCategoryByID(sessionToken, categoryID).then(response => {
  //           setCategoryName(response.data.getCategoryByID.name);
  //         });
  //         getUserCategoryRatings(sessionToken, user.id, categoryID).then(response => {
  //           setUserRatings(response.data.userRatingsByCategory);
  //         });
  //       } else {
  //         history.push('/login');
  //       }
  //     });
  //   } else {
  //     history.push('/login');
  //   }
  // }, [categoryID]);

  return (
    <div className={classes.categoryPage}>
      <h1>{categoryName}</h1>
      <NavLink exact to='/'>&#8592; Back</NavLink>
      {(userRatings && userRatings.length > 0) &&
        userRatings.map(userRating => {
          return <section key={userRating.id} className={classes.userReviewedSection}>
            <Typography>{userRating.rating}</Typography>
            <Typography>{userRating.notes}</Typography>
          </section>
        })
      }
    </div>
  );
};

export default Category;
