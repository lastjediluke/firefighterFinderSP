// ==== GLOBALS ==============================================
var map;
var colon_tick = false;
var markerCount = 0;
var markersArray = [];
var squadArray = [];
var colorNum = 0;
let color = ["blue", "pink", "green", "purple", "yellow",
"white", "brown", "gray", "orange", "black"];
var floorInputVal = 0;
var newMapsArray = [];
var newDivsArray = [];
var beenPressed = 0;

// ==== IMPORTANT APIS/INITS =================================

// Firebase API
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

// Google Maps Initialization
function initMap() 
{
    var myOptions = 
    {
        center: new google.maps.LatLng(37.336294, -121.881068),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 18
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
}

// ==== SMALLER FUNCTIONS =====================================

// Time Function (Updates every 0.5s)
setInterval(updateTime, 1000);
function updateTime()
{
    var today = new Date();

    // Colon_Tick = Colon (:) in the time ticks every second
    if(colon_tick)
    {
        // If the minute is less than 10, add a 0 to the time (eg. 5 minutes = 05)
        if(today.getMinutes() < 10)
        {
            var time = today.getHours() + ":0" + today.getMinutes();
        }
        // Otherwise, concatenate the time
        else
        {
            var time = today.getHours() + ":" + today.getMinutes();
        }
    }
    else
    {
        // If the minute is less than 10, add a 0 to the time (eg. 5 minutes = 05)
        if(today.getMinutes() < 10)
        {
            var time = today.getHours() + " 0" + today.getMinutes();
        }
        // Otherwise, concatenate the time
        else
        {
            var time = today.getHours() + " " + today.getMinutes();
        }
    }

    document.getElementById("time").innerHTML = time.toString();
    colon_tick = ~colon_tick;
}
updateTime();

// Enables the sidebar button functionality
function toggleSidebar()
{
    document.getElementById("sidebar").classList.toggle('active');
}

// ==== ADDING MEMBERS TO TABLE =====================================


// Member class to hold properties of each worker
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

// Imports a pre-made squad from Firebase
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

// Places new items into the table
function placeInTable(squadObj)
{
    // Find a <table> element
    var table = document.getElementById("squadTable");

    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);      // squad
    var cell2 = row.insertCell(1);      // name
    var cell3 = row.insertCell(2);      // status

    // Add some text to the new cells:
    cell1.innerHTML = squadObj.squad;
    cell2.innerHTML = squadObj.name;
    cell3.style.color = "limegreen";
    cell3.innerHTML = squadObj.status;
}

// Takes in the squad object and throws it into firebase
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

// Creates a marker for each member and places it on the Google Map
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

// ==== GPS COORDINATES ======================================
// 37.337032, -121.880224 = Northeast
// 37.336708, -121.879543 = Southeast
