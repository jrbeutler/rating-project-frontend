import React, { useContext, useEffect, useState } from "react";
import {NavLink, useHistory, useParams, useLocation} from 'react-router-dom';
import { format, parseISO, toDate } from "date-fns";
import { UserContext } from "../../App";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, MenuItem, Select, Typography, useMediaQuery } from "@material-ui/core";
import CreatedRatingCard from "../../components/CreatedRatingCard/CreatedRatingCard";
import {
  getOverallRatingAverage,
  getRatingsCreated, getUserRatings
} from "../../utils/requests/Rating";
import { Rating } from '@material-ui/lab';
import { RadioButtonChecked } from '@material-ui/icons';
import Chart from "react-google-charts";
import { getCategoryByID } from "../../utils/requests/Category";
import { getUserByID } from "../../utils/requests/User";

interface ParamTypes {
  apprenticeID: string
}

type UserRatings = [{
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
      marginBottom: '2rem',
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
    chartSection: {
      marginTop: '2rem'
    },
    chart: {
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
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
  }),
);

function groupBy(collection: any, property: string) {
  let i = 0, val, index,
    values = [], result = [];
  for (; i < collection.length; i++) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1)
      result[index].push(collection[i]);
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
}

const Account: React.FC = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();
  let location = useLocation();
  const [userName, setUserName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [userCreatedRatings, setUserCreatedRatings] = useState<UserRatings>();
  const [overallRating, setOverallRating] = useState<number>(0);
  const [chartPoints, setChartPoints] = useState<Array<Array<any>>>([['Time', 'Rating']]);
  const [userRatings, setUserRatings] = useState<UserRatings>();
  const [averageCategoryRatings, setAverageCategoryRatings] = useState<Array<any>>([]);
  const [currentTab, setCurrentTab] = useState<string>("Given");
  const ratingSelectView = useMediaQuery('(max-width: 1050px)');
  let { apprenticeID } = useParams<ParamTypes>();

  useEffect(() => {
    let userID;
    if (location.pathname === '/') {
      userID = userContext.currentUser.id;
    } else {
      userID = apprenticeID;
    }
    getOverallRatingAverage(userID).then(response => {
      setOverallRating(response.data.userOverallAverage);
    });
    getRatingsCreated(userID).then(response => {
      setUserCreatedRatings(response.data.userReviewedRatings);
    });
    getUserRatings(userID).then(response => {
      const allRatings = response.data.userRatings;
      setUserRatings(allRatings);
      const ratingsByCategory = groupBy(allRatings, "categoryID");
      let categoryID: string = '';
      let average: number = 0;
      let newCategoryAverageRatings: Array<any> = [];
      ratingsByCategory.forEach(categoryGroup => {
        categoryID = categoryGroup[0].categoryID;
        getCategoryByID(categoryID).then(response => {
          let summedRatings = 0;
          categoryGroup.forEach(rating => {
            summedRatings += rating.rating;
          });
          average = summedRatings / categoryGroup.length;
          const categoryAverageGroup =
            {
              "name": response.data.getCategoryByID.name,
              "categoryID": categoryID,
              "average": average,
            };
          newCategoryAverageRatings.push(categoryAverageGroup);
        });
      });
      setAverageCategoryRatings(newCategoryAverageRatings);
    });
  }, [apprenticeID, location.pathname, userContext.currentUser.id]);

  useEffect(() => {
    if (location.pathname !== '/') {
      getUserByID(apprenticeID).then(response => {
        let user = response.data.userByID;
        setUserName(user.firstname + " " + user.lastname);
        setRole(user.role);
      })
    } else {
      let user = userContext.currentUser;
      setUserName(user.firstname + " " + user.lastname);
      setRole(user.role);
    }
  }, [apprenticeID, location.pathname, userContext.currentUser])

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    userRatings?.map(rating => {
      const createdDate = parseISO(rating.createdAt);
      const formattedDate = toDate(createdDate);
      let newChartPoints = chartPoints;
      newChartPoints.push([formattedDate, rating.rating]);
      // @ts-ignore
      setChartPoints(newChartPoints);
    });
  }, [userRatings])

  const handleTabChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentTab(event.target.value as string);
  };

  return (
    <section className={classes.accountPage}>
      <section className={classes.profile}>
        <article>
          <Typography variant='h1' className={classes.name}>{userName}</Typography>
          <Typography variant='h2' className={classes.role}>{role}</Typography>
          <Typography className={classes.rating}>Overall Rating: <Rating name="overallRating" value={overallRating} precision={0.01} icon={<RadioButtonChecked fontSize="inherit"/>} readOnly/></Typography>
          {(userContext.currentUser.role === 'ADMIN' && location.pathname !== '/') &&
            <NavLink exact to='/manage' className={classes.link}>
              <Button variant='contained'>Manage Content</Button>
            </NavLink>
          }
        </article>
        <article className={classes.chartSection}>
        {(userRatings && userRatings.length > 0) ?
          <Chart
            className={classes.chart}
            chartType="ScatterChart"
            loader={<div>Loading Chart</div>}
            data={chartPoints}
            options={{
              title: ' Ratings Over Time',
              hAxis: { title: 'Time' },
              vAxis: { title: 'Rating', minValue: 0, maxValue: 5 },
              legend: 'none',
              trendlines: { 0: {} },
            }}
            rootProps={{ 'data-testid': '1' }} /> :
            <Typography variant={"h5"}>No ratings received!</Typography>
        }
        </article>
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
                {location.pathname === "/" && <NavLink exact to={'/category/' + categoryAverage.categoryID}
                         className={classes.link}>{categoryAverage.name}: </NavLink> }
                {location.pathname === ("/apprentice/" + apprenticeID) && <NavLink exact to={'/apprentice/' + apprenticeID + '/category/' + categoryAverage.categoryID}
                                                       className={classes.link}>{categoryAverage.name}: </NavLink> }
                <Rating name="categoryRating" value={categoryAverage.average} precision={0.1}
                        icon={<RadioButtonChecked fontSize="inherit"/>} size={'small'} readOnly/>
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
