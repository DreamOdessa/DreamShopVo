import React from 'react';
import ReactDOM from 'react-dom/client';
import MaintenancePage from './MaintenancePage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MaintenancePage />
  </React.StrictMode>
);
