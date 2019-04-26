const functions = require('firebase-functions');
const admin = require('firebase-admin');
var GPS = require('gps');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.helloPubSub = functions.pubsub.topic('events').onPublish((message) => {

    var mGps = new GPS;

    // works with GPGGA, too 
    // var sentence = '$GNGGA,014626.00,3720.19969,N,12152.86258,W,2,12,0.67,36.3,M,-29.9,M,,0000*43';
    // 014626.00,3720.19969,N,12152.86258,W,2,12,0.67,36.3,M,-29.9,M,,0000*43

    var getParsed;
    

    // turns message into base64...this one works
    const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;

    // find the gps entry, and cut it from the message
    var indBeg = messageBody.indexOf('gps');
    console.log(indBeg);
    var indEnd = messageBody.indexOf('}');
    console.log(indEnd);

    // get the "gps" till right before the end
    var gpsData = messageBody.substring(indBeg - 1, indEnd - 1);
    console.log("GPS: " + gpsData);

    // get the gngga sentence from the message
    var nggaBeg = messageBody.indexOf('PGGA');
    var nggaEnd = messageBody.indexOf("\n$");
    var gngga = messageBody.substring(nggaBeg - 2, nggaEnd - 1);
    console.log("GNGGA: " + gngga);

    mGps.on('data', function(parsed) {
        getParsed = parsed;
        console.log(parsed);
    });
    mGps.update(gngga);
    console.log("Get Parsed: " + getParsed);

    // removes comma, but not closing bracket
    var newMsg = messageBody.slice(0, indBeg - 2);
    newMsg = newMsg + '}';
    console.log("New: " + newMsg);

    // take the msg and turn it into json
    var MsgToJson = JSON.parse(newMsg);
    console.log(MsgToJson.name);

    let name = null;
    let squad = null;
    let lat = null;
    let long = null;
    let temp = null;
    let floor = null;
    let status = null;
    let gps = null;
    
    console.log( "Old: " + messageBody);

    // json = JSON.parse(message);
    // name = MsgToJson.json.name;
    // squad = MsgToJson.json.squad;
    // lat = message.json.lat;
    // long = message.json.long;
    // temp = message.json.temp;
    // floor = message.json.floor;
    // status = message.json.status;
    // gps = message.json.gps;
    // console.log(gps);
    // console.log(name);
    // console.log(squad);
    // console.log(lat);
    // console.log(long);

    // I don't think the try block is working
    // try {
        
        
    // } catch (e) {
    //     console.error('PubSub message was not JSON', e);
    // }

    return admin.database().ref("/Active/" + name).update({
        // lat: lat,
        // long:long,
        // temp:temp,
        floor: 2
        // status: status
    });
  });