const { sendErrors } = require("../helperfunctions/handleReqErrors");
const smsClient = require("./sms");
const axios = require("axios")

async function sendingSMS(req, res) {
    try {
        const numbers = req.body.numbers
        const message = req.body.message
        console.log(req.body)
        // // ["+15163308032", '+15166088464', '+923343165003'],

        // const sendResults = await smsClient.send({
        //     from: "+18667769103",
        //     to: ["+15166088464"],
        //     message: `Hello World 👋🏻 via SMS`
        //   });

       await axios
            .post("https://lax-upoh.line2.com/APIMapper/sendMessage", {
                "apiKey": process.env.Line2_KEY,
                "apiVersion": 7,
                "appVersion": "3.6",
                "accessToken":process.env.LINE2_ACCESS_TOKEN,
                 "platform": "Tutoring Academy",
                "attachment": null,
                "fileName": null,
                "message": message,
                "mimeType": null,
                "phoneNumber":process.env.LINE2_NUMBER,
                "subject": "Testing",
                "to":numbers
            });
        res.status(200).send({message: "sent!"})
    }
    catch (err) {
        sendErrors(err, res)
    }
}

module.exports = {
    sendingSMS
}