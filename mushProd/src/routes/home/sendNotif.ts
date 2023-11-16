
var admin = require("firebase-admin");

var serviceAccount = require("./betapeak-1b551-firebase-adminsdk-ns0d3-3f611f58e0.json");


admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount)
});
// This registration token comes from the client FCM SDKs.

/**
 * @param {any} _request
 */
export async function post(_request: any) {
  const registrationToken = ['fSJ_Sb21DpwDhvRtM89__C:APA91bH25MZA4a1yVg8p5L0A0XO9gPbdXizSU0zvcxmn8T0F0pnhxn5GuS0WvM0pjBw4e90Zbsg7Do3oEoA5ZuBI4L10D_-fJ8lRsErnpNfI51OFIXAJ-uNu0usFCqWyshePstWZrW7B',];


  const message = {
    notification: {
      title: "I am Admin",
      body: "Hi client"
    },
    webpush: {
      fcmOptions: {
        link: '/?breakingnews'
      }
    },
    token: registrationToken
  };

  // Send a message to the device corresponding to the provided
  // registration token.


  // @ts-ignore
  admin.messaging().send(message)
    .then((response: any) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error: any) => {
      console.log('Error sending message:', error);
    });

}