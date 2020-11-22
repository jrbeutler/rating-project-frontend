import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import Requests from "../../utils/Requests";
import { AuthContext } from "../../App";

type RatingProps = {
  category: string,
  reviewedID: string,
  reviewerID: string,
  rating: number,
  notes?: string,
}

const CreatedRatingCard: React.FC<RatingProps> = ({
  category,
  reviewedID,
  reviewerID,
  rating,
  notes = ''
}) => {
  const sessionContext = useContext(AuthContext);
  const [reviewedName, setReviewedName] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    if (sessionContext.loginSession === '') {
      history.push('/login');
    }
    Requests.getUserByID(sessionContext.loginSession, reviewedID).then((r) => {
      const user = r.data.data.userByID;
      console.log(user);
      setReviewedName(user.firstname + ' ' + user.lastname);
    })
  });

  return (
    <article>
      <h3>{reviewedName}</h3>
    </article>
  );
}

export default CreatedRatingCard;
