import '@fontsource-variable/archivo';
import '@fontsource/caveat/700.css';
import './styles/tokens.css';
import './styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Today from './pages/Today';
import Course from './pages/Course';
import Skills from './pages/Skills';
import Jobs from './pages/Jobs';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Today /> },
        { path: 'course', element: <Course /> },
        { path: 'skills', element: <Skills /> },
        { path: 'jobs', element: <Jobs /> },
      ],
    },
  ],
  { basename: '/hr-quest/' }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
