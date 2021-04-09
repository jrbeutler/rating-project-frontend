import React, { useEffect, useState } from "react";
import { Button, createStyles, FormLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { activateUser, archiveUser, getAllUsers, updateUserPosition } from "../../utils/requests/User";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";

type EditUserProps = {
  sessionToken: string,
};

type User = {
  id: string,
  email: string,
  firstname: string,
  lastname: string,
  role: string,
  isActive: string,
};

const useStyles = makeStyles(() =>
  createStyles({
    editTitle: {
      marginTop: '2.5rem',
      marginBottom: '0.25rem',
      fontSize: '2rem',
      width: '50%',
      margin: 'auto',
      textAlign: 'left',
    },
    editUserSection: {
      backgroundColor: '#909090',
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '50%',
      margin: 'auto',
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
      borderRadius: '20px',
    },
    editUserForm: {
      width: '80%',
      padding: '2rem',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    selectBox: {
      backgroundColor: '#FFFFFF',
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
    },
    formLabels: {
      color: '#FFFFFF',
      textAlign: 'left',
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
      margin: '1rem 0 0.5rem 0'
    },
    submitButton: {
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
      backgroundColor: '#F7931E',
      marginTop: '1rem',
    }
  }),
);

const EditUser: React.FC<EditUserProps> = ({sessionToken}) => {
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('Select a User');
  const [selectedActiveUser, setSelectedActiveUser] = useState<string>('');
  const [selectedArchivedUser, setSelectedArchivedUser] = useState<string>('');
  const [role, setRole] = useState<string>('APPRENTICE');
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState("successful");


  useEffect(() => {
    getAllUsers().then(usersResponse => {
      setUsers(usersResponse.data.allUsers);
    });
  }, []);

  const handleUserSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedUser(event.target.value as string);
  }

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRole(event.target.value as string);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const changeUserPosition = () => {
    updateUserPosition(sessionToken, selectedUser, role).then(response => {
      if (response.data) {
        setAlertOpen(true);
        setAlertType("successful");
      } else {
        setAlertOpen(true);
        setAlertType("failed");
      }
    })
  };

  const handleActiveUserSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedActiveUser(event.target.value as string);
  }

  const handleArchivedUserSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedArchivedUser(event.target.value as string);
  }

  const submitArchiveUser = () => {
    archiveUser(sessionToken, selectedActiveUser).then(response => {
      if (response.data) {
        setAlertOpen(true);
        setAlertType("successful");
      } else {
        setAlertOpen(true);
        setAlertType("failed");
      }
    });
  };

  const submitActivateUser = () => {
    activateUser(sessionToken, selectedArchivedUser).then(response => {
      if (response.data) {
        setAlertOpen(true);
        setAlertType("successful");
      } else {
        setAlertOpen(true);
        setAlertType("failed");
      }
    });
  };

  return (
    <>
      <Typography variant={"h2"} className={classes.editTitle}>Change User Role</Typography>
      <section className={classes.editUserSection}>
        <form className={classes.editUserForm} onSubmit={e => {
          e.preventDefault();
          changeUserPosition();
        }}>
          <FormLabel required className={classes.formLabels}>User</FormLabel>
          <Select
            className={classes.selectBox}
            required
            value={selectedUser}
            onChange={handleUserSelect}
          >
            {users.map(user => {
              return <MenuItem key={user.id} value={user.id}>{user.email}</MenuItem>
              }
            )}
          </Select>
          <FormLabel required className={classes.formLabels}>Role</FormLabel>
          <Select
            required
            className={classes.selectBox}
            value={role}
            onChange={handleRoleChange}
          >
            <MenuItem value={"APPRENTICE"}>APPRENTICE</MenuItem>
            <MenuItem value={"FTE"}>Full-Time Employee</MenuItem>
            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
          </Select>
          <Button type='submit' className={classes.submitButton}>Submit</Button>
        </form>
      </section>
      <Typography variant={"h2"} className={classes.editTitle}>Archive User</Typography>
      <section className={classes.editUserSection}>
        <form className={classes.editUserForm} onSubmit={e => {
          e.preventDefault()
          submitArchiveUser();
        }}>
          <FormLabel className={classes.formLabels} required>user</FormLabel>
          <Select
            className={classes.selectBox}
            required
            value={selectedActiveUser}
            onChange={handleActiveUserSelect}
          >
            {users.map(user => {
              return user.isActive && <MenuItem key={user.id} value={user.id}>{user.firstname}</MenuItem>
            })
            }
          </Select>
          <Button className={classes.submitButton} type='submit'>Archive user</Button>
        </form>
      </section>
      <Typography variant={"h2"} className={classes.editTitle}>Reactivate User</Typography>
      <section className={classes.editUserSection}>
        <form className={classes.editUserForm} onSubmit={e => {
          e.preventDefault();
          submitActivateUser();
        }}>
          <FormLabel className={classes.formLabels} required>user</FormLabel>
          <Select
            className={classes.selectBox}
            required
            value={selectedArchivedUser}
            onChange={handleArchivedUserSelect}
          >
            {users.map(user => {
              return !user.isActive && <MenuItem key={user.id} value={user.id}>{user.firstname}</MenuItem>
            })
            }
          </Select>
          <Button className={classes.submitButton} type='submit'>Activate user</Button>
        </form>
      </section>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        {alertType === "successful" ?
          <Alert onClose={handleClose} severity={"success"}>
            Updated Users!
          </Alert> :
          <Alert onClose={handleClose} severity={"error"}>
            Something went wrong, please try again!
          </Alert>
        }
      </Snackbar>
    </>
  );
};

export default EditUser;
