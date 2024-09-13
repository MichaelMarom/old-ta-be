const { imageToBase64Sync } = require("../utils/generalHelperFunctions");
const { sendErrors } = require("../utils/handleReqErrors");
const { path, fs } = require("../modules");
const smsClient = require("./sms");
const axios = require("axios");

async function sendingSMS(req, res) {
  try {
    // const numbers = req.body.numbers;
    // const message = req.body.message;
    // const subject = req.body.subject;
    // console.log(req.body);
    // // ["+15163308032", '+15166088464', '+923343165003'],

    // const sendResults = await smsClient.send({
    //     from: "+18667769103",
    //     to: ["+15166088464"],
    //     message: `Hello World 👋🏻 via SMS`
    //   });
    let ACCESS_TOKEN = "o.Iv3qRxAz4rD97321mu54mzqrx6gCB1Dy";
    let numbers = [ "+15166088464"];
    let deviceIden = "ujvsqxeJ1l6sjwly2xpbnE";
    // const instance = await axios({
    //   method: "POST",
    //   url: "https://api.pushbullet.com/v2/ephemerals",
    //   headers: {
    //     "Access-Token": ACCESS_TOKEN,
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     type: "push",
    //     push: {
    //       type: "sms",
    //       source_device_iden: "",
    //       target_device_iden: "ujvsqxeJ1l6sjwly2xpbnE",
    //       addresses: ["+15166088464"],
    //       message: "hello from code", // Your message
    //     },
    //   },
    // });

    const instance = await axios({
      method: "POST",
      url: "https://api.pushbullet.com/v2/ephemerals",
      headers: {
        "Access-Token": ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      data: {
        type: "push",
        push: {
          type: "sms",
          source_device_iden: deviceIden,
          target_device_iden: deviceIden,
          addresses: numbers,
          message: "Hello from Pushbullet API!",
        },
      },
    });

    // "apiKey": process.env.LINE2_KEY,
    // "apiVersion": 7,
    // "appVersion": "3.6",
    // "device": "{\"device\":\"Line2 v3.6.0.6\",\"os\":\"Microsoft Windows NT 6.3.9600.0\",\"lax\":\"Toktumi.LaxClient v3.6.0.6\",\"guid\":\"aa0f53e4-e7c5-4088-aeb6-a3775fb80e62\"}",
    // "email": null,
    // "password": process.env.LIN2_PASS,
    // "platform": ".Net",
    // "rememberMe": false,
    // "serviceProvider": "300",
    // "supportedMimeTypes": "image\/jpeg,image\/png,image\/gif,image\/bmp,application\/pdf,text\/x-vcard,audio\/mpeg,audio\/aac,video\/mp4",
    // "telephoneNumber": process.env.LINE2_NUMBER

    // if (!instance?.data?.accessToken)
    //   throw new Error(
    //     `Failed to send Message with code ${instance.data.code} for accessToken`
    //   );
    // const pathOfLogo = path.join(
    //   __dirname,
    //   "../templates/general/images/favicon.png"
    // );
    // const base64 = imageToBase64Sync(pathOfLogo);

    // const response = await axios.post(
    //   "https://lax-upoh.line2.com/APIMapper/sendMessage",
    //   {
    //     apiKey: process.env.LINE2_KEY,
    //     apiVersion: 7,
    //     appVersion: "3.6",
    //     accessToken: instance?.data?.accessToken || "",
    //     platform: "Tutoring Academy",
    //     attachment: null,
    //     //  base64,
    //     fileName: null,
    //     //  "logo.png",
    //     message: message,
    //     mimeType: null,
    //     //  "image\/jpeg",
    //     phoneNumber: process.env.LINE2_NUMBER,
    //     subject: subject,
    //     to: numbers,
    //   }
    // );
    // console.log(
    //   {
    //     apiKey: process.env.LINE2_KEY,
    //     apiVersion: 7,
    //     appVersion: "3.6",
    //     accessToken: instance?.data?.accessToken || "",
    //     platform: "Tutoring Academy",
    //     attachment: null,
    //     //  base64,
    //     fileName: null,
    //     //  "logo.png",
    //     message: message,
    //     mimeType: null,
    //     //  "image\/jpeg",
    //     phoneNumber: process.env.LINE2_NUMBER,
    //     subject: subject,
    //     to: numbers,
    //   },
    //   {
    //     apiKey: process.env.LINE2_KEY,
    //     apiVersion: 7,
    //     appVersion: "3.6",
    //     device:
    //       '{"device":"Line2 v3.6.0.6","os":"Microsoft Windows NT 6.3.9600.0","lax":"Toktumi.LaxClient v3.6.0.6","guid":"aa0f53e4-e7c5-4088-aeb6-a3775fb80e62"}',
    //     email: null,
    //     password: process.env.LIN2_PASS,
    //     platform: ".Net",
    //     rememberMe: false,
    //     serviceProvider: "300",
    //     supportedMimeTypes:
    //       "image/jpeg,image/png,image/gif,image/bmp,application/pdf,text/x-vcard,audio/mpeg,audio/aac,video/mp4",
    //     telephoneNumber: process.env.LINE2_NUMBER,
    //   },
    //   instance.data
    // );

    // if (!response?.data?.sendResults?.length)
    //   throw new Error(
    //     "Failed To Send message!. Please check text message and try again."
    //   );
    res
      .status(200)
      .send({
        message: "sent!",
        response: instance.data,
        status: instance.status,
      });
  } catch (err) {
    console.log(err);
    sendErrors(err, res);
  }
}

module.exports = {
  sendingSMS,
};
