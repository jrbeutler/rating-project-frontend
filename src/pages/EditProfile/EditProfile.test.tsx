import React from 'react';
import { render } from '@testing-library/react';
import {Router} from "@material-ui/icons";
import EditProfile from "./EditProfile";

test('renders AddCategory component', () => {
  const app = render(
    <Router>
      <EditProfile />
    </Router>);

  expect(app).toBeTruthy();
});
