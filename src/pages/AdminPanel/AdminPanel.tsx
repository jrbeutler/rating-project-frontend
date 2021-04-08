import React, { useContext, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import AddCategory from "../../components/AddCategory/AddCategory";
import { SessionContext } from "../../App";
import AddUser from "../../components/AddUser/AddUser";

const AdminPanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("Categories");
  const sessionContext = useContext(SessionContext);

  return (
    <main>
      <Typography variant={"h1"}>Manage Rating Service</Typography>
      <section>
        <Button onClick={() => setCurrentTab("Categories")}>
          Categories
        </Button>
        <Button onClick={() => setCurrentTab("Users")}>
          Users
        </Button>
      </section>
      <section>
        {currentTab === "Categories" &&
          <AddCategory sessionToken={sessionContext.sessionToken} />
        }
        {currentTab === "Users" &&
          <AddUser sessionToken={sessionContext.sessionToken} />
        }
      </section>
    </main>
  );
};

export default AdminPanel;
