import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { getUserCategoryRatings } from "../../utils/requests/Rating";
import { getCurrentUser, getUserByID } from "../../utils/requests/User";
import { UserContext } from "../../App";
import { NavLink } from "react-router-dom";
import { getCategoryByID } from "../../utils/requests/Category";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { format, parseISO } from 'date-fns';
import CategoryRatingCard from '../../components/CategoryRatingCard/CategoryRatingCard';

interface ParamTypes {
  categoryID: string
  apprenticeID: string
}

type UserRatings = [{
  id: string,
  createdAt: string,
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
    reviewedList: {
      listStyleType: 'none',
      margin: 'auto',
      width: '90%',
      padding: '0',
    },
  }),
);

const Category: React.FC = () => {
  const classes = useStyles();
  const [userRatings, setUserRatings] = useState<UserRatings>();
  const [categoryName, setCategoryName] = useState<string>('');
  let location = useLocation();
  let { categoryID } = useParams<ParamTypes>();
  let { apprenticeID } = useParams<ParamTypes>();
  const userContext = useContext(UserContext);
  const history = useHistory();
  let apprenticePage = '/apprentice/' + apprenticeID;

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (sessionToken) {
      if (apprenticeID != null){
        getUserByID(sessionToken, apprenticeID).then(response => {
          if (response.data) {
            const apprentice = response.data.userByID;
            userContext.setCurrentUser(apprentice);
            getCategoryByID(sessionToken, categoryID).then(response => {
              setCategoryName(response.data.getCategoryByID.name);
            });
            getUserCategoryRatings(sessionToken, apprentice.id, categoryID).then(response => {
              setUserRatings(response.data.userRatingsByCategory);
            });
          } else {
            history.push('/login');
          }
        });
      }
      else{
        getCurrentUser(sessionToken).then(response => {
          if (response.data) {
            const user = response.data.me;
            userContext.setCurrentUser(user);
            getCategoryByID(sessionToken, categoryID).then(response => {
              setCategoryName(response.data.getCategoryByID.name);
            });
            getUserCategoryRatings(sessionToken, user.id, categoryID).then(response => {
              setUserRatings(response.data.userRatingsByCategory);
            });
          } else {
            history.push('/login');
          }
        });
      }
    } else {
      history.push('/login');
    }
  }, [categoryID]);

  return (
    <div className={classes.categoryPage}>
      <h1>{categoryName}</h1>
      {location.pathname === '/category/' + categoryID && <NavLink exact to='/'>&#8592; Back</NavLink> }
      {location.pathname === '/apprentice/' + apprenticeID + '/category/' + categoryID && <NavLink exact to={(apprenticePage)}>&#8592; Back</NavLink> }
      <ul className={classes.reviewedList}>
        {(userRatings && userRatings.length > 0) &&
        userRatings.map(userRating => {
          const createdDate = parseISO(userRating.createdAt);
          const formattedDate = format(createdDate, "MM/dd/yyyy");
          return <CategoryRatingCard
            createdAt={formattedDate}
            rating={userRating.rating}
            notes={userRating.notes}
          />
        })
        }
      </ul>
    </div>
  );
};

export default Category;
