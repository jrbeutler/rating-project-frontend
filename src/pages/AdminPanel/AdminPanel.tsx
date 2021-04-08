import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import AddCategory from "../../components/AddCategory/AddCategory";
import { SessionContext, UserContext } from "../../App";
import AddUser from "../../components/AddUser/AddUser";
import EditUser from "../../components/EditUser/EditUser";
import EditCategory from "../../components/EditCategory/EditCategory";

const AdminPanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("Categories");
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserContext);

  return (
    <main>
      <Typography variant={"h1"}>Manage Rating Service</Typography>
      <section>
        <Button onClick={() => setCurrentTab("Categories")}>
          Categories
        </Button>
        {userContext.currentUser.role === "ADMIN" &&
          <Button onClick={() => setCurrentTab("Users")}>
            Users
          </Button>
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
