const { sendErrors } = require("../helperfunctions/handleReqErrors");
const smsClient = require("./sms");

async function sendingSMS(req, res) {
    try {
        const numbers = req.body.numbers
        const message = req.body.message
        // ["+15163308032", '+15166088464', '+923343165003'],

        const sendResults = await smsClient.send({
            from: "+18667769103",
            to: ["+15166088464"],
            message: `Hello World 👋🏻 via SMS`
          });

        res.status(200).send(sendResults)
    }
    catch (err) {
        sendErrors(err, res)
    }
}

module.exports = {
    sendingSMS
}