import React from 'react';
import { render, screen } from '@testing-library/react';
import Rate from "./Rate";
import {Router} from "@material-ui/icons";

test('renders AddCategory component', () => {
  const app = render(
    <Router>
      <Rate />
    </Router>);

  expect(app).toBeTruthy();
});
