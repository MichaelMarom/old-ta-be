const { sendErrors } = require("../helperfunctions/handleReqErrors");
const smsClient = require("./sms");
const axios = require("axios")

async function sendingSMS(req, res) {
    try {
        const numbers = req.body.numbers
        const message = req.body.message
        const subject = req.body.subject
        console.log(req.body)
        // // ["+15163308032", '+15166088464', '+923343165003'],

        // const sendResults = await smsClient.send({
        //     from: "+18667769103",
        //     to: ["+15166088464"],
        //     message: `Hello World 👋🏻 via SMS`
        //   });

        const instance = await axios
            .post("https://lax-upoh.line2.com/APIMapper/loginUser", {
                "apiKey": process.env.LINE2_KEY,
                "apiVersion": 7,
                "appVersion": "3.6",
                "device": "{\"device\":\"Line2 v3.6.0.6\",\"os\":\"Microsoft Windows NT 6.3.9600.0\",\"lax\":\"Toktumi.LaxClient v3.6.0.6\",\"guid\":\"aa0f53e4-e7c5-4088-aeb6-a3775fb80e62\"}",
                "email": null,
                "password": process.env.LIN2_PASS,
                "platform": ".Net",
                "rememberMe": false,
                "serviceProvider": "300",
                "supportedMimeTypes": "image\/jpeg,image\/png,image\/gif,image\/bmp,application\/pdf,text\/x-vcard,audio\/mpeg,audio\/aac,video\/mp4",
                "telephoneNumber": process.env.LINE2_NUMBER
            });

        const response = await axios
            .post("https://lax-upoh.line2.com/APIMapper/sendMessage", {
                "apiKey": process.env.LINE2_KEY,
                "apiVersion": 7,
                "appVersion": "3.6",
                "accessToken": instance?.data?.accessToken || "",
                "platform": "Tutoring Academy",
                "attachment": null ,
                //  `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`,
                "fileName": null,
                //  "logo.png",
                "message": message,
                "mimeType": null,
                // "image\/jpeg",
                "phoneNumber": process.env.LINE2_NUMBER,
                "subject": subject,
                "to": numbers
            });

        console.log(instance.data.accessToken, response,"login")

        res.status(200).send({ message: "sent!", response: response.data })
    }
    catch (err) {
        console.log(err)
        sendErrors(err, res)
    }
}

module.exports = {
    sendingSMS
}