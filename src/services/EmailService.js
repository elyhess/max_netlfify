import emailjs from '@emailjs/browser';

const MOCK_ENABLED = import.meta.env.VITE_MOCK_EMAIL === 'true';
const STORAGE_KEY = 'mock_email_submissions';

function getFormData(formEl) {
   const data = {};
   new FormData(formEl).forEach((value, key) => {
      if (key === 'attachments') {
         if (!data.attachments) data.attachments = [];
         data.attachments.push({ name: value.name, size: value.size, type: value.type });
      } else {
         data[key] = value;
      }
   });
   return data;
}

function mockSendEmail(form) {
   const formData = getFormData(form.current);
   const entry = {
      timestamp: new Date().toISOString(),
      data: formData
   };

   const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
   existing.push(entry);
   localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

   console.log('[MOCK EMAIL] Submission saved to localStorage:', entry);
   console.log('[MOCK EMAIL] View all submissions: JSON.parse(localStorage.getItem("' + STORAGE_KEY + '"))');

   return Promise.resolve({ status: 200, text: 'OK (mock)' });
}

export default function sendEmail(form) {
   if (MOCK_ENABLED) {
      return mockSendEmail(form);
   }

   emailjs.sendForm(
      import.meta.env.VITE_EJS_SERVICE,
      import.meta.env.VITE_EJS_TEMPLATE,
      form.current,
      import.meta.env.VITE_EJS_PK
   ).then(function (response) {
      console.log('SUCCESS!', response.status, response.text);
   }, function (err) {
      console.log('FAILED...', err);
   });
}
