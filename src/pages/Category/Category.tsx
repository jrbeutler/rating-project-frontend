import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { getUserCategoryRatings } from "../../utils/requests/Rating";
import { getCurrentUser, getUserByID } from "../../utils/requests/User";
import { UserContext } from "../../App";
import { NavLink } from "react-router-dom";
import { getCategoryByID } from "../../utils/requests/Category";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { format, parseISO, toDate } from "date-fns";
import CategoryRatingCard from '../../components/CategoryRatingCard/CategoryRatingCard';
import Chart from "react-google-charts";
import { Typography } from "@material-ui/core";

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
    categoryName: {
      margin: '2rem',
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
    chartSection: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    chart: {
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
      marginLeft: '8.5rem',
      '@media only screen and (max-width: 500px)': {
        marginLeft: '20px',
      },
    },
    reviewedList: {
      display: 'flex',
      flexWrap: 'wrap',
      listStyleType: 'none',
      margin: 'auto',
      width: '90%',
      maxWidth: '60rem',
      padding: '0',
    },
  }),
);

const Category: React.FC = () => {
  const classes = useStyles();
  const [userRatings, setUserRatings] = useState<UserRatings>();
  const [categoryName, setCategoryName] = useState<string>('');
  let location = useLocation();
  const [chartPoints, setChartPoints] = useState<Array<Array<any>>>([['Time', 'Rating']]);

  let { categoryID } = useParams<ParamTypes>();
  let { apprenticeID } = useParams<ParamTypes>();
  const userContext = useContext(UserContext);
  const history = useHistory();
  let apprenticePage = '/apprentice/' + apprenticeID;

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (sessionToken) {
      if (apprenticeID != null){
        getUserByID(apprenticeID).then(response => {
          if (response.data) {
            const apprentice = response.data.userByID;
            userContext.setCurrentUser(apprentice);
            getCategoryByID(categoryID).then(response => {
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
            getCategoryByID(categoryID).then(response => {
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

  useEffect(() => {
    userRatings?.map(rating => {
      const createdDate = parseISO(rating.createdAt);
      const formattedDate = toDate(createdDate);
      let newChartPoints = chartPoints;
      newChartPoints.push([formattedDate, rating.rating]);
      // @ts-ignore
      setChartPoints(newChartPoints);
    });
  }, [userRatings])

  return (
    <div className={classes.categoryPage}>
      <Typography variant={"h4"} className={classes.categoryName}>{categoryName}</Typography>
      {(userRatings && userRatings.length > 0) &&
        <section className={classes.chartSection}>
          <Chart
            className={classes.chart}
            width={"75%"}
            height={"80%"}
            chartType="ScatterChart"
            loader={<div>Loading Chart</div>}
            data={chartPoints}
            options={{
              title: categoryName + ' Ratings Over Time',
              hAxis: { title: 'Time' },
              vAxis: { title: 'Rating' },
              legend: 'none',
              trendlines: { 0: {} },
            }}
            rootProps={{ 'data-testid': '1' }} />
        </section>
      }
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
      })}
      </ul>
    </div>
  );
};

export default Category;
