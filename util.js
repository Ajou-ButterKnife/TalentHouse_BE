const admin = require("firebase-admin");

const value = {};

value.sendFcm = async function(title, body, fbTokenList) {
    const fcmMessage = {
        data : {
            title: title,
            body: body,
        },
        // data : {
        //
        // },
        tokens: fbTokenList,
    };
    try {
        const result = await admin.messaging().sendMulticast(fcmMessage);

        for(let i = 0; i < result.responses.length; i++) {
            if(!result.responses[i].success) {
                console.log(result.responses[i].error);
            }
        }
        console.log('Send FCM Success');

        return true;
    }
    catch(exception) {
        console.log(exception);
        return false;
    }
};

module.exports = value;
