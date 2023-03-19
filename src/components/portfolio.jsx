import React, { useState } from "react";

const imagePerRow = 3;

export default function Portfolio() {
  function importAll(r) {
    let images = [];
    r.keys().map((item, index) => { images[index] = r(item); });
    return images;
  }

  const allImages = importAll(require.context('../maxvktattoos', false, /\.(webp)$/));
  const [next, setNext] = useState(imagePerRow);
  const handleMoreImage = () => {
    setNext(next + imagePerRow);
  };
  return (
    <section id="work" className="portfolio-mf sect-pt4 route">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="title-box text-center">
              <h3 className="title-a sect-pt4">My Work</h3>
              <div className="line-mf"></div>
            </div>
          </div>
        </div>
        <div className="row">
          {allImages?.slice(0, next)?.map((image, index) => (
            <div className="col-md-4" key={index}>
              <div className="work-box">
                <a href={image} data-lightbox="gallery-vmarine">
                  <div className="work-img">
                    <img src={image} alt="" className="img-fluid" />
                  </div>
                  {/* <div className="work-content"> */}
                  {/* <div className="row"> */}
                  {/* <div className="col-sm-8">
                        <h2 className="w-title">Lorem Ipsum</h2>
                        <div className="w-more">
                          <span className="w-ctegory">
                            HTML5 CSS3 Bootstrap ReactJS
                          </span>
                        </div>
                      </div> */}
                  {/* <div className="col-sm-4">
                        <div className="w-like">
                          <span className="ion-ios-plus-outline"></span>
                        </div>
                      </div> */}
                  {/* </div> */}
                  {/* </div> */}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-5 text-center">
          {
            next < allImages?.length && (
              <button
                className="button-big btn-primary btn rainbow-button btn"
                onClick={() => {
                  handleMoreImage();
                }}>
                Load More Images...
              </button>
            )
          }
        </div>
      </div>
    </section>
  );
}
