import React from 'react';
import ReactDOM from 'react-dom';

//import css in order
import 'normalize.css';
import './animate.css';
import 'bootstrap/dist/css/bootstrap.css';
import './img/font-awesome/css/font-awesome.css';
import './style.css';

//import js libraries
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import './libs/easing.js';

//import components
import Navbar from './components/navbar.jsx';
import Intro from './components/intro.jsx';
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
import BackToTop from './components/back-top.jsx';
import Preloader from './components/preloader';



ReactDOM.render(
    <React.Fragment>
        <Navbar />
        <Intro />
        <About />
        <Contact />
        <BackToTop />
        <Preloader />
    </React.Fragment>,
    document.getElementById('root'));

