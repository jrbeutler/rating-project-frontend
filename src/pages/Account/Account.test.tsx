import React from 'react';
import { render, screen } from '@testing-library/react';
import Account from "./Account";
import {Router} from "@material-ui/icons";

test('renders Account component', () => {
  const app = render(
    <Router>
      <Account />
    </Router>);

  expect(app).toBeTruthy();
});
