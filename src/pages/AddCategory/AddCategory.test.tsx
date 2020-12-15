import React from 'react';
import { render, screen } from '@testing-library/react';
import AddCategory from "./AddCategory";
import {Router} from "@material-ui/icons";

test('renders AddCategory component', () => {
  const app = render(
    <Router>
      <AddCategory />
    </Router>);

  expect(app).toBeTruthy();
});
