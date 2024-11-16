const { sendErrors } = require("../utils/handleReqErrors");
const twilio = require('twilio');

// Twilio credentials from your Twilio Console
const accountSid = process.env.ACC_SID;
const authToken = process.env.AUTH_TOKEN;

const client = new twilio(accountSid, authToken);


// async function sendingSMS(req, res) {
//   try {
//     // const numbers = req.body.numbers;
//     // const message = req.body.message;
//     // const subject = req.body.subject;
//     // console.log(req.body);
//     // // ["+15163308032", '+15166088464', '+923343165003'],

//     // const sendResults = await smsClient.send({
//     //     from: "+18667769103",
//     //     to: ["+15166088464"],
//     //     message: `Hello World 👋🏻 via SMS`
//     //   });
//     let ACCESS_TOKEN = "o.Iv3qRxAz4rD97321mu54mzqrx6gCB1Dy";
//     let numbers = ["+15166088464"];
//     let deviceIden = "ujvsqxeJ1l6sjwly2xpbnE";
//     // const instance = await axios({
//     //   method: "POST",
//     //   url: "https://api.pushbullet.com/v2/ephemerals",
//     //   headers: {
//     //     "Access-Token": ACCESS_TOKEN,
//     //     "Content-Type": "application/json",
//     //   },
//     //   data: {
//     //     type: "push",
//     //     push: {
//     //       type: "sms",
//     //       source_device_iden: "",
//     //       target_device_iden: "ujvsqxeJ1l6sjwly2xpbnE",
//     //       addresses: ["+15166088464"],
//     //       message: "hello from code", // Your message
//     //     },
//     //   },
//     // });
//     // 1831629250
//     // "apiKey": process.env.LINE2_KEY,
//     // "apiVersion": 7,
//     // "appVersion": "3.6",
//     // "device": "{\"device\":\"Line2 v3.6.0.6\",\"os\":\"Microsoft Windows NT 6.3.9600.0\",\"lax\":\"Toktumi.LaxClient v3.6.0.6\",\"guid\":\"aa0f53e4-e7c5-4088-aeb6-a3775fb80e62\"}",
//     // "email": null,
//     // "password": process.env.LIN2_PASS,
//     // "platform": ".Net",
//     // "rememberMe": false,
//     // "serviceProvider": "300",
//     // "supportedMimeTypes": "image\/jpeg,image\/png,image\/gif,image\/bmp,application\/pdf,text\/x-vcard,audio\/mpeg,audio\/aac,video\/mp4",
//     // "telephoneNumber": process.env.LINE2_NUMBER

//     // if (!instance?.data?.accessToken)
//     //   throw new Error(
//     //     `Failed to send Message with code ${instance.data.code} for accessToken`
//     //   );
//     // const pathOfLogo = path.join(
//     //   __dirname,
//     //   "../templates/general/images/favicon.png"
//     // );
//     // const base64 = imageToBase64Sync(pathOfLogo);

//     // const response = await axios.post(
//     //   "https://lax-upoh.line2.com/APIMapper/sendMessage",
//     //   {
//     //     apiKey: process.env.LINE2_KEY,
//     //     apiVersion: 7,
//     //     appVersion: "3.6",
//     //     accessToken: instance?.data?.accessToken || "",
//     //     platform: "Tutoring Academy",
//     //     attachment: null,
//     //     //  base64,
//     //     fileName: null,
//     //     //  "logo.png",
//     //     message: message,
//     //     mimeType: null,
//     //     //  "image\/jpeg",
//     //     phoneNumber: process.env.LINE2_NUMBER,
//     //     subject: subject,
//     //     to: numbers,
//     //   }
//     // );
//     // console.log(
//     //   {
//     //     apiKey: process.env.LINE2_KEY,
//     //     apiVersion: 7,
//     //     appVersion: "3.6",
//     //     accessToken: instance?.data?.accessToken || "",
//     //     platform: "Tutoring Academy",
//     //     attachment: null,
//     //     //  base64,
//     //     fileName: null,
//     //     //  "logo.png",
//     //     message: message,
//     //     mimeType: null,
//     //     //  "image\/jpeg",
//     //     phoneNumber: process.env.LINE2_NUMBER,
//     //     subject: subject,
//     //     to: numbers,
//     //   },
//     //   {
//     //     apiKey: process.env.LINE2_KEY,
//     //     apiVersion: 7,
//     //     appVersion: "3.6",
//     //     device:
//     //       '{"device":"Line2 v3.6.0.6","os":"Microsoft Windows NT 6.3.9600.0","lax":"Toktumi.LaxClient v3.6.0.6","guid":"aa0f53e4-e7c5-4088-aeb6-a3775fb80e62"}',
//     //     email: null,
//     //     password: process.env.LIN2_PASS,
//     //     platform: ".Net",
//     //     rememberMe: false,
//     //     serviceProvider: "300",
//     //     supportedMimeTypes:
//     //       "image/jpeg,image/png,image/gif,image/bmp,application/pdf,text/x-vcard,audio/mpeg,audio/aac,video/mp4",
//     //     telephoneNumber: process.env.LINE2_NUMBER,
//     //   },
//     //   instance.data
//     // );

//     // if (!response?.data?.sendResults?.length)
//     //   throw new Error(
//     //     "Failed To Send message!. Please check text message and try again."
//     //   );
//     const instance = await axios({
//       method: "POST",
//       url: "https://api.pushbullet.com/v2/ephemerals",
//       headers: {
//         "Access-Token": ACCESS_TOKEN,
//         "Content-Type": "application/json",
//       },
//       data: {
//         type: "push",
//         push: {
//           type: "sms",
//           source_device_iden: deviceIden,
//           target_device_iden: deviceIden,
//           addresses: numbers,
//           message: "Hello from Pushbullet API!",
//         },
//       },
//     });

//     res.status(200).send({
//       message: "sent!",
//       response: instance.data,
//       status: instance.status,
//     });
//   } catch (err) {
//     console.log(err);
//     sendErrors(err, res);
//   }
// }

// const sendSMS = async (req, res) => {
//   try {
//     let ACCESS_TOKEN = "o.deIKzwrMK8AujawICPTYWM9z6gkI22N2";
//     let numbers = ["+15166088464", "+923343165003"];
//     let deviceIden = "ujvsqxeJ1l6sjDJVdu26to";
//     // ujvsqxeJ1l6sjwly2xpbnE
//     console.log("Sending SMS..."); // Log when the process starts

//     const response = await axios({
//       method: "POST",
//       url: "https://api.pushbullet.com/v2/ephemerals",
//       headers: {
//         "Access-Token": ACCESS_TOKEN,
//         "Content-Type": "application/json",
//       },
//       data: {
//         type: "push",
//         push: {
//           type: "sms",
//           source_device_iden: deviceIden,
//           target_device_iden: deviceIden, // Same as source device
//           addresses: numbers, // Phone numbers
//           message: "Test message from API123 fom code", // The message content
//         },
//       },
//     });

//     // Log success response
//     console.log("Status Code:", response.status); // Should be 200 for success
//     console.log("Response Body:", response.data); // Logs the API response body

//     if (response.status === 200) {
//       console.log("SMS successfully sent!");
//       res.status(200).send({
//         message: "sent!",
//         response: response.data,
//         status: response.status,
//       });
//     } else {
//       console.log("SMS not sent, check the response body for issues.");
//     }
//   } catch (error) {
//     // Log any errors that occur during the request
//     console.error("Error during API request:", error.message);
//     if (error.response) {
//       console.error("Error Status Code:", error.response.status);
//       console.error("Error Response Data:", error.response.data); // Logs error details
//     }
//     sendErrors(error, res);
//   }
// };

const sendSMS = async (req, res) => {
  try {
    // you can write your code here...
    // let ACCESS_TOKEN = "o.deIKzwrMK8AujawICPTYWM9z6gkI22N2";  // Access Token
    let numbers = ["+15166088464"];  // Phone numbers
    // let deviceIden = "ujvsqxeJ1l6sjDJVdu26to";  // Device ID for the Android device

    // console.log("Sending SMS via Create-Text API...");

    // // Make the request to Pushbullet Create-Text API
    // const response = await axios({
    //   method: "POST",
    //   url: "https://api.pushbullet.com/v2/texts",
    //   headers: {
    //     "Access-Token": ACCESS_TOKEN,
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     data: {  // Wrap in a `data` object
    //       addresses: numbers,  // Phone numbers array
    //       message: "Hello from Pushbullet Create Text API!",  // SMS message content
    //       target_device_iden: deviceIden,  // Device ID that will send the SMS
    //     }
    //   }
    // });

    // // Log and handle the response
    // console.log("Status Code:", response.status);  // Should be 200 for success
    // console.log("Response Body:", response.data);  // Logs the API response

    // if (response.status === 200) {
    //   res.status(200).send({
    //     message: "sent!",
    //     response: response.data,  // Make sure it's `response.data`
    //     status: response.status,
    //   });
    //   console.log("SMS successfully sent via Create-Text API!");
    // } else {
    //   console.log("SMS not sent, check the response body for issues.");
    // }
  } catch (error) {
    // Log and handle errors
    sendErrors(error, res);
    console.error("Error during API request:", error.message);
    if (error.response) {
      console.error("Error Status Code:", error.response.status);
      console.error("Error Response Data:", error.response.data);  // Logs error details
    }
  }
};


const twillio_sms = (req, res)=>{
  let number = "+15166088464";  
  client.messages
    .create({
      body: "Hello Michale from twillio code",
      from: process.env.TWILLIO_NUM,
      to: number
    })
    .then((message) => {
      res.status(200).json({ success: true, messageId: message });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
}

module.exports = {
  sendingSMS: twillio_sms,
};