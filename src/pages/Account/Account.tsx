import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import ProfilePlaceholder from '../../assets/ProfilePlaceholder.svg';
import { AuthContext, UserContext } from '../../App';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
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
    userReviewedSection: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100%',
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

  const calculateAverageRating = () => {
    let ratingTotal = 0;
    if (receivedRatings.userRatings) {
      for (let i = 0; i < receivedRatings.userRatings.length; i++) {
        ratingTotal += receivedRatings.userRatings[i].rating;
      }
      setOverallRating(ratingTotal / receivedRatings.userRatings?.length);
    }
  };

  useEffect(() => {
    if (sessionContext.loginSession === '') {
      history.push('/login');
    }
    Requests.getUserRatings(sessionContext.loginSession, userContext.currentUser.id).then((r) => {
      const results = r.data;
      setReceivedRatings(results.data);
      calculateAverageRating();
    });
    Requests.getRatingsCreated(sessionContext.loginSession, userContext.currentUser.id).then((r) => {
      const results = r.data;
      setUserCreatedRatings(results.data);
    })
  }, [calculateAverageRating, history, sessionContext.loginSession, userContext.currentUser.id]);

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
        <section>
          {(receivedRatings.userRatings && receivedRatings.userRatings.length > 0) &&
          receivedRatings.userRatings.map((rating) => {
            return <p key={rating.id}>{rating.category}</p>
          })
          }
        </section>
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
      </section>
    </section>
  );
};

export default Account;
