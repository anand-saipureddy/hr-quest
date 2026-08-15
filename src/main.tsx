import '@fontsource-variable/archivo';
import '@fontsource/caveat/700.css';
import './styles/tokens.css';
import './styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { ProgressProvider } from './lib/progress-context';
import Today from './pages/Today';
import Course from './pages/Course';
import Lesson from './pages/Lesson';
import Flashcards from './pages/Flashcards';
import Skills from './pages/Skills';
import SkillTrack from './pages/SkillTrack';
import Jobs from './pages/Jobs';
import Break from './pages/Break';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Today /> },
        { path: 'course', element: <Course /> },
        { path: 'course/:moduleId/:lessonId', element: <Lesson /> },
        { path: 'course/:moduleId/:lessonId/cards', element: <Flashcards /> },
        { path: 'skills', element: <Skills /> },
        { path: 'skills/:trackId', element: <SkillTrack /> },
        { path: 'jobs', element: <Jobs /> },
        { path: 'break', element: <Break /> },
      ],
    },
  ],
  { basename: '/hr-quest/' }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  </React.StrictMode>
);
