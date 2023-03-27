import React, { useRef, useState } from "react";
import axios from 'axios';
import logo from "../img/logo3.webp";
import { useMediaQuery } from 'react-responsive'
import Compressor from "compressorjs";
import sendEmail from "../services/EmailService";

export default function Contact() {
  const isPortrait = useMediaQuery({ query: '(max-width: 750px)' })
  const MAX_COUNT = 5;

  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [phone, setPhone] = useState()
  const [description, setDescription] = useState()
  const [submitted, setSubmitted] = useState(false)
  const [location, setLocation] = useState()
  // const formFilled = name && email && phone && description && location
  const formFilled = true
  const form = useRef()

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [formattedFiles, setFormattedFiles] = useState([])
  const [fileLimit, setFileLimit] = useState(false)
  const [totalSize, setTotalSize] = useState(0)

  async function handleUploadFiles(files) {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    let newSize = totalSize;

    const options = {
      quality: 0.2,
      maxWidth: 600
    };

    const formattedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const compressedFile = await new Promise((resolve) => {
            new Compressor(file, {
              ...options,
              success: (result) => {
                resolve(result);
              },
              error: (err) => {
                console.error(err);
                resolve(null);
              },
            });
          });

          if (!compressedFile) {
            return null;
          }

          console.log("compressed file", compressedFile);
          // resolve(`data:${file.type};base64,${base64String}`);
          const arrayBuffer = await compressedFile.arrayBuffer();
          const base64Data = Buffer.from(arrayBuffer).toString("base64");

          const attachment = {
            name: compressedFile.name,
            data: base64Data,
            type: compressedFile.type,
            size: base64Data.length * 0.75,
          };

          return attachment;
        } catch (err) {
          console.error(err);
          return null;
        }
      })
    );

    console.log("formattedFiles", formattedFiles);
    const filteredFormattedFiles = formattedFiles.filter(
      (attachment) => attachment !== null
    );

    setFormattedFiles(filteredFormattedFiles);
    console.log("ff", filteredFormattedFiles)

    formattedFiles.forEach((file) => {
      console.log(file)
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        newSize += file.size;
        if (newSize < 500000) {
          console.log(file.data)
          uploaded.push(file);
        } else {
          alert('The total size of your attachments exceeds 500kb.');
        }
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
        }
      }
    });

    if (!limitExceeded) setUploadedFiles(uploaded);
  }

  const handleFileEvent = (e) => {
    console.log("uploaded files", uploadedFiles)
    const chosenFiles = Array.prototype.slice.call(e.target.files)
    handleUploadFiles(chosenFiles);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true)
    try {
      sendEmail(form)
    } catch (e) {
      console.error(e)
      alert('Your message could not be sent. Sorry about that.')
    }
  }

  return (
    <div id="home" className="intro route bg-image background">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <div className="intro-content display-table"></div>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 sect-pt12">
            <div className="">
              <div id="contact" className="box-shadow-full pb-3">
                <div className="row">
                  <div className={`wrapper searchDiv ${isPortrait ? "col-md-12" : "col-md-6"}`}>
                    <div className="title-box-2">
                      <h5 className="title-left">Send A Message</h5>
                    </div>
                    <div>
                      {
                        submitted ?
                          (
                            <div id="sendmessage show" className="text-black-50 pb-5">
                              Your message has been sent. Thank you!
                            </div>
                          )
                          :
                          (<div >
                            <form onSubmit={handleSubmit} ref={form} id="contactForm" className="contactForm">

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
                                    <input role="button" hidden id='attachments' type='file' multiple
                                      name="attachments"
                                      onChange={handleFileEvent}
                                      disabled={fileLimit}
                                    />

                                    <label htmlFor='attachments'>
                                      <div className={`btn btn-primary ${!fileLimit ? '' : 'disabled'} `}>Upload Files</div>
                                    </label>
                                    <div className="uploaded-files-list text-black-50">
                                      {uploadedFiles.map(file => (
                                        <div key={file.name}>
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
                          </div>)
                      }
                    </div>
                  </div>
                  {
                    isPortrait || submitted ? (
                      <div>

                      </div>
                    ) : (
                      <div className="col-md-6">
                        <div className="title-box-2 pt-4 pt-md-0">
                          <h5 className="title-left">MAX VK TATTOOS</h5>
                        </div>
                        <div className="more-info">
                          <li className="lead text-black-50">File upload size must not exceed 500mb</li>
                        </div>
                        <div className="more-info">
                          <li className="lead text-black-50">Accepted Formats: jpeg, webp</li>
                        </div>
                        <div className="more-info">
                          <li className="lead text-black-50">Please read the FAQ before reaching out</li>
                        </div>
                        <div className="socials">
                          {/* <ul>
              
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
                        </ul> */}
                        </div>
                        <div className="text-center">
                          <img
                            src={logo}
                            alt="logo"
                            style={{ maxWidth: "70%" }}
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

