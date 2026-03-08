import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

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

const floatingLogoClasses = ['fl-1', 'fl-2', 'fl-3', 'fl-4', 'fl-5'];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    {floatingLogoClasses.map((className) => (
      <img key={className} src={floatingLogo} alt="" className={`floating-logo ${className}`} />
    ))}
    <div className="max-cutout-layer" aria-hidden="true" />
    <div className="site-wrapper">
      <Stars />
      <Intro />
      <Gallery />
      <About />
      <Contact />
    </div>
    <BackToTop />
    <Preloader />
  </StrictMode>
);
