// Globals
var markerCount = 0;
var markersArray = [];
var squadArray = [];    
var map;
var colorNum = 0;
let color = ["blue", "pink", "green", "purple", "yellow", 
"white", "brown", "gray", "orange", "black"];
var floorInputVal = 0;
var newMapsArray = [];
var newDivsArray = [];
var beenPressed = 0;


// show the time and update it every minute
setInterval(updateTime, 60000);
function updateTime()
{
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    document.getElementById("time").innerHTML = "Current Time " + time.toString();
}
updateTime();

// logging
function logIt(msg)
{
    var newLog = document.createElement("li");       // Create a <li> node
    var txt = document.createTextNode(msg);
    newLog.appendChild(txt);                    // Append the text to <li>
    var list = document.getElementById("myLog");    // Get the <ul> element to insert a new node
    list.insertBefore(newLog, list.childNodes[0]);  // Insert <li> before the first child of <ul>
}

// squad member class
class squadMember
{
    constructor(name, status, floor, marker, color, lat, long, startTime, squad, heart, temp)
    {
        this.squad = squad;
        this.name = name;
        this.status = status;
        this.floor = floor;
        this.marker = marker;
        this.color = color;
        this.lat = lat;
        this.long = long;
        this.heart = heart;
        this.temp = temp;
        this.startTime = startTime;
    }
}

// I think these functions get run without needing to be called
(function ()
{
    var config = 
    {
        apiKey: "AIzaSyDDb3e3QAHUkqV8cWQgDhjgDHRpijcm9FY",
        authDomain: "seniorproject-1c271.firebaseapp.com",
        databaseURL: "https://seniorproject-1c271.firebaseio.com",
        projectId: "seniorproject-1c271",
        storageBucket: "seniorproject-1c271.appspot.com",
        messagingSenderId: "232076277189"
    };
    firebase.initializeApp(config);

    // const preObject = document.getElementById('object');

    // reference to the database
    // var db = firebase.database().ref().child('object');

    // reset firebase data on page refresh
    firebase.database().ref("/Active").set(null);
    
    // key = 'object'
    // value = 'lala'

    // db.on('value', snapshot => console.log(snapshot.val()));   
    /*
    db.on('value', snap => 
    {
        preObject.innerText = JSON.stringify(snap.val(), null, 1);
    });
    */
}());

// Get the input field
var input = document.getElementById("squadInput");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("squadButton").click();
    input.value = "";
  }
});

function initMap() 
{
    var myOptions = 
    {
        zoom: 18,
        center: {lat: 37.336294, lng: -121.881068},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
        {
            featureType: 'poi.business',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
        },
        {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
        }
        ]    
    }
    map = new google.maps.Map(document.getElementById('map_canvas3'), myOptions);

    // marker playaround
    var marker = new google.maps.Marker({
        position: {lat: 37.336294, lng: -121.881068},
        title: 'Hello World!',
        draggable: false,

        // changes color of icon to blue!
        icon: {                             
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                           
        }
      });

      // adding the marker to the map
      // marker.setMap(map);

      // setting position of marker
      // marker2.setPosition({lat: 37.336294, lng: -121.881068});

      // remove marker
      // marker2.setMap(null);   
} 

/*
function thot()
{
    // converting int to string
    // var num = 15;
    // var n = num.toString();
}

window.onload = thot;
*/

function addAMarker(squadObj)
{
    // add a marker to the map
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(37.337032, -121.880224),
        title: squadObj.Squad + squadObj.Member,
        draggable: false,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: color[colorNum],
            fillOpacity: 0.8,
            strokeWeight: 1
        }
    });

    // add marker to the array
    markersArray.push(marker);

    // adding the marker to the map
    marker.setMap(map);
    return marker;
}

function placeInTable(squadObj)
{
    // Find a <table> element
    var table = document.getElementById("floorTableID");

    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);      // squad
    var cell2 = row.insertCell(1);      // name
    var cell3 = row.insertCell(2);      // status
    var cell4 = row.insertCell(3);      // floor
    var cell5 = row.insertCell(4);      // color
    var cell6 = row.insertCell(5);      // heart
    var cell7 = row.insertCell(6);      // temp
    var cell8 = row.insertCell(7);      // time

    // Add some text to the new cells:
    cell1.innerHTML = squadObj.squad;
    cell2.innerHTML = squadObj.name;
    cell3.style.color = "limegreen";
    cell3.innerHTML = squadObj.status;
    cell4.innerHTML = squadObj.floor;
    cell5.innerHTML = squadObj.color;
    cell6.innerHTML = squadObj.heart;
    cell7.innerHTML = squadObj.temp;
    cell8.innerHTML = squadObj.startTime;
}

// takes in the squad object and throws it into firebase
function activateMember(newSquadMember)
{
    firebase.database().ref("Active/" + newSquadMember.name).set({
        name: newSquadMember.name,
        squad: newSquadMember.squad,
        status: newSquadMember.status,
        floor: newSquadMember.floor,
        marker: newSquadMember.color,
        lat: newSquadMember.lat,
        long: newSquadMember.long,
        markerNum: markerCount
    });
}

function importSquad()
{
    // get the name that was entered
    var sqInputVal = document.getElementById('squadInput').value;

    // get time
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();

    var inactiveRef = firebase.database().ref("All_Squads/" + sqInputVal);
    var newSquadMember;
    inactiveRef.on("value", function(snapshot) {
        const obj = snapshot.val();
        for (const key in obj) 
        {
            newSquadMember = new squadMember(obj[key].Member, "Good", 1, 
                addAMarker(obj[key]), color[colorNum], 37.337032, -121.880224, 
                time, obj[key].Squad, 50, 100);
            console.log(newSquadMember);

            // put new member into squad array
            squadArray.push(newSquadMember);

            // put the new member into the table
            placeInTable(newSquadMember);

            // put new member into firebase
            activateMember(newSquadMember);
            markerCount++; 
        }
    });     
    colorNum++;
}

// test reading from firebase to the console
// var squadRef = firebase.database().ref("squad/");
// squadRef.on("child_added", function(data, prevChildKey) {
//    var newPlayer = data.val();
// });

function changeCheck(a, b)
{
    if (a.name != b.name) logIt(a.name + " has changed their name");
    else if (a.status != b.status) logIt(a.name + "'s status has changed to " + b.status);
    else if (a.floor != b.floor) logIt(a.name + " has moved to floor " + b.floor.toString());
    else if (a.marker != b.marker) logIt(a.name + " has changed their marker color to " + b.marker);
    else if (a.lat != b.lat) logIt (a.name + " has changed location");
    else if (a.long != b.long) logIt(a.name + " has changed location");
}

// checking for updates to the firebase
var squadRef = firebase.database().ref("Active/");
squadRef.on("child_changed", function(snapshot) {
    var squadMemSnap = snapshot.val();
    console.log("Updated Member: " + squadMemSnap.name);

    // it has to have new!!
    var latlng = new google.maps.LatLng(squadMemSnap.lat, squadMemSnap.long);

    // now I need to find the squad member object and update it
    for (var i = 0; i < squadArray.length; i = i + 1)
    {
        if (squadMemSnap.name == squadArray[i].name)
        {   
            changeCheck(squadArray[i], squadMemSnap);

            // update the squad object
            squadArray[i].name = squadMemSnap.name;
            squadArray[i].status = squadMemSnap.status;
            squadArray[i].floor = squadMemSnap.floor;
            squadArray[i].color = squadMemSnap.marker;
            squadArray[i].lat = squadMemSnap.lat;
            squadArray[i].long = squadMemSnap.long;
            squadArray[i].marker.setPosition(latlng);
            // markersArray[squadMemSnap.markerNum].setPosition(latlng);
            // markersArray[i].setPosition(latlng);
            break;
        }
    }

    // update the table
    var squadArrayNum = i;
    var table = document.getElementById('floorTableID');
    var tableRows = table.rows;
    
    // MADE A CHANGE HERE FROM 1 to 0
    for (i = 1; i < tableRows.length; i++)
    {
        if (tableRows[i].cells[1].innerHTML == squadArray[squadArrayNum].name)
        {
            console.log("Match!");
            tableRows[i].cells[0].innerHTML = squadArray[squadArrayNum].squad;
            tableRows[i].cells[1].innerHTML = squadArray[squadArrayNum].name;
            tableRows[i].cells[2].innerHTML = squadArray[squadArrayNum].status;
            tableRows[i].cells[3].innerText = squadArray[squadArrayNum].floor;
            tableRows[i].cells[5].innerHTML = squadArray[squadArrayNum].heart;
            tableRows[i].cells[6].innerText = squadArray[squadArrayNum].temp;
            break;
        }
    }

    // change marker to red color
    if (squadArray[squadArrayNum].status == "Danger")
    {
        console.log("Status changed to Danger");

        // blink the text
        tableRows[i].cells[2].className = "blink";

        // change font to red
        tableRows[i].cells[2].style.color = "red";

        // make the marker bounce 
        markersArray[squadMemSnap.markerNum].setAnimation(google.maps.Animation.BOUNCE);
    }

    if (squadArray[squadArrayNum].status == "Good")
    {
        console.log("Status changed to Good");

        // stop the blink
        tableRows[i].cells[2].className = "";

        // back to black
        tableRows[i].cells[2].style.color = "limegreen";
        markersArray[squadMemSnap.markerNum].setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: squadMemSnap.marker,
            fillOpacity: 0.8,
            strokeWeight: 1
        });

        // stop the bounce
        markersArray[squadMemSnap.markerNum].setAnimation(null);
    }
});

// 37.337032, -121.880224 = Northeast
// 37.336708, -121.879543 = Southeast


 



