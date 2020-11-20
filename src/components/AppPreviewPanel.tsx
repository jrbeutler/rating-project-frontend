import React from 'react';
import LandingPage from '../assets/LandingPage.png';

const AppPreviewPanel: React.FC = () => {
  return (
    <section>
      <img src={LandingPage} alt='Mobile Landing Page' title='Mobile Landing Page' />
    </section>
  )
};

export default AppPreviewPanel;
