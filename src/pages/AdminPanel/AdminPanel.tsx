import React, { useState } from "react";
import { Button, Typography } from "@material-ui/core";

const AdminPanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("Categories");

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
        <Typography>{currentTab}</Typography>
      </section>
    </main>
  );
};

export default AdminPanel;
