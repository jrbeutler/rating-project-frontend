import React, { useContext, useState } from "react";
import { Button, createStyles, MenuItem, Select, Typography, useMediaQuery } from "@material-ui/core";
import AddCategory from "../../components/AddCategory/AddCategory";
import { SessionContext, UserContext } from "../../App";
import AddUser from "../../components/AddUser/AddUser";
import EditUser from "../../components/EditUser/EditUser";
import EditCategory from "../../components/EditCategory/EditCategory";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    adminPage: {
      backgroundColor: '#85CAB0',
      width: '100%',
      height: '100%',
      '@media only screen and (max-width: 320px)': {
        height: '700px',
      },
      paddingTop: '0.5rem',
    },
    title: {
      fontSize: '2.5rem',
      margin: '1.25rem',
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
  }),
);

const AdminPanel: React.FC = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState("Categories");
  const categorySelectView = useMediaQuery('(max-width: 1050px)');
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserContext);

  const handleTabChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentTab(event.target.value as string);
  };

  return (
    <main className={classes.adminPage}>
      <Typography className={classes.title} variant={"h1"}>Manage Rating Service</Typography>
      <section className={classes.tabSection}>
        {!categorySelectView ?
          <article className={classes.tabArticle}>
            <Button onClick={() => setCurrentTab("Categories")}
                    className={currentTab === "Categories" ? classes.activeButton : classes.tabButton}
            >
              Categories
            </Button>
            {userContext.currentUser.role === "ADMIN" &&
            <Button onClick={() => setCurrentTab("Users")}
                    className={currentTab === "Users" ? classes.activeButton : classes.tabButton}
            >
              Users
            </Button>
            }
          </article> :
          <Select
            className={classes.select}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentTab}
            onChange={handleTabChange}
          >
            <MenuItem value={"Categories"}>Categories</MenuItem>
            <MenuItem value={"Users"}>Users</MenuItem>
          </Select>
        }
      </section>
      <section>
        {currentTab === "Categories" &&
          <>
            <EditCategory sessionToken={sessionContext.sessionToken} />
            <AddCategory sessionToken={sessionContext.sessionToken} />
          </>
        }
        {currentTab === "Users" &&
          <>
            <EditUser sessionToken={sessionContext.sessionToken} />
            <AddUser sessionToken={sessionContext.sessionToken} />
          </>
        }
      </section>
    </main>
  );
};

export default AdminPanel;
