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

    // turns it into base64...this one works
    const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    
    let name = null;
    let squad = null;
    let lat = null;
    let long = null;
    let temp = null;
    let floor = null;
    let status = null;
    let gps = null;
    
    console.log(messageBody);
    console.log(message);
    try {
        // json = JSON.parse(message);
        name = message.json.name;
        squad = message.json.squad;
        // lat = message.json.lat;
        // long = message.json.long;
        // temp = message.json.temp;
        // floor = message.json.floor;
        // status = message.json.status;
        // gps = message.json.gps;
        // console.log(gps);
        console.log(name);
        console.log(squad);
        // console.log(lat);
        // console.log(long);
        console.log(message);
    } catch (e) {
        console.error('PubSub message was not JSON', e);
    }

    return admin.database().ref("/Active/" + name).update({
        // lat: lat,
        // long:long,
        // temp:temp,
        floor: 2
        // status: status
    });
  });