import React from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';
import './components/stars.scss';
import './style.css';

import Navbar from './components/navbar.jsx';
import Intro from './components/intro.jsx';
import Gallery from './components/gallery.jsx';
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
import BackToTop from './components/back-top.jsx';
import Preloader from './components/preloader.jsx';

createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <Navbar />
    <div className="site-wrapper">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <Intro />
      <Gallery />
      <About />
      <Contact />
    </div>
    <BackToTop />
    <Preloader />
  </React.Fragment>
);
