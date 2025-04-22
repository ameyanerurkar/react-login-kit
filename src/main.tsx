import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoApp from './demo/DemoApp';

// Render the demo app for development purposes
// In production, this file would not be included when
// using the package as a dependency
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
); 