import React from 'react';
import PhonePreview from '../../assets/PhonePreview.png';
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    deviceSection: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      height: '100vh',
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    deviceImage: {
      width: '15rem',
    }
  })
);

const AppPreviewPanel: React.FC = () => {
  const classes = useStyles();

  return (
    <section className={classes.deviceSection}>
      <img className={classes.deviceImage} src={PhonePreview} alt='Mobile Landing Page' title='Mobile Landing Page' />
    </section>
  )
};

export default AppPreviewPanel;
