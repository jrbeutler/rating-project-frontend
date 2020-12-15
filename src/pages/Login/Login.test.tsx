import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from "./Login";
import {Router} from "@material-ui/icons";

test('renders AddCategory component', () => {
  const app = render(
    <Router>
      <Login />
    </Router>);

  expect(app).toBeTruthy();
});
