import React, { useContext, useEffect, useState } from "react";
import {NavLink, useHistory, useParams, useLocation} from 'react-router-dom';
import { format, parseISO, toDate } from 'date-fns';
import { UserContext } from "../../App";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, MenuItem, Select, Typography, useMediaQuery } from "@material-ui/core";
import CreatedRatingCard from "../../components/CreatedRatingCard/CreatedRatingCard";
import {
  getCategoryAverages,
  getOverallRatingAverage,
  getRatingsCreated, getUserAllRatings,
} from '../../utils/requests/Rating';
import {getCurrentUser, getUserByID} from "../../utils/requests/User";
import { Rating } from '@material-ui/lab';
import { RadioButtonChecked } from '@material-ui/icons';
import Chart from 'react-google-charts';

interface ParamTypes {
  apprenticeID: string
}

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

const useStyles = makeStyles((theme) =>
  createStyles({
    accountPage: {
      backgroundColor: '#85CAB0',
      paddingTop: '2rem',
      width: '100%',
      height: '100vh',
      '@media only screen and (max-width: 500px)': {
        height: '830px',
      },
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
    name: {
      [theme.breakpoints.down("sm")]:{
        textAlign: 'center',
      },
      [theme.breakpoints.up("md")]:{
        textAlign: 'left',
      },
      fontSize: '2rem',
      fontWeight: 'normal',
      paddingBottom: '0.5rem',
      borderBottom: 'solid 2px',
    },
    role: {
      [theme.breakpoints.down("sm")]:{
        textAlign: 'center',
      },
      [theme.breakpoints.up("md")]:{
        textAlign: 'left',
      },
      fontSize: '1.5rem',
      fontWeight: 'normal',
      marginTop: '0.5rem',
      marginBottom: '0.5rem',
    },
    rating: {
      marginBottom: '1rem',
    },
    select: {
      width: '10rem',
      marginBottom: '1rem',
    },
    tabSection: {
      backgroundColor: '#85CAB0',
    },
    tabArticle: {
      marginBottom: '1rem',
    },
    tabButton: {
      fontSize: '1rem',
      textDecoration: 'underline',
    },
    activeButton: {
      color: '#FFFFFF',
      fontSize: '1rem',
      textDecoration: 'underline',
    },
    userReviewedSection: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      backgroundColor: '#85CAB0',
    },
    categoriesSection: {
      display: 'flex',
      flexFlow: 'wrap',
      '@media only screen and (max-width: 500px)': {
        flexDirection: 'column',
        flexFlow: 'no-wrap',
      },
      '@media only screen and (max-width: 1050px)': {
        width: '80%',
      },
      width: '70%',
      margin: 'auto auto auto 25%',
      justifyContent: 'flex-start',
    },
    category: {
      flex: '0 50%',
      marginBottom: '1rem',
      textAlign: 'left',
    },
    link: {
      marginRight: '1rem',
      fontSize: '1.25rem',
      color: '#000000',
      textDecoration: 'none',
      textAlign: 'right',
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
    editButton: {
      backgroundColor: '#F7931E',
      marginTop: '1rem',
      marginBottom: '2rem'
    },
    chartSection: {
      display: 'flex',
      justifyContent: 'center',
      width: '75%',
    },
    chart: {
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
      marginLeft: '8.5rem',
      '@media only screen and (max-width: 500px)': {
        marginLeft: '20px',
      },
    },
  }),
);

const Account: React.FC = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();
  let location = useLocation();
  const [userCreatedRatings, setUserCreatedRatings] = useState<UserCreatedRatings>();
  const [overallRating, setOverallRating] = useState<number>(0);
  const [averageCategoryRatings, setAverageCategoryRatings] = useState<CategoryAverages>();
  const [currentTab, setCurrentTab] = useState<string>("Given");
  const ratingSelectView = useMediaQuery('(max-width: 1050px)');
  let { apprenticeID } = useParams<ParamTypes>();
  const [userRatings, setUserRatings] = useState<UserCreatedRatings>();
  const [chartPoints, setChartPoints] = useState<Array<Array<any>>>([['Time', 'Rating']]);

  const sessionToken = window.sessionStorage.getItem('ratingToken');

  useEffect(() => {
    if (sessionToken) {
      if (apprenticeID != null){
        getUserByID(sessionToken, apprenticeID).then(response => {
          if (response.data) {
            const apprentice = response.data.userByID;
            userContext.setCurrentUser(apprentice);
            getOverallRatingAverage(sessionToken, apprentice.id).then(response => {
              setOverallRating(response.data.userOverallAverage);
            });
            getUserAllRatings(sessionToken, apprentice.id).then(response => {
              setUserRatings(response.data.userAllRatings);
            });
            getCategoryAverages(sessionToken, apprentice.id).then(response => {
              setAverageCategoryRatings(response.data.userRatingCategoryAverages);
            });
            getRatingsCreated(sessionToken, apprentice.id).then(response => {
              setUserCreatedRatings(response.data.userReviewedRatings);
            })
          } else {
            history.push('/login');
          }
        });
      }
      else {
        getCurrentUser(sessionToken).then(response => {
          if (response.data) {
            const user = response.data.me;
            userContext.setCurrentUser(user);
            getOverallRatingAverage(sessionToken, user.id).then(response => {
              setOverallRating(response.data.userOverallAverage);
            });
            getUserAllRatings(sessionToken, user.id).then(response => {
              setUserRatings(response.data.userAllRatings);
            });
            getCategoryAverages(sessionToken, user.id).then(response => {
              console.log(response);
              setAverageCategoryRatings(response.data.userRatingCategoryAverages);
            });
            getRatingsCreated(sessionToken, user.id).then(response => {
              setUserCreatedRatings(response.data.userReviewedRatings);
            })
          } else {
            history.push('/login');
          }
        });
      }} else {
      history.push('/login');
    }
  }, []);

  useEffect(() => {
    userRatings?.map(rating => {
      const createdDate = parseISO(rating.createdAt);
      const formattedDate = toDate(createdDate);
      let newChartPoints = chartPoints;
      newChartPoints.push([formattedDate, rating.rating]);
      // @ts-ignore
      setChartPoints(newChartPoints);
      console.log(chartPoints);
    });
  }, [userRatings])

  const handleTabChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentTab(event.target.value as string);
  };

  return (
    <section className={classes.accountPage}>
      <section className={classes.profile}>
        <article>
          <Typography variant='h1' className={classes.name}>{userContext.currentUser.firstname} {userContext.currentUser.lastname}</Typography>
          <Typography variant='h2' className={classes.role}>{userContext.currentUser.role}</Typography>
          <Typography className={classes.rating}>Overall Rating: <Rating name="overallRating" value={overallRating} precision={0.01} icon={<RadioButtonChecked fontSize="inherit"/>} readOnly/></Typography>
          {userContext.currentUser.role === 'ADMIN' &&
          <NavLink exact to='/addCategory' className={classes.link}>
            <Button variant='contained'>Add Category</Button>
          </NavLink>
          }
        </article>

          <section className={classes.chartSection}>
            <Chart
              className={classes.chart}
              width={"75%"}
              height={"80%"}
              chartType="ScatterChart"
              loader={<div>Loading Chart</div>}
              data={chartPoints}
              options={{
                title: 'Overall Ratings Over Time',
                hAxis: { title: 'Time' },
                vAxis: { title: 'Rating' },
                legend: 'none',
                trendlines: { 0: {} },
              }}
              rootProps={{ 'data-testid': '1' }}
            />
          </section>

      </section>
      <section className={classes.tabSection}>
        {!ratingSelectView ?
          <article className={classes.tabArticle}>
            <Button onClick={() => setCurrentTab("Categories")}
                    className={currentTab === "Categories" ? classes.activeButton : classes.tabButton}
            >Rating Categories
            </Button>
            <Button onClick={() => setCurrentTab("Given")}
                    className={currentTab === "Given" ? classes.activeButton : classes.tabButton}
            >Ratings Given
            </Button>
          </article> :
          <Select
            className={classes.select}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentTab}
            onChange={handleTabChange}
          >
            <MenuItem value={"Categories"}>Rating Categories</MenuItem>
            <MenuItem value={"Given"}>Ratings Given</MenuItem>
          </Select>
        }
        {currentTab === "Categories" ?
          <section className={classes.categoriesSection}>
            {(averageCategoryRatings && averageCategoryRatings.length > 0) &&
            averageCategoryRatings.map(categoryAverage => {
              return <Typography key={categoryAverage.categoryID} className={classes.category}>
                <NavLink exact to={'/category/' + categoryAverage.categoryID} className={classes.link}>{categoryAverage.name}: </NavLink>
                <Rating name="categoryRating" value={categoryAverage.average} precision={0.1} icon={<RadioButtonChecked fontSize="inherit"/>} size={'small'} readOnly/>
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
        {location.pathname === '/' && <Button onClick={() => history.push('editProfile')}
                                              className={classes.editButton}>
          Edit Profile
        </Button>}
      </section>
    </section>
  );
};

export default Account;
