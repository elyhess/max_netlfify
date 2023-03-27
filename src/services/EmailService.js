import emailjs from 'emailjs-com';

export default function sendEmail(form) {
   console.log(form)

   // send the message and get a callback with an error or details of the message that was sent
   emailjs.sendForm(process.env.REACT_APP_EJS_SERVICE, process.env.REACT_APP_EJS_TEMPLATE, form.current, process.env.REACT_APP_EJS_PK)
      .then(function (response) {
         console.log('SUCCESS!', response.status, response.text);
      }, function (err) {
         console.log('FAILED...', err);
      });
};