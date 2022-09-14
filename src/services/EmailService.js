import emailjs from 'emailjs-com';

export default function sendEmail(event) {
    // send the message and get a callback with an error or details of the message that was sent
    emailjs.send(process.env.REACT_APP_EJS_SERVICE, process.env.REACT_APP_EJS_TEMPLATE, event, process.env.REACT_APP_EJS_PK)
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
     }, function(err) {
        console.log('FAILED...', err);
     });
};





// export default function sendEmail(e) {
//     e.preventDefault();
//     const data = new FormData(e.currentTarget);
//     const templateParams = {
//         firstName: data.get('firstName'),
//         email: data.get('email'),
//         phone: data.get('phone'),
//         description: data.get('description'),
//         location: data.get('location'),
//         attachments: data.get('attachments')
//     }
//     console.log(templateParams)

//     const hasParams = ( templateParams.firstName !== '' &&
//                         templateParams.email !== '' &&
//                         templateParams.phone !== '' &&
//                         templateParams.description !== '' &&
//                         templateParams.location !== ''
//     )
//     // args: email.js service - email.js template - params - email.js public key
//     if (hasParams) {
//         emailjs.send(process.env.REACT_APP_EJS_SERVICE, process.env.REACT_APP_EJS_TEMPLATE, templateParams, process.env.REACT_APP_EJS_PK)
//         .then((result) => {
//             console.log(result.text);
//         }, (error) => {
//             console.log(error.text);
//         });
//     } else {
//         console.log("missing fields. Request not sent")
//     }
// };