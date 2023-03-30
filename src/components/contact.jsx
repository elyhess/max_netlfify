import React, { useRef, useState, useEffect } from "react";
import logo from "../img/logo3.webp";
import { useMediaQuery } from 'react-responsive'
import Compressor from "compressorjs";
import sendEmail from "../services/EmailService";

export default function Contact() {
  const isPortrait = useMediaQuery({ query: '(max-width: 768px)' })
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [phone, setPhone] = useState()
  const [description, setDescription] = useState()
  const [submitted, setSubmitted] = useState(false)
  const [location, setLocation] = useState()
  const [attachmentCount, setAttachmentCount] = useState(0)
  const formFilled = name && email && phone && description && location
  const form = useRef()
  const inputElement = useRef(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
  }, [uploadedFiles]);

  async function handleUploadFiles(files) {
    const uploaded = [...uploadedFiles];
    let newSize = uploaded.reduce((acc, file) => acc + file.size, 0);

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
          return compressedFile;
        } catch (err) {
          console.error(err);
          return null;
        }
      })
    );

    // console.log("formattedFiles", formattedFiles);
    // const filteredFormattedFiles = formattedFiles.filter(
    //   (attachment) => attachment !== null
    // );

    // setFormattedFiles(filteredFormattedFiles);

    formattedFiles.forEach((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        const updatedSize = newSize + file.size;
        // console.log("update size", updatedSize)
        if (updatedSize <= 500000) {
          newSize = updatedSize;
          uploaded.push(file);
        } else {
          alert("The total size of your attachments exceeds 500kb. Some files were not added.");
        }
      }
    });

    return new Promise((resolve) => {
      setUploadedFiles((prevState) => {
        // console.log("uploaded formatted", uploaded);
        resolve(uploaded);
        return uploaded;
      });
    });
  }

  const handleFileEvent = async (e) => {
    e.persist()
    // console.log("original files", e.target.files)
    const chosenFiles = Array.prototype.slice.call(e.target.files)
    const updatedFiles = await handleUploadFiles(chosenFiles);

    console.log("hs-ff", updatedFiles)

    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((blob) => {
      const file = new File([blob], blob.name, { type: blob.type });
      dataTransfer.items.add(file);
    });
    e.target.files = dataTransfer.files
    setAttachmentCount(dataTransfer.files.length)
    console.log(attachmentCount)
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

  function getFileName(str) {
    if (str.length > 12) { return str.substr(0, 6) + '...' + str.substr(-6) }
    return str
  }

  const deleteFile = (fileName) => {
    const updatedUploadedFiles = uploadedFiles.filter((file) => file.name !== fileName);
    setUploadedFiles(updatedUploadedFiles);

    if (inputElement.current) {
      const dataTransfer = new DataTransfer();
      updatedUploadedFiles.forEach((blob) => {
        const file = new File([blob], blob.name, { type: blob.type });
        dataTransfer.items.add(file);
      });
      inputElement.current.files = dataTransfer.files;
      setAttachmentCount(dataTransfer.files.length)
      console.log(attachmentCount)
    }
  };

  return (
    <section id="home" className="intro route bg-image contact-background">
      <div className={`wrapper searchDiv ${isPortrait ? "col-md-12" : "col-md-6"}`}></div>
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <div className="intro-content display-table"></div>
      <div className="container">
        <div className="row">
          <div id="contact" className="col-sm-12 sect-pt4 contact-mf">
            {/* <div className=""> */}
            <div className="box-shadow-full pb-3">
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
                            <p>Your message has been sent.</p>
                            <p>A confirmation email has been sent to {email}</p>
                            <p>please be sure to check your spam folder!</p>
                          </div>
                        )
                        :
                        (<div >
                          <form onSubmit={(e) => handleSubmit(e)} ref={form} id="contactForm" className="contactForm">

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

                              {/* hidden */}
                              <input
                                className="form-control"
                                name="attachmentCount"
                                id="attachmentCount"
                                value={attachmentCount}
                                type="number"
                                readOnly
                                hidden
                              ></input>
                              {/* hidden */}

                              <div className="col-md-12 mb-3">
                                <div className="form-group">
                                  <input
                                    role="button"
                                    hidden
                                    id="attachments"
                                    type="file"
                                    multiple
                                    name="attachments"
                                    accept=".heic, .jpeg, .jpg, .png, .webp"
                                    onChange={handleFileEvent}
                                    ref={inputElement}
                                  />

                                  <label htmlFor='attachments'>
                                    <div className="btn btn-primary">Upload Images</div>
                                  </label>
                                  <div className="uploaded-files-list text-black-50">
                                    {uploadedFiles.map(file => (
                                      <div className="row" key={file.name}>
                                        <div className="col-8" key={file.name}>
                                          {getFileName(file.name)} - {file.size.toLocaleString("en-US")} kb
                                          {/* {getFileName(file.name)} */}
                                        </div>
                                        <div className="col-4">
                                          <button type="button"
                                            className="close"
                                            style={{ color: "red" }}
                                            aria-label="Close"
                                            onClick={(e) => deleteFile(file.name)}
                                          >
                                            <span aria-hidden="true" key={file.name}>&times;</span>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {/* <div className="validation"></div> */}
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
                        <li className="lead text-black-50">Please read the FAQ before reaching out</li>
                      </div>
                      <div className="socials">
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
            {/* </div> */}
          </div>
        </div>
      </div >
    </section >
  );
}

