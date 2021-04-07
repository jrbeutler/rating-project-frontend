import React from 'react';
import { render, screen } from '@testing-library/react';
import {Router} from "@material-ui/icons";
import AdminPanel from "./AdminPanel";

test('renders AdminPanel component', () => {
  const app = render(
    <Router>
      <AdminPanel />
    </Router>);

  expect(app).toBeTruthy();
});
