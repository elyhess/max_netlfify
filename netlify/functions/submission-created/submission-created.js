const sendGridMail = require("@sendgrid/mail");

const handler = async (event) => {
    try {
        const { firstName, email, phone, description, location, attachments} = JSON.parse(event.body);
        console.log(event)

    // console.log(`name: ${name}, email: ${email}, message: ${message}`);

    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    const html = `
      <div> 
         Hi ${firstName}! <br><br>
         Thanks for getting in touch.
         We have received your message
         and one of our customer care
         representatives will get in
         touch shortly
         <img alt="My Image" src="data:image/jpeg;base64,/9j/4S/+RXhpZgAATU0AKgAAAAgACAESAAMAENkDZ5u8/61a+X...more encoding" />
         <br><br>
         Best <br>
         John Doe
      </div>
    `;
    const mail = {
      from: email,
      to: process.env.SENDER_EMAIL,
      subject: "We have received your message",
      html,
    };
    await sendGridMail.send(mail);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent" }),
    };
  } catch (error) {
    return { statusCode: 422, body: String(error) };
  }
};

module.exports = { handler };