import React, {useState} from "react";
import logo from "../img/logo3.png";
import { useMediaQuery } from 'react-responsive'


export default function Contact() {
  const isPortrait = useMediaQuery({ query: '(max-width: 750px)' })
  const MAX_COUNT = 5;

  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [phone, setPhone] = useState()
  const [description, setDescription] = useState()
  const [submitted, setSubmitted] = useState(false)
  const [location, setLocation] = useState()
  const formFilled = name && email && phone && description && location

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [fileLimit, setFileLimit] = useState(false);

 const handleUploadFiles = files => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    alert(`You can only add a maximum of ${MAX_COUNT} files`);
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
        })
        if (!limitExceeded) setUploadedFiles(uploaded)

    }

    const handleFileEvent =  (e) => {
      const chosenFiles = Array.prototype.slice.call(e.target.files)
      handleUploadFiles(chosenFiles);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const templateParams = {
        firstName: data.get('firstName'),
        email: data.get('email'),
        phone: data.get('phone'),
        description: data.get('description'),
        location: data.get('location'),
        attachments: uploadedFiles
    }
    console.log(templateParams)
    setSubmitted(true)
}
console.log(isPortrait)
  return (
    <div id="home" className="intro route bg-image background">
    <div id="stars" />
    <div id="stars2" />
    <div id="stars3" />
      <div className="intro-content display-table"></div>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 sect-pt12">
            <div className="contact-mf">
              <div id="contact" className="box-shadow-full pb-3">
                <div className="row">
                <div className={`wrapper searchDiv ${isPortrait ? "col-md-12" : "col-md-6"}`}>
                    <div className="title-box-2">
                      <h5 className="title-left">Send A Message</h5>
                    </div>
                    <div>
                      <form onSubmit={handleSubmit} className="contactForm">
                        <div id="sendmessage">
                          Your message has been sent. Thank you!
                        </div>
                        <div id="errormessage"></div>
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <div className="form-group">
                              <input
                                type="text"
                                name="firstName"
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                                id="name"
                                placeholder="Your Name"
                                data-rule="minlen:4"
                                data-msg="Please enter at least 4 chars"
                              />
                              <div className="validation"></div>
                            </div>
                          </div>
                          <div className="col-md-12 mb-3">
                            <div className="form-group">
                              <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                name="email"
                                id="email"
                                placeholder="Your Email"
                                data-rule="email"
                                data-msg="Please enter a valid email"
                              />
                              <div className="validation"></div>
                            </div>
                          </div>
                          <div className="col-md-12 mb-3">
                            <div className="form-group">
                              <input
                                type="text"
                                onChange={(e) => setPhone(e.target.value)}
                                className="form-control"
                                name="phone"
                                id="phone"
                                data-rule="required"
                                placeholder="Phone Number"
                              />
                              <div className="validation"></div>
                            </div>
                          </div>
                          <div className="col-md-12 mb-3">
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                onChange={(e) => setDescription(e.target.value)}
                                name="description"
                                rows="5"
                                id="description"
                                data-rule="required"
                                placeholder="Description - Please be as detailed as possible."
                              ></textarea>
                              <div className="validation"></div>
                            </div>
                          </div>
                          <div className="col-md-12 mb-3">
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                name="location"
                                onChange={(e) => setLocation(e.target.value)}
                                rows="2"
                                id="location"
                                data-rule="required"
                                placeholder="Location & size"
                              ></textarea>
                              <div className="validation"></div>
                            </div>
                          </div>
                          <div className="col-md-12 mb-3">
                            <div className="form-group">
                              <input hidden id='fileUpload' type='file' multiple
                                      accept='application/pdf, image/png'
                                                onChange={handleFileEvent}
                                                disabled={fileLimit}
                                  />

                              <label htmlFor='fileUpload'>
                                <a  className={`btn btn-success ${!fileLimit ? '' : 'disabled' } `}>Upload Files</a>
                              </label>
                              <div className="uploaded-files-list text-black-50">
                                {uploadedFiles.map(file => (
                                            <div >
                                                {file.name}
                                            </div>
                                        ))}
                              </div>

                              <div className="validation"></div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="form-group">
                          {formFilled ?
                            (
                              <button
                              type="submit"
                              className="button-big btn-primary btn rainbow-button btn"
                              >
                              Send Message
                            </button>
                            ) : (
                              <button
                              className="button button-big disable-button"
                            >
                              Send Message
                            </button>
                            )
                          }
                          <div className="validation"></div>
                            </div>
                          </div>

                        </div>
                      </form>
                    </div>
                  </div>
                  {
                    isPortrait ? (
                    <div></div>
                    ) : (
                    <div className="col-md-6">
                      <div className="title-box-2 pt-4 pt-md-0">
                        <h5 className="title-left">Get in Touch</h5>
                      </div>
                      <div className="more-info">
                        <p className="lead text-black-50">
                          Please read the FAQ section before submitting an email
                          {/* <br />
                          Simply fill the from and send me an email. */}
                        </p>
                        {/* <!-- <ul class="list-ico">
                                <li><span class="ion-ios-location"></span> 329 WASHINGTON ST BOSTON, MA 02108</li>
                                <li><span class="ion-ios-telephone"></span> (617) 557-0089</li>
                                <li><span class="ion-email"></span> contact@example.com</li>
                                </ul> --> */}

                      </div>
                      <div className="socials">
                        <ul>
              
                          <li>
                            <a
                              href=""
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="ico-circle">
                                <i className="ion-social-instagram"></i>
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="text-center">
                          <img
                            src={logo}
                            alt="logo"
                            style={{ maxWidth: "70%"}}
                          />
                      </div>
                    </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="copyright-box">
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
}

