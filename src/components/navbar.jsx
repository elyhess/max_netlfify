import React from "react";
import $ from "jquery";

import logo1 from "../img/logo4.webp";
import logo2 from "../img/logo.webp";

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      logo: logo1
    };
  }

  componentDidMount() {
    const nav = $("nav");
    let navHeight = nav.outerHeight();

    $("body").scrollspy({
      target: "#mainNav",
      offset: navHeight
    });

    $('a.js-scroll[href*="#"]:not([href="#"])').on("click", function () {
      if (
        window.location.pathname.replace(/^\//, "") ===
        this.pathname.replace(/^\//, "") &&
        window.location.hostname === this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          console.log(target.length)
          console.log(navHeight)
          $("html, body").animate(
            {
              scrollTop: target.offset().top - navHeight + 5
            },
            1000,
            "easeInExpo"
          );
          return false;
        }
      }
    });
  }

  render() {
    return (
      <nav id="mainNav">
      </nav>
    );
  }
}

export default Navbar;
