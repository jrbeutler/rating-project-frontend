import React from 'react';
import { render, screen } from '@testing-library/react';
import AddUser from "./AddUser";
import {Router} from "@material-ui/icons";

test('renders AddCategory component', () => {
  const app = render(
    <Router>
      <AddUser />
    </Router>);

  expect(app).toBeTruthy();
});
