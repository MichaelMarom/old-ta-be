const { app } = require('@azure/functions');
const axios = require('axios')

app.timer('expiretimetrigger24-4', {
    schedule: '0 */5 * * * *',
    handler: async (myTimer, context) => {
        try {
            const response = await axios.get('https://learn-tutoringacademy-server.azurewebsites.net/')
            context.log(`statusCode: ${response.status}`);
            context.log(response);
            context.log(response.data);


            return response; // or return a custom object using properties from response
        } catch (error) {
            // If the promise rejects, an error will be thrown and caught here
            context.error(error);
        }
    }
});
