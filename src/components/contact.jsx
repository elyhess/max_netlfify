import React, { useRef, useState } from "react";
import sendEmail from "../services/EmailService";
import { processUploadedFiles } from "../services/imageCompressor";

export default function Contact() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [description, setDescription] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState();
  const [attachmentCount, setAttachmentCount] = useState(0);
  const formFilled = name && email && phone && description && location;
  const form = useRef();
  const inputElement = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileEvent = async (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    const { files: updatedFiles, rejected } = await processUploadedFiles(
      chosenFiles,
      uploadedFiles
    );
    if (rejected.length > 0) {
      alert("Some files were not added. Maximum 6 files allowed.");
    }
    setUploadedFiles(updatedFiles);

    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((blob) => {
      const file = new File([blob], blob.name, { type: blob.type });
      dataTransfer.items.add(file);
    });
    e.target.files = dataTransfer.files;
    setAttachmentCount(dataTransfer.files.length);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    try {
      sendEmail(form);
    } catch (e) {
      console.error(e);
      alert("Your message could not be sent. Sorry about that.");
    }
  }

  function getFileName(str) {
    if (str.length > 12) {
      return str.substr(0, 6) + "..." + str.substr(-6);
    }
    return str;
  }

  const deleteFile = (fileName) => {
    const updatedUploadedFiles = uploadedFiles.filter(
      (file) => file.name !== fileName
    );
    setUploadedFiles(updatedUploadedFiles);

    if (inputElement.current) {
      const dataTransfer = new DataTransfer();
      updatedUploadedFiles.forEach((blob) => {
        const file = new File([blob], blob.name, { type: blob.type });
        dataTransfer.items.add(file);
      });
      inputElement.current.files = dataTransfer.files;
      setAttachmentCount(dataTransfer.files.length);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Ready to book? Send a message below
          </p>
        </div>
        <div className="contact-layout">
          <div className="contact-form-wrapper glass-card">
            {submitted ? (
              <div className="contact-success">
                <div className="success-icon">&#10003;</div>
                <h3>Message Sent!</h3>
                <p>A confirmation email has been sent to {email}</p>
                <p>Please check your spam folder!</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                ref={form}
                id="contactForm"
                className="contactForm"
              >
                <div className="form-grid">
                  <div className="form-field">
                    <input
                      type="text"
                      name="firstName"
                      onChange={(e) => setName(e.target.value)}
                      className="input-dark"
                      id="name"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-dark"
                      name="email"
                      id="email"
                      placeholder="Your Email"
                    />
                  </div>
                  <div className="form-field full-width">
                    <input
                      type="text"
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-dark"
                      name="phone"
                      id="phone"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="form-field full-width">
                    <textarea
                      className="input-dark"
                      onChange={(e) => setDescription(e.target.value)}
                      name="description"
                      rows="4"
                      id="description"
                      placeholder="Description &mdash; Be as detailed as possible. Include links to reference images."
                    />
                  </div>
                  <div className="form-field full-width">
                    <textarea
                      className="input-dark"
                      name="location"
                      onChange={(e) => setLocation(e.target.value)}
                      rows="2"
                      id="location"
                      placeholder="Placement & size"
                    />
                  </div>

                  <input
                    name="attachmentCount"
                    id="attachmentCount"
                    value={attachmentCount}
                    type="number"
                    readOnly
                    hidden
                  />

                  <div className="form-field full-width">
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
                    <label htmlFor="attachments" className="upload-label">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      Upload Reference Images
                    </label>
                    {uploadedFiles.length > 0 && (
                      <div className="uploaded-files">
                        {uploadedFiles.map((file) => (
                          <div className="uploaded-file" key={file.name}>
                            <span className="file-name">
                              {getFileName(file.name)} &mdash;{" "}
                              {(file.size / 1024).toFixed(0)}KB
                            </span>
                            <button
                              type="button"
                              className="file-remove"
                              aria-label="Remove file"
                              onClick={() => deleteFile(file.name)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-field full-width">
                    <button
                      type="submit"
                      className={`btn-neon btn-neon-primary btn-submit ${!formFilled ? "btn-disabled" : ""}`}
                      disabled={!formFilled}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="contact-info hidden-mobile">
            {!submitted && (
              <div className="glass-card contact-info-card">
                <h3>MAX VK TATTOOS</h3>
                <p>Please read the FAQ before reaching out</p>
                <div className="contact-links">
                  <a
                    href="https://www.instagram.com/maxvktattoos/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    @maxvktattoos
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
