import React from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import Navbar from './components/navbar.jsx';
import Intro from './components/intro.jsx';
import Gallery from './components/gallery.jsx';
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
import BackToTop from './components/back-top.jsx';
import Preloader from './components/preloader.jsx';
import Stars from './components/Stars.jsx';
import floatingLogo from './img/logo5.png';

createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <Navbar />
    <img src={floatingLogo} alt="" className="floating-logo fl-1" />
    <img src={floatingLogo} alt="" className="floating-logo fl-2" />
    <img src={floatingLogo} alt="" className="floating-logo fl-3" />
    <img src={floatingLogo} alt="" className="floating-logo fl-4" />
    <img src={floatingLogo} alt="" className="floating-logo fl-5" />
    <div className="site-wrapper">
      <Stars />
      <Intro />
      <Gallery />
      <About />
      <Contact />
    </div>
    <BackToTop />
    <Preloader />
  </React.Fragment>
);
