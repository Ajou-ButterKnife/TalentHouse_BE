const admin = require('firebase-admin');

const value = {};

value.sendFcm = async function (title, body, fbTokenList) {
  const fcmMessage = {
    data: {
      title: title,
      body: body,
    },
    token: fbTokenList,
  };
  try {
    const result = await admin.messaging().send(fcmMessage);
    console.log('Send FCM Success');
    return true;
  } catch (exception) {
    console.log(exception);
    return false;
  }
};

module.exports = value;
