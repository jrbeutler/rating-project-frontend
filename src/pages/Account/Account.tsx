import React, { useContext, useEffect, useState } from "react";
import {NavLink, useHistory} from 'react-router-dom';
import ProfilePlaceholder from '../../assets/ProfilePlaceholder.svg';
import { UserContext } from '../../App';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {Button, Link, Typography} from "@material-ui/core";
import CreatedRatingCard from "../../components/CreatedRatingCard/CreatedRatingCard";
import { getRatingsCreated, getUserRatings } from "../../utils/requests/Rating";
import { getCurrentUser } from "../../utils/requests/User";

type UserRatings = [{
    id: string,
    categoryID: string,
    reviewedID: string,
    reviewerID: string,
    rating: number,
    notes: string,
}];

type UserCreatedRatings = [{
    id: string,
    category: string,
    reviewedID: string,
    reviewerID: string,
    rating: number,
    notes: string,
}];

const useStyles = makeStyles((theme: Theme) =>
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
      width: '20rem',
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
  const [receivedRatings, setReceivedRatings] = useState<UserRatings>();
  const [userCreatedRatings, setUserCreatedRatings] = useState<UserCreatedRatings>();
  const [overallRating, setOverallRating] = useState<number>(0);
  const [averageFrontendRating, setAverageFrontendRating] = useState<number>(0);
  const [averageBackendRating, setAverageBackendRating] = useState<number>(0);
  const [showCreatedReviews, setShowCreatedReviews] = useState<boolean>(false);

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  const calculateAverageRating = () => {
    let ratingTotal = 0;
    if (!receivedRatings) {
      setOverallRating(0);
    }
    if (receivedRatings && receivedRatings) {
      for (let i = 0; i < receivedRatings.length; i++) {
        ratingTotal += receivedRatings[i].rating;
      }
      setOverallRating(ratingTotal / receivedRatings?.length);
    }
  };

  const calculateAverageFrontend = () => {
    let ratingTotal = 0;
    if (receivedRatings && receivedRatings) {
      const frontendRatings = receivedRatings.filter(rating => rating.categoryID === 'FRONTEND');
      for (let i = 0; i < frontendRatings.length; i++) {
        ratingTotal += frontendRatings[i].rating;
      }
      setAverageFrontendRating(ratingTotal / frontendRatings.length);
    }
  }

  const calculateAverageBackend = () => {
    let ratingTotal = 0;
    if (receivedRatings && receivedRatings) {
      const backendRatings = receivedRatings.filter(rating => rating.categoryID === 'BACKEND');
      for (let i = 0; i < backendRatings.length; i++) {
        ratingTotal += backendRatings[i].rating;
      }
      setAverageBackendRating(ratingTotal / backendRatings.length);
    }
  }

  useEffect(() => {
    if (sessionToken) {
      getCurrentUser(sessionToken).then(response => {
        if (response.data) {
          const user = response.data.me;
          userContext.setCurrentUser(user);
          getUserRatings(sessionToken, user.id).then(response => {
            console.log(response);
            setReceivedRatings(response.data.userRatings);
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
        <img src={ProfilePlaceholder} alt='Profile Image' title='Profile Image' className={classes.profileImage} />
        <article>
          <Typography variant='h1' className={classes.name}>{userContext.currentUser.firstname} {userContext.currentUser.lastname}</Typography>
          <Typography variant='h2' className={classes.role}>{userContext.currentUser.role}</Typography>
          {/*<Typography className={classes.rating}>Overall Rating: {overallRating}</Typography>*/}
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
            {/*<Typography>Frontend: {averageFrontendRating ? averageFrontendRating : 'No Ratings'}</Typography>*/}
            {/*<Typography>Backend: {averageBackendRating ? averageBackendRating : 'No Ratings'}</Typography>*/}
          </section> :
          <section className={classes.userReviewedSection}>
            <ul className={classes.reviewedList}>
              {(userCreatedRatings && userCreatedRatings.length > 0) &&
              userCreatedRatings.map((rating) => {
                return <CreatedRatingCard
                  key={rating.id}
                  category={rating.category}
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
