import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import ProfilePlaceholder from '../../assets/ProfilePlaceholder.svg';
import { AuthContext, UserContext } from '../../App';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import Requests from "../../utils/Requests";
import CreatedRatingCard from "../../components/CreatedRatingCard/CreatedRatingCard";

type UserRatings = {
  userRatings?: [{
    id: string,
    category: string,
    reviewedID: string,
    reviewerID: string,
    rating: number,
    notes: string,
  }];
}

type UserCreatedRatings = {
  userReviewedRatings?: [{
    id: string,
    category: string,
    reviewedID: string,
    reviewerID: string,
    rating: number,
    notes: string,
  }];
}

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
    },
    profileImage: {
      width: '20rem',
      height: 'auto',
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
      width: '100%',
      height: '100vh',
    },
  }),
);

const Account: React.FC = () => {
  const classes = useStyles();
  const sessionContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [receivedRatings, setReceivedRatings] = useState<UserRatings>({});
  const [userCreatedRatings, setUserCreatedRatings] = useState<UserCreatedRatings>({});
  const [overallRating, setOverallRating] = useState<number>(0);
  const [averageFrontendRating, setAverageFrontendRating] = useState<number>(0);
  const [averageBackendRating, setAverageBackendRating] = useState<number>(0);
  const [showCreatedReviews, setShowCreatedReviews] = useState<boolean>(false);

  const calculateAverageRating = () => {
    let ratingTotal = 0;
    if (receivedRatings.userRatings) {
      for (let i = 0; i < receivedRatings.userRatings.length; i++) {
        ratingTotal += receivedRatings.userRatings[i].rating;
      }
      setOverallRating(ratingTotal / receivedRatings.userRatings?.length);
    }
  };

  const calculateAverageFrontend = () => {
    let ratingTotal = 0;
    if (receivedRatings.userRatings) {
      const frontendRatings = receivedRatings.userRatings.filter(rating => rating.category === 'FRONTEND');
      for (let i = 0; i < frontendRatings.length; i++) {
        ratingTotal += frontendRatings[i].rating;
      }
      setAverageFrontendRating(ratingTotal / frontendRatings.length);
    }
  }

  const calculateAverageBackend = () => {
    let ratingTotal = 0;
    if (receivedRatings.userRatings) {
      const backendRatings = receivedRatings.userRatings.filter(rating => rating.category === 'BACKEND');
      for (let i = 0; i < backendRatings.length; i++) {
        ratingTotal += backendRatings[i].rating;
      }
      setAverageBackendRating(ratingTotal / backendRatings.length);
    }
  }

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    if (sessionContext.loginSession === '') {
      history.push('/login');
    }
    Requests.getUserRatings(sessionContext.loginSession, userContext.currentUser.id).then((r) => {
      const results = r.data;

      if (isMounted) {
        setReceivedRatings(results.data);
        calculateAverageRating();
        calculateAverageFrontend();
        calculateAverageBackend();
      }
    });
    Requests.getRatingsCreated(sessionContext.loginSession, userContext.currentUser.id).then((r) => {
      const results = r.data;
      if (isMounted) setUserCreatedRatings(results.data);
    });
    return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
  });

  return (
    <section className={classes.accountPage}>
      <section className={classes.profile}>
        <img src={ProfilePlaceholder} alt='Profile Image' title='Profile Image' className={classes.profileImage} />
        <article>
          <Typography variant='h1'>{userContext.currentUser.firstname} {userContext.currentUser.lastname}</Typography>
          <Typography variant='h2'>{userContext.currentUser.role}</Typography>
          <Typography>Overall Rating: {overallRating}</Typography>
        </article>
      </section>
      <section>
        <Button onClick={() => setShowCreatedReviews(false)} className={!showCreatedReviews ? classes.activeButton : ''}>Rating Categories</Button>
        <Button onClick={() => setShowCreatedReviews(true)} className={showCreatedReviews ? classes.activeButton : ''}>Ratings Given</Button>
        {!showCreatedReviews ?
          <section>
            <Typography>Frontend: {averageFrontendRating ? averageFrontendRating : 'No Ratings'}</Typography>
            <Typography>Backend: {averageBackendRating ? averageBackendRating : 'No Ratings'}</Typography>
          </section> :
          <section className={classes.userReviewedSection}>
            {(userCreatedRatings.userReviewedRatings && userCreatedRatings.userReviewedRatings.length > 0) &&
            userCreatedRatings.userReviewedRatings.map((rating) => {
              return <CreatedRatingCard
                reviewedID={rating.reviewedID}
                category={rating.category}
                rating={rating.rating}
                notes={rating.notes ?? rating.notes}/>
            })
            }
          </section>
        }
      </section>
    </section>
  );
};

export default Account;
