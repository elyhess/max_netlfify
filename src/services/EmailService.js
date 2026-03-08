import emailjs from '@emailjs/browser';

const STAGING_HOST_RE = /(staging--|\.?staging\.|staging-)/i;
const STORAGE_KEY = 'mock_email_submissions';

function isStagingHost(hostname) {
   return STAGING_HOST_RE.test(hostname);
}

function isMockEnabled() {
   if (import.meta.env.VITE_MOCK_EMAIL === 'true') {
      return true;
   }

   if (typeof window === 'undefined') {
      return false;
   }

   return isStagingHost(window.location.hostname);
}

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
   const formData = getFormData(form);
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

export default function sendEmail(formOrRef) {
   const form = formOrRef?.current ?? formOrRef;

   if (!form) {
      return Promise.reject(new Error('A form element is required to send email.'));
   }

   if (isMockEnabled()) {
      return mockSendEmail(form);
   }

   const serviceId = import.meta.env.VITE_EJS_SERVICE;
   const templateId = import.meta.env.VITE_EJS_TEMPLATE;
   const publicKey = import.meta.env.VITE_EJS_PK;

   if (!serviceId || !templateId || !publicKey) {
      return Promise.reject(new Error('EmailJS environment variables are missing.'));
   }

   return emailjs.sendForm(serviceId, templateId, form, publicKey);
}
