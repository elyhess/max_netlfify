import { useRef, useState } from "react";
import sendEmail from "../services/EmailService";
import { processUploadedFiles } from "../services/imageCompressor";

const INITIAL_FORM_VALUES = {
  firstName: "",
  email: "",
  phone: "",
  description: "",
  location: "",
};

export default function Contact() {
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [attachmentError, setAttachmentError] = useState("");
  const formFilled = Object.values(formValues).every((value) => value.trim());
  const form = useRef(null);
  const inputElement = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const submitted = submitStatus === "success";

  const handleFileEvent = async (e) => {
    const chosenFiles = Array.from(e.target.files ?? []);
    const { files: updatedFiles, rejected } = await processUploadedFiles(
      chosenFiles,
      uploadedFiles
    );
    if (rejected.length > 0) {
      setAttachmentError("Some files were skipped. You can attach up to 6 images.");
    } else {
      setAttachmentError("");
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

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formFilled || submitStatus === "submitting") {
      return;
    }

    setSubmitStatus("submitting");
    setSubmitError("");

    try {
      await sendEmail(form.current);
      setSubmittedEmail(formValues.email);
      setSubmitStatus("success");
    } catch (error) {
      console.error(error);
      setSubmitStatus("idle");
      setSubmitError("Your message could not be sent. Please try again in a bit.");
    }
  }

  function getFileName(str) {
    if (str.length > 12) {
      return `${str.slice(0, 6)}...${str.slice(-6)}`;
    }
    return str;
  }

  const deleteFile = (fileName) => {
    const updatedUploadedFiles = uploadedFiles.filter(
      (file) => file.name !== fileName
    );
    setUploadedFiles(updatedUploadedFiles);
    setAttachmentError("");

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
            Books open a few times a year &mdash; don&rsquo;t miss your window
          </p>
        </div>
        <div className="contact-layout">
          <div className="contact-form-wrapper glass-card">
            {submitted ? (
              <div className="contact-success" role="status" aria-live="polite">
                <div className="success-icon">&#10003;</div>
                <h3>Message Sent!</h3>
                <p>A confirmation email has been sent to {submittedEmail}</p>
                <p>Please check your spam folder!</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                ref={form}
                id="contactForm"
                className="contactForm"
              >
                {submitError && (
                  <p className="form-feedback form-feedback-error" role="alert">
                    {submitError}
                  </p>
                )}
                <div className="form-grid">
                  <div className="form-field">
                    <input
                      type="text"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleFieldChange}
                      className="input-dark"
                      id="name"
                      placeholder="Your Name"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="email"
                      value={formValues.email}
                      onChange={handleFieldChange}
                      className="input-dark"
                      name="email"
                      id="email"
                      placeholder="Your Email"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="form-field full-width">
                    <input
                      type="tel"
                      value={formValues.phone}
                      onChange={handleFieldChange}
                      className="input-dark"
                      name="phone"
                      id="phone"
                      placeholder="Phone Number"
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <div className="form-field full-width">
                    <textarea
                      className="input-dark"
                      value={formValues.description}
                      onChange={handleFieldChange}
                      name="description"
                      rows="4"
                      id="description"
                      placeholder="Description &mdash; Be as detailed as possible. Include links to reference images."
                      required
                    />
                  </div>
                  <div className="form-field full-width">
                    <textarea
                      className="input-dark"
                      name="location"
                      value={formValues.location}
                      onChange={handleFieldChange}
                      rows="2"
                      id="location"
                      placeholder="Placement & size"
                      required
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
                      hidden
                      id="attachments"
                      type="file"
                      multiple
                      name="attachments"
                      accept="image/heic,image/heif,image/jpeg,image/png,image/webp"
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
                    {attachmentError && (
                      <p className="form-feedback" role="status">
                        {attachmentError}
                      </p>
                    )}
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
                      disabled={!formFilled || submitStatus === "submitting"}
                    >
                      {submitStatus === "submitting" ? "Sending..." : "Send Message"}
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
                <p>
                  No realism, no black-and-grey, no reworks &mdash; just
                  original art built from scratch. Please read the FAQ before
                  reaching out.
                </p>
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
