// Globals
var markerCount = 0;
var markersArray = [];
var squadArray = [];    // array of squad members
var map;
var colorNum = 0;
let color = ["blue", "pink", "green", "purple", "yellow", 
"white", "brown", "gray", "orange", "black"];
var floorInputVal = 0;
var newMapsArray = [];
var newDivsArray = [];
var beenPressed = 0;


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
    constructor(name, status, floor, marker, lat, long, startTime)
    {
        this.name = name;
        this.status = status;
        this.floor = floor;
        this.marker = marker;
        this.lat = lat;
        this.long = long;
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
    firebase.database().ref("/squad").set(null);
    
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

function numFloors()
{
    // if I already entered the floors, don't make more maps
    if (beenPressed > 0) 
    {
        return;
    }

    beenPressed = 1;
    console.log(floorInputVal);
    floorInputVal = document.getElementById('numFloorsInput').value;

    logIt(floorInputVal.toString() + " floors created");
    
    // options for my map
    var myOptions = 
    {
        zoom: 17.5,
        center: {lat: 37.336294, lng: -121.881068},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    console.log(floorInputVal);
    for (var i = 0; i < floorInputVal; i = i + 1)
    {
        console.log(i);
        var newDiv = document.createElement('div');

        var newHeaders = document.createElement('h2');
        newHeaders.style.textAlign = 'center';
        var floorPlusPlus = i + 1; 
        newHeaders.innerHTML = "Floor " + floorPlusPlus.toString();

        // ids that don't really exist
        newDiv.id = 'blank' + i;

        // setAttribute not working
        // newDivs[i].setAttribute("style", "height: 300px, width: 90%, margin: 1em auto"); 

        // setting the attributes of my new 'blank' ids
        newDiv.style.backgroundColor = 'gray';
        newDiv.style.height = '300px';
        newDiv.style.width = '90%';
        newDiv.style.margin = '1em auto';

        // add new div
        document.body.appendChild(newHeaders);
        document.body.appendChild(newDiv);

        newDivsArray.push(newDiv);
        
        // create a map for each floor
        var newMap= new google.maps.Map(document.getElementById(newDiv.id), myOptions);
        newMapsArray.push(newMap);
    }
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

// testing the time
// setInterval(function(){ alert("Hello"); }, 3000);

// enter the squad and write to the db
// then read from db and insert into table
function squadron()
{
    
    // get the name that was entered
    var sqInputVal = document.getElementById('squadInput').value;

    // make a section called squad
    var squadRef = firebase.database().ref("squad/" + sqInputVal);

    logIt("New member added: " + sqInputVal);

    // var arr = []
    // arr.push() puts stuff into the array

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(37.337032, -121.880224),
        title: sqInputVal,
        draggable: false,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: color[colorNum],
            fillOpacity: 0.8,
            strokeWeight: 1
        }
    });
    markersArray.push(marker);

    // adding the marker to the map
    marker.setMap(map);

    var newSquadMember = new squadMember(sqInputVal, "Good", 1, color[colorNum], 37.337032, -121.880224);
    colorNum++;

    // insert new member into the squad array
    squadArray.push(newSquadMember);
    for (var i = 0; i < squadArray.length; i = i + 1)
    {
        // console.log(squadArray[i]);
    }
    squadRef.set({
        name: sqInputVal,
        status: newSquadMember.status,
        floor: newSquadMember.floor,
        marker: newSquadMember.marker,
        lat: newSquadMember.lat,
        long: newSquadMember.long,
        markerNum: markerCount
    });
    markerCount++;

    // Find a <table> element
    var table = document.getElementById("floorTableID");

    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);      // name
    var cell2 = row.insertCell(1);      // status
    var cell3 = row.insertCell(2);      // floor
    var cell4 = row.insertCell(3);      // marker color

    // Add some text to the new cells:
    cell1.innerHTML = sqInputVal;
    cell2.innerHTML = newSquadMember.status;
    cell2.style.color = "limegreen";
    cell3.innerHTML = newSquadMember.floor;
    cell4.innerHTML = newSquadMember.marker;
}

// test reading from firebase to the console
// var squadRef = firebase.database().ref("squad/");
// squadRef.on("child_added", function(data, prevChildKey) {
//    var newPlayer = data.val();
// });

function changeCheck(a, b)
{
    if (a.name != b.name) logIt(a.name + " has changed their name");
    else if (a.status != b.status) logIt(a.name + "'s status has changed");
    else if (a.floor != b.floor) logIt(a.name + " has moved to floor " + b.floor.toString());
    else if (a.marker != b.marker) logIt(a.name + " has changed their marker color to " + b.marker);
    else if (a.lat != b.lat) logIt (a.name + " has changed location");
    else if (a.long != b.long) logIt(a.name + " has changed location");
}

// checking for updates to the firebase
var squadRef = firebase.database().ref("squad/");
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
            // if we member went up a floor
            if (squadArray[i].floor != squadMemSnap.floor)
            {
                // console.log(squadArray[i].name + " changed floors");
                // markersArray[squadMemSnap.markerNum].setMap(null);
                // markersArray[squadMemSnap.markerNum].setMap(newMapsArray[0]);
                // markersArray[squadMemSnap.markerNum].setMap(map);
            }

            changeCheck(squadArray[i], squadMemSnap);

            // update the squad object
            squadArray[i].name = squadMemSnap.name;
            squadArray[i].status = squadMemSnap.status;
            squadArray[i].floor = squadMemSnap.floor;
            squadArray[i].marker = squadMemSnap.marker;
            squadArray[i].lat = squadMemSnap.lat;
            squadArray[i].long = squadMemSnap.long;
            markersArray[squadMemSnap.markerNum].setPosition(latlng);
            break;
        }
    }

    // update the table
    var squadArrayNum = i;
    var table = document.getElementById('floorTableID');
    var tableRows = table.rows;
    
    // MADE A CHANGE HERE FROM 1 to 0
    for (i = 0; i < tableRows.length; i++)
    {
        if (tableRows[i].cells[0].innerHTML == squadArray[squadArrayNum].name)
        {
            console.log("Match!");
            tableRows[i].cells[0].innerHTML = squadArray[squadArrayNum].name;
            tableRows[i].cells[1].innerHTML = squadArray[squadArrayNum].status;
            tableRows[i].cells[2].innerHTML = squadArray[squadArrayNum].floor;
            tableRows[i].cells[3].innerText = squadArray[squadArrayNum].marker;
            break;
        }
    }


    // change marker to red color
    if (squadArray[squadArrayNum].status == "Danger")
    {
        console.log("Status changed to Danger");

        // blink the text
        tableRows[i].cells[1].className = "blink";

        // change font to red
        tableRows[i].cells[1].style.color = "red";

        // make the marker bounce 
        markersArray[squadMemSnap.markerNum].setAnimation(google.maps.Animation.BOUNCE);
    }

    if (squadArray[squadArrayNum].status == "Good")
    {
        console.log("Status changed to Good");

        // stop the blink
        tableRows[i].cells[1].className = "";

        // back to black
        tableRows[i].cells[1].style.color = "limegreen";
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

// var table = new Tabulator("#example-table", {});

var timer = new easytimer.Timer();
var timer2 = new easytimer.Timer();

// I should do a timestamp

function timer()
{

}

$('#chronoExample .startButton').click(function () {
    timer.start();
});
$('#chronoExample .pauseButton').click(function () {
    timer.pause();
});
$('#chronoExample .stopButton').click(function () {
    timer.stop();
});
$('#chronoExample .resetButton').click(function () {
    timer.reset();
});
timer.addEventListener('secondsUpdated', function (e) {
    $('#chronoExample .values').html(timer.getTimeValues().toString());
});
timer.addEventListener('started', function (e) {
    $('#chronoExample .values').html(timer.getTimeValues().toString());
});
timer.addEventListener('reset', function (e) {
    $('#chronoExample .values').html(timer.getTimeValues().toString());
});


 



