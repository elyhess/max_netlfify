import React from "react";

import img1 from '../maxvktattoos/1.webp'
import img2 from '../maxvktattoos/2.webp'
import img3 from '../maxvktattoos/3.webp'
import img4 from '../maxvktattoos/4.webp'
import img5 from '../maxvktattoos/5.webp'
import img6 from '../maxvktattoos/6.webp'
import img7 from '../maxvktattoos/7.webp'
import img8 from '../maxvktattoos/8.webp'
import img9 from '../maxvktattoos/9.webp'
import img10 from '../maxvktattoos/10.webp'
import img11 from '../maxvktattoos/11.webp'
import img12 from '../maxvktattoos/12.webp'
import img13 from '../maxvktattoos/13.webp'
import img14 from '../maxvktattoos/14.webp'
import img15 from '../maxvktattoos/15.webp'
import img16 from '../maxvktattoos/16.webp'
import img17 from '../maxvktattoos/17.webp'
import img18 from '../maxvktattoos/18.webp'
import img19 from '../maxvktattoos/19.webp'
import img20 from '../maxvktattoos/20.webp'
import img21 from '../maxvktattoos/21.webp'

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21
]

export default function Portfolio() {
    return (
      <section id="work" className="portfolio-mf sect-pt4 route">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="title-box text-center">
                <h3 className="title-a sect-pt4">Portfolio</h3>
                <p className="subtitle-a">
                ✨trippy tats for groovy cats✨
                </p>
                <div className="line-mf"></div>
              </div>
            </div>
          </div>
          <div className="row">
          {images.map((image, index) => (
            <div className="col-md-4">
              <div className="work-box">
                <a href={image} data-lightbox="gallery-vmarine">
                  <div className="work-img" key={1}>
                    <img src={image} alt="" className="img-fluid" />
                  </div>
                  <div className="work-content">
                    <div className="row">
                      <div className="col-sm-8">
                        {/* <h2 className="w-title">Lorem Ipsum</h2> */}
                        <div className="w-more">
                          <span className="w-ctegory">
                            HTML5 CSS3 Bootstrap ReactJS
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="w-like">
                          <span className="ion-ios-plus-outline"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
    );
  }
