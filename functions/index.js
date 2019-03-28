const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.helloPubSub = functions.pubsub.topic('events').onPublish((message) => {
    // name = message.json.name;
    // const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    // console.log(messageBody);
    let name = null;
    try {
        // name = message.json.name;
        console.log(message.json);
    } catch (e) {
        console.error('PubSub message was not JSON', e);
    }
    return admin.database().ref("/testCloudFunc").set({
        this: "iotworked"
    });
  });
