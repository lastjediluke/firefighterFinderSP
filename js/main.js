// ==== GLOBALS ==============================================
var map;
var colon_tick = false;
var markerCount = 0;
var markersArray = [];
var squadArray = [];
var colorNum = 0;
let color = ["lightred", "blue", "green", "purple", "yellow",
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
        zoom: 18,
        mapTypeId: 'satellite',
        tilt: 0
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

// Random number generator
function getRndInteger(min, max)
{
    return Math.floor(Math.random() * (max - min) ) + min;
}

// ==== ADDING MEMBERS TO TABLE =====================================

// Member class to hold properties of each worker
class squadMember
{
    constructor(name, status, floor, marker, color, lat, long, startTime, squad, heart, temp, ID)
    {
        this.name = name;
        this.status = status;
        this.floor = floor;
        this.marker = marker;
        this.color = color;
        this.lat = lat;
        this.long = long;
        this.startTime = startTime;
        this.squad = squad;
        this.heart = heart;
        this.temp = temp;
        this.ID = ID
    }
}

// Imports a pre-made squad from Firebase
function importSquad()
{
    // get the name that was entered
    var sqInputVal = document.getElementById('squadInput').value;

    //  Check if the squad has already been imported
    for(var i=0; i<squadArray.length; i++)
    {
        if(sqInputVal == squadArray[i].squad)
        {
            alert("Error! This squad has already been imported!");
            return;
        }
    }

    // get time
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();

    var inactiveRef = firebase.database().ref("All_Squads/" + sqInputVal);
    var newSquadMember;
    
    inactiveRef.on("value", function(snapshot) {
        const obj = snapshot.val();
        for (const key in obj) 
        {
            // Generates random numbers to vary the default GPS setting
            var i = (getRndInteger(0, 100) * (0.00001));
            var j = (getRndInteger(0, 100) * (0.00001));
            
            // Calculate new GPS values
            var lat = 37.337 + i;
            var lon = -121.880 + j;

            // newSquadMember object
            newSquadMember = new squadMember(obj[key].Member, "Good", 1, 
                addAMarker(obj[key], lat, lon), color[colorNum], lat, lon, 
                time, obj[key].Squad, 50, 100, markerCount);
            console.log(newSquadMember);

            // Put new member into squad array
            squadArray.push(newSquadMember);

            // Put the new member into the table
            placeInTable(newSquadMember);

            // Put new member into firebase
            activateMember(newSquadMember);
            markerCount++; 
        }
    }); 
    // Assign new colors to the next squad imported
    colorNum = (colorNum+1) % 10;
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

    row.addEventListener('mouseover', () => displayInfoTable(squadObj));
    row.addEventListener('mouseout', () => displayClear());
    row.addEventListener('click', () => clickTableMapPosition(squadObj));
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
function addAMarker(squadObj, lat, lon)
{
    // Add a marker to the map
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        title: squadObj.Squad + ': ' + squadObj.Member,
        draggable: false,
        map: map,
        member: squadObj,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: color[colorNum],
            fillOpacity: 0.8,
            strokeWeight: 1
        },
    });

    // Add marker to the array
    markersArray.push(marker);

    // Adds ability to hover over the marker for a function
    marker.addListener('mouseover', () => displayInfoMarker(squadObj));
    marker.addListener('mouseout', () => displayClear());

    // Adding the marker to the map
    marker.setMap(map);
    return marker;
}

// ==== FIREBASE UPDATES ============================================

// Checking for updates to the firebase
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
    var table = document.getElementById('squadTable');
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
            // tableRows[i].cells[3].innerText = squadArray[squadArrayNum].floor;
            // tableRows[i].cells[5].innerHTML = squadArray[squadArrayNum].heart;
            // tableRows[i].cells[6].innerText = squadArray[squadArrayNum].temp;
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

    else if (squadArray[squadArrayNum].status == "Good")
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

// ==== DISPLAY INFO ================================================

// Hovering over a row displays info
function displayInfoTable(squadObj)
{
    // console.log(squadObj);

    // Access member data at "Active/<name of member>" in Firebase
    var memberRef = firebase.database().ref("Active/" + squadObj.name);

    // Obtain a "snapshot" of the data
    memberRef.on("value", function(snapshot) {
        const obj = snapshot.val();
        var text;
        var display;

        display = document.getElementById("infoName");
        text = obj.name;
        display.textContent = (text);

        display = document.getElementById("infoSquad");
        text = obj.squad;
        display.textContent = (text);

        display = document.getElementById("infoStatus");
        text = obj.status;
        display.textContent = (text);

        display = document.getElementById("infoLocation");
        text = "(" + obj.lat + ", " + obj.long + ")";
        display.textContent = (text);

        display = document.getElementById("infoFloor");
        text = obj.floor;
        display.textContent = (text);

        display = document.getElementById("infoColor");
        text = obj.marker;
        display.textContent = (text);
    }); 
}

// Hovering over a marker displays info
function displayInfoMarker(squadObj)
{
    // console.log(squadObj);

    // Access member data at "Active/<name of member>" in Firebase
    var memberRef = firebase.database().ref("Active/" + squadObj.Member);

    // Obtain a "snapshot" of the data
    memberRef.on("value", function(snapshot) {
        const obj = snapshot.val();
        var text;
        var display;

        display = document.getElementById("infoName");
        text = obj.name;
        display.textContent = (text);

        display = document.getElementById("infoSquad");
        text = obj.squad;
        display.textContent = (text);

        display = document.getElementById("infoStatus");
        text = obj.status;
        display.textContent = (text);

        display = document.getElementById("infoLocation");
        text = "(" + obj.lat + ", " + obj.long + ")";
        display.textContent = (text);

        display = document.getElementById("infoFloor");
        text = obj.floor;
        display.textContent = (text);

        display = document.getElementById("infoColor");
        text = obj.marker;
        display.textContent = (text);
    }); 
}

// Clears the info box when not hovering
function displayClear()
{
    display = document.getElementById("infoName");
    display.textContent = (" ");

    display = document.getElementById("infoSquad");
    display.textContent = (" ");

    display = document.getElementById("infoStatus");
    display.textContent = (" ");

    display = document.getElementById("infoLocation");
    display.textContent = (" ");

    display = document.getElementById("infoFloor");
    display.textContent = (" ");

    display = document.getElementById("infoColor");
    display.textContent = (" ");
}

// ==== SEARCH BAR ==================================================

// Search bar function
function searchFunction()
{
    var inputBox, bufferCheck, table, tr, td, i, memberNameBuffer;

    inputBox = document.getElementById("squadSearch");      // Get inputBox element
    bufferCheck = inputBox.value.toUpperCase();             // Set up a buffer (set to all uppercase)
    table = document.getElementById("squadTable");          // Get table element
    tr = table.getElementsByTagName("tr");                  // Get table row element

    // Search through all table rows | Display only the matching members
    for (i = 0; i < tr.length; i++)
    {
        td = tr[i].getElementsByTagName("td")[1];                   // Grab member cell of the current row
        if (td)                                                     // (Note that [1] checks the 'member' cell)
        {
            memberNameBuffer = td.textContent || td.innerText;
            if (memberNameBuffer.toUpperCase().indexOf(bufferCheck) > -1)
            {
                tr[i].style.display = "";                           // Display
            }
            else
            {
                tr[i].style.display = "none";                       // Hide
            }
        } 
    }
}

// ==== CHANGE MAP POSITION =========================================

// Clicking a row in the table will move the map to the marker
function clickTableMapPosition(squadObj)
{
    
    // Access member data at "Active/<name of member>" in Firebase
    var memberRef = firebase.database().ref("Active/" + squadObj.name);
    
    // Obtain a "snapshot" of the data
    memberRef.on("value", function(snapshot) {
        const obj = snapshot.val();

        // Pan the map to the appropriate marker / Set zoom to 20 (closer to the marker)
        var center = new google.maps.LatLng(obj.lat, obj.long);
        map.panTo(center);
        map.setZoom(20);

        // Avoid calling the BOUNCE function if the marker is already bouncing due to its "Danger" status
        for (var i = 0; i < squadArray.length; i = i + 1)
        {
            if (obj.name == squadArray[i].name)
            {
                break;
            }
        }
        var squadArrayNum = i;
            
        if (squadArray[squadArrayNum].status == "Danger")
        {
            console.log("ALREADY BOUNCING!");
            return;
        }

        // Marker bounces for 5s
        setTimeout(function(){markersArray[obj.markerNum].setAnimation(google.maps.Animation.BOUNCE)}, 500);
        setTimeout(function(){markersArray[obj.markerNum].setAnimation(google.maps.Animation.NULL)}, 5000);
    }); 
}

// ==== GPS COORDINATES ======================================
// 37.337032, -121.880224 = Northeast
// 37.336708, -121.879543 = Southeast
