const sendErrors = (e, res) => {
    console.log(e)
    res.status(400).send({
        reason: "Backend server is down, please wait for administrator to run it again.",
        message: e.message,
        error: e
    })
}


exports.sendErrors = sendErrors;