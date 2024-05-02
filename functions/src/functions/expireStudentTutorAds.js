const { app } = require('@azure/functions');
const axios = require('axios')

app.timer('expireStudentTutorAds', {
    schedule: '0 0 0 * * *',
    handler: async (myTimer, context) => {
        try {
            const response = await axios.put('https://learn-tutoringacademy-server.azurewebsites.net/api/update-expire-ads')
            context.log(`status: ${response.status}`);
            context.log(response.data);

            return response.data; // or return a custom object using properties from response
        } catch (error) {
            // If the promise rejects, an error will be thrown and caught here
            context.error(error);
        }
    }
});
