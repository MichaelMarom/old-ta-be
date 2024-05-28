const sendErrors = (e, res) => {
    console.log(e)
    res.status(400).send({ message: "Backend server is down, please wait for administrator to run it again.", reason: e.message, error:e })
}


exports.sendErrors = sendErrors;