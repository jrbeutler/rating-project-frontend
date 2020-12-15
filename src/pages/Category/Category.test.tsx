import React from 'react';
import { render, screen } from '@testing-library/react';
import Category from "./Category";
import {Router} from "@material-ui/icons";

test('renders AddCategory component', () => {
  const app = render(
    <Router>
      <Category />
    </Router>);

  expect(app).toBeTruthy();
});
