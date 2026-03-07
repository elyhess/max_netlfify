import React from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import Navbar from './components/navbar.jsx';
import Intro from './components/intro.jsx';
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
import BackToTop from './components/back-top.jsx';
import Preloader from './components/preloader.jsx';

createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <Navbar />
    <Intro />
    <About />
    <Contact />
    <BackToTop />
    <Preloader />
  </React.Fragment>
);
