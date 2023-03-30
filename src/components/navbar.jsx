import React from "react";
import $ from "jquery";

class Navbar extends React.Component {
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
