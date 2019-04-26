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

    // grabs the parsed object
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
    var nggaBeg = messageBody.indexOf('NGGA');
    var nggaEnd = messageBody.indexOf("\n$");

    // these might need to change depending if we get NGGA or GNGGA data
    var gngga = messageBody.substring(nggaBeg - 1, nggaEnd - 1);
    console.log("GNGGA: " + gngga);

    // if we find the bad $NGGA data, which we normally do, then we fix it
    if (gngga.indexOf("GNGGA") == -1)
    {
        gngga = gngga.replace("$NGGA", "$GNGGA");
    }

    // the parser stuff
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
    console.log( "Old: " + messageBody);

    // I don't think the try block is working
    // try 
    // {
    // } catch (e) {
    //     console.error('PubSub message was not JSON', e);
    // }

    // this return updates the db
    return admin.database().ref("/Active/" + name).update({
        // lat: lat,
        // long:long,
        // temp:temp,
        floor: 2
        // status: status
    });
  });