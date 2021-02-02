import React, { useContext, useEffect, useState } from "react";
import {NavLink, useHistory} from 'react-router-dom';
import { format, parseISO } from "date-fns";
import ProfilePlaceholder from '../../assets/ProfilePlaceholder.svg';
import { UserContext } from '../../App';
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {Button, Typography} from "@material-ui/core";
import CreatedRatingCard from "../../components/CreatedRatingCard/CreatedRatingCard";
import {
  getCategoryAverages,
  getOverallRatingAverage,
  getRatingsCreated,
} from "../../utils/requests/Rating";
import { getCurrentUser } from "../../utils/requests/User";
import { Rating } from '@material-ui/lab';
import { RadioButtonChecked } from '@material-ui/icons';

type CategoryAverages = [{
  name: string;
  categoryID: string;
  average: number;
}]

type UserCreatedRatings = [{
    id: string,
    createdAt: string,
    categoryID: string,
    reviewedID: string,
    reviewerID: string,
    rating: number,
    notes: string,
}];

const useStyles = makeStyles(() =>
  createStyles({
    accountPage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100%',
    },
    profile: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingTop: '0.5rem',
    },
    profileImage: {
      width: '16rem',
      height: 'auto',
    },
    name: {
      fontSize: '2rem',
      fontWeight: 'normal',
      textAlign: 'left',
      paddingBottom: '0.5rem',
      borderBottom: 'solid 2px',
    },
    role: {
      fontSize: '1.5rem',
      fontWeight: 'normal',
      textAlign: 'left',
      marginTop: '0.5rem',
      marginBottom: '0.5rem',
    },
    rating: {

    },
    activeButton: {
      color: '#FFFFFF',
    },
    userReviewedSection: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      backgroundColor: '#85CAB0',
    },
    categoriesSection: {
      backgroundColor: '#85CAB0',
    },
    link: {
      marginRight: '1rem',
      fontSize: '1rem',
      color: '#000000',
      textDecoration: 'none',
      textAlign: 'right',
    },
    reviewedList: {
      listStyleType: 'none',
    }
  }),
);

const Account: React.FC = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [userCreatedRatings, setUserCreatedRatings] = useState<UserCreatedRatings>();
  const [overallRating, setOverallRating] = useState<number>(0);
  const [averageCategoryRatings, setAverageCategoryRatings] = useState<CategoryAverages>();
  const [showCreatedReviews, setShowCreatedReviews] = useState<boolean>(false);

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (sessionToken) {
      getCurrentUser(sessionToken).then(response => {
        if (response.data) {
          const user = response.data.me;
          userContext.setCurrentUser(user);
          getOverallRatingAverage(sessionToken, user.id).then(response => {
            setOverallRating(response.data.userOverallAverage);
          });
          getCategoryAverages(sessionToken, user.id).then(response => {
            setAverageCategoryRatings(response.data.userRatingCategoryAverages);
          });
          getRatingsCreated(sessionToken, user.id).then(response => {
            setUserCreatedRatings(response.data.userReviewedRatings);
          })
        } else {
          history.push('/login');
        }
      });
    } else {
      history.push('/login');
    }
  }, [])

  return (
    <section className={classes.accountPage}>
      <section className={classes.profile}>
        <img src={ProfilePlaceholder} title='Profile' className={classes.profileImage}  alt='Profile'/>
        <article>
          <Typography variant='h1' className={classes.name}>{userContext.currentUser.firstname} {userContext.currentUser.lastname}</Typography>
          <Typography variant='h2' className={classes.role}>{userContext.currentUser.role}</Typography>
          <Typography className={classes.rating}>Overall Rating: <Rating name="overallRating" value={overallRating} precision={0.01} icon={<RadioButtonChecked fontSize="inherit"/>} readOnly/></Typography>
          <NavLink exact to='/addCategory' className={classes.link}>
            <button>Add Category</button>
          </NavLink>
        </article>
      </section>
      <section>
        <Button onClick={() => setShowCreatedReviews(false)} className={!showCreatedReviews ? classes.activeButton : ''}>Rating Categories</Button>
        <Button onClick={() => setShowCreatedReviews(true)} className={showCreatedReviews ? classes.activeButton : ''}>Ratings Given</Button>
        {!showCreatedReviews ?
          <section className={classes.categoriesSection}>
            {(averageCategoryRatings && averageCategoryRatings.length > 0) &&
              averageCategoryRatings.map(categoryAverage => {
                return <Typography key={categoryAverage.categoryID}>
                  <NavLink exact to={'/category/' + categoryAverage.categoryID}>{categoryAverage.name}: </NavLink><Rating name="categoryRating" defaultValue={categoryAverage.average} precision={0.1} icon={<RadioButtonChecked fontSize="inherit"/>} size={'small'} readOnly/>
                </Typography>
              })
            }
          </section> :
          <section className={classes.userReviewedSection}>
            <ul className={classes.reviewedList}>
              {(userCreatedRatings && userCreatedRatings.length > 0) &&
              userCreatedRatings.map((rating) => {
                const createdDate = parseISO(rating.createdAt);
                const formattedDate = format(createdDate, "MM/dd/yyyy")
                return <CreatedRatingCard
                  key={rating.id}
                  createdAt={formattedDate}
                  reviewedID={rating.reviewedID}
                  categoryID={rating.categoryID}
                  rating={rating.rating}
                  notes={rating.notes ?? rating.notes}/>
              })
              }
            </ul>
          </section>
        }
      </section>
    </section>
  );
};

export default Account;
