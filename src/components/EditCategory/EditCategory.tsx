import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, FormLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import { activateCategory, archiveCategory, getAllCategories } from "../../utils/requests/Category";

type EditCategoryProps = {
  sessionToken: string,
};

type Category = {
  id: string,
  name: string,
  isActive: boolean,
}

const useStyles = makeStyles(() =>
  createStyles({
    editCategoryTitle: {
      marginTop: '2.5rem',
      marginBottom: '0.25rem',
      fontSize: '2rem',
      width: '50%',
      margin: 'auto',
      textAlign: 'left',
    },
    editCategorySection: {
      backgroundColor: '#909090',
      '@media only screen and (max-width: 1050px)': {
        width: '90%',
      },
      width: '50%',
      margin: 'auto',
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
      borderRadius: '20px',
    },
    editCategoryForm: {
      width: '80%',
      padding: '2rem',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
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
    selectBox: {
      backgroundColor: '#FFFFFF',
      '@media only screen and (max-width: 1050px)': {
        width: '100%',
      },
      width: '30%',
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

const EditCategory: React.FC<EditCategoryProps> = ({sessionToken}) => {
  const classes = useStyles();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArchivedCategory, setSelectedArchivedCategory] = useState<string>('');
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState("successful");

  useEffect(() => {
    getAllCategories().then(response => {
      if (response.data) {
        setCategories(response.data.getAllCategories);
      } else {
        console.log(response);
      }
    })
  }, [])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleCategorySelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as string);
  }

  const handleArchivedCategorySelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedArchivedCategory(event.target.value as string);
  }

  const submitArchiveCategory = () => {
    archiveCategory(sessionToken, selectedCategory).then(response => {
      if (response.data) {
        setAlertOpen(true);
        setAlertType("successful");
      } else {
        setAlertOpen(true);
        setAlertType("failed");
      }
    })
  }

  const submitActivateCategory = () => {
    activateCategory(sessionToken, selectedArchivedCategory).then(response => {
      if (response.data) {
        setAlertOpen(true);
        setAlertType("successful");
      } else {
        setAlertOpen(true);
        setAlertType("failed");
      }
    })
  }

  return (
    <>
      <Typography variant={"h2"} className={classes.editCategoryTitle}>Archive Category</Typography>
      <section className={classes.editCategorySection}>
        <form className={classes.editCategoryForm} onSubmit={e => {
          e.preventDefault();
          submitArchiveCategory();
        }}>
          <FormLabel className={classes.formLabels} required>Category</FormLabel>
          <Select
            className={classes.selectBox}
            required
            value={selectedCategory}
            onChange={handleCategorySelect}
          >
            {categories.map(category => {
                return category.isActive && <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            })
            }
          </Select>
          <Button className={classes.submitButton} type='submit'>Archive Category</Button>
        </form>
      </section>
      <Typography variant={"h2"} className={classes.editCategoryTitle}>Reactivate Category</Typography>
      <section className={classes.editCategorySection}>
        <form className={classes.editCategoryForm} onSubmit={e => {
          e.preventDefault();
          submitActivateCategory();
        }}>
          <FormLabel className={classes.formLabels} required>Category</FormLabel>
          <Select
            className={classes.selectBox}
            required
            value={selectedArchivedCategory}
            onChange={handleArchivedCategorySelect}
          >
            {categories.map(category => {
              return !category.isActive && <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            })
            }
          </Select>
          <Button className={classes.submitButton} type='submit'>Activate Category</Button>
        </form>
      </section>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        {alertType === "successful" ?
          <Alert onClose={handleClose} severity={"success"}>
            Changed Category Information!
          </Alert> :
          <Alert onClose={handleClose} severity={"error"}>
            Something went wrong, please try again!
          </Alert>
        }
      </Snackbar>
    </>
  );
};

export default EditCategory;
