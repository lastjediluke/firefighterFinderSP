// ==== GLOBALS ==============================================
var map;                        // Map variable
var colon_tick = false;         // Bool variable for clock function
var markerCount = 0;            // Counts number of markers on map
var markersArray = [];          // Holds all markers
var squadArray = [];            // Holds all squad members
var colorNum = 0;               // Index for the color array
let color = ["lightred", "green", "blue", "purple", "yellow",
"white", "brown", "gray", "orange", "black"];
var drawingManager;             // Google Maps Drawing Options
var shapeSelection;             // Holds currently selected shape
var simulationVariable;         // Holds the simnulation function
var infoCheck;                  // Holds the function that displays info in info table in real-time
var currentMemberDisplay;       // Holds member that is being displayed in the info box

// GPS Simulation Points
var gpsIndex = 0;
var gps1lat = [37.337132, 37.337232, 37.337332, 37.337432];
var gps1long = [-121.880224, -121.880324, -121.880424, -121.880524];
var gps2lat = [37.337032, 37.336932, 37.336832, 37.336732];
var gps2long = [-121.881224, -121.881324, -121.881424, -121.881524];
var gps3lat = [37.335032, 37.334932, 37.334832, 37.334732];
var gps3long = [-121.881224, -121.881124, -121.881024, -121.880924];

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

    // reset firebase data on page refresh
    firebase.database().ref("/Active").set(null);
    
    // const preObject = document.getElementById('object');

    // reference to the database
    // var db = firebase.database().ref().child('object');

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
    // General Google Maps options
    var myOptions = 
    {
        center: new google.maps.LatLng(37.336294, -121.881068),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 18,
        // mapTypeId: 'satellite',
        tilt: 0
    };

    // Create the map
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    // Set the drawing options for each drawing type
    var drawingOptions =
    {
        strokeColor: '#870000',
        fillColor: '#ff0000',
        editable: true
    }

    // Set general drawing preferences
    drawingManager = new google.maps.drawing.DrawingManager
    ({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon', 'polyline', 'rectangle', 'circle']
        },

        // Set each type of drawing function to the drawingOptions structure
        polygonOptions: drawingOptions,
        polylineOptions: drawingOptions,
        rectangleOptions: drawingOptions,
        circleOptions: drawingOptions,
    });
    drawingManager.setMap(map);

    // Once you've added a shape to the map, perform the following...
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(obj) {
        // Changes to default mode after making a drawing
        drawingManager.setDrawingMode(null);
        
        var shape = obj.overlay;
        shape.type = obj.type;

        // Eventlistener enables users to "select" a shape by clicking it.
        google.maps.event.addListener(shape, 'click', function() {
            shapeSelect(shape);
        });

        // Select shape once it's been added
        shapeSelect(shape);
    });

    // Adds a reticle to the center of the map
    var reticleShape = {coords:[0,0,0,0],type:'rect'};
    var reticle = new google.maps.Marker({
        map: map,
        icon: 'https://www.daftlogic.com/images/cross-hairs.gif',
        shape: reticleShape
    });
    reticle.bindTo('position', map, 'center');

    // Deselects a selected shape when clicking the map or changing drawing mode.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', shapeClear);
    google.maps.event.addListener(map, 'click', shapeClear);

    // DomListener to delete a selected shape when the button is clicked
    google.maps.event.addDomListener(document.getElementById('deleteShapeButton'), 'click', shapeDelete);
}

// ==== SMALLER FUNCTIONS =====================================

// Time Function (Updates every 1s)
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
        // this.startTime = startTime;
        this.squad = squad;
        // this.heart = heart;
        // this.temp = temp;
        // this.ID = ID
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
            // console.log(newSquadMember);

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

    row.addEventListener('mouseover', () => updateTable(squadObj));
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
            scale: 7,
            fillColor: color[colorNum],
            fillOpacity: 0.8,
            strokeWeight: 1
        },
    });

    // Add marker to the array
    markersArray.push(marker);

    // Adds ability to hover over the marker for a function
    marker.addListener('mouseover', () => updateMarker(squadObj));
    marker.addListener('mouseout', () => displayClear());

    // Adding the marker to the map
    marker.setMap(map);
    return marker;
}

// Clears table
function clearTable()
{
    var i = 0;  // Index

    // Grabs table and clears the rows
    var clear = document.getElementById('squadTable');
    console.log(clear.rows.length);
    for(i=markerCount; i>0; i--)
    {
        clear.deleteRow(i);
    }

    // Clear arrays and variables
    for(i=0; i<markerCount; i++)
    {
        markersArray[i].setMap(null);
    }
    markerCount = 0;
    markersArray = [];
    squadArray = [];

    // Clears firebase /Active
    firebase.database().ref("/Active").set(null);

    // Clear info display
    simulationStop();
    displayClear();
}

// ==== FIREBASE UPDATES ============================================

// Checking for updates to the firebase
var squadRef = firebase.database().ref("Active/");
squadRef.on("child_changed", function(snapshot) {
    var squadMemSnap = snapshot.val();
    console.log("Updated Member: " + squadMemSnap.name);

    // New variables to change (it has to have new!)
    var latlng = new google.maps.LatLng(squadMemSnap.lat, squadMemSnap.long);
    // var newColor = new google.maps.Symbol;
    // console.log(newColor);

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
            // squadArray[i].marker.setShape(shape);
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
    for (var j = 1; j < tableRows.length; j++)
    {
        if (tableRows[j].cells[1].innerHTML == squadArray[squadArrayNum].name)
        {
            console.log("Match!");
            tableRows[j].cells[0].innerHTML = squadArray[squadArrayNum].squad;
            tableRows[j].cells[1].innerHTML = squadArray[squadArrayNum].name;
            tableRows[j].cells[2].innerHTML = squadArray[squadArrayNum].status;
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
        tableRows[j].cells[2].className = "blink";

        // change font to red
        tableRows[j].cells[2].style.color = "red";

        // make the marker bounce
        markersArray[squadMemSnap.markerNum].setAnimation(google.maps.Animation.BOUNCE);

        // console.log(markersArray[squadMemSnap.markerNum].icon.fillColor);

        // Change marker color
        // markersArray[squadMemSnap.markerNum].icon.fillColor = "red";
    }

    else if (squadArray[squadArrayNum].status == "Good")
    {
        console.log("Status changed to Good");

        // Stop the blinking table text
        tableRows[j].cells[2].className = "";

        // Back to green table text
        tableRows[j].cells[2].style.color = "limegreen";

        // markersArray[squadMemSnap.markerNum].setIcon({
        //     path: google.maps.SymbolPath.CIRCLE,
        //     scale: 7,
        //     fillColor: squadMemSnap.marker,
        //     fillOpacity: 0.8,
        //     strokeWeight: 1
        // });

        // stop the bounce
        markersArray[squadMemSnap.markerNum].setAnimation(null);
    }
});

// ==== DISPLAY INFO ================================================

// Begins continuous call to display info in the info box (Table)
function updateTable(squadObj)
{
    currentMemberDisplay = squadObj;
    infoCheck = setInterval(displayInfoTable, 100);
}

// Begins continuous call to display info in the info box (Marker)
function updateMarker(squadObj)
{
    currentMemberDisplay = squadObj;
    infoCheck = setInterval(displayInfoMarker, 100);
}

// Hovering over a row displays info
function displayInfoTable()
{
    // Obtain a "snapshot" of the data
    return firebase.database().ref('Active/' + currentMemberDisplay.name).once('value').then(function(snapshot)
    {
        const obj = snapshot.val();
        var cell;

        // Get the table object and the right cell spot
        cell = document.getElementById("infoTable").rows[0].cells[1];
        cell.innerHTML = obj.name;
        cell = document.getElementById("infoTable").rows[1].cells[1];
        cell.innerHTML = obj.squad;
        cell = document.getElementById("infoTable").rows[2].cells[1];
        cell.innerHTML = obj.status;
        cell = document.getElementById("infoTable").rows[3].cells[1];
        cell.innerHTML = obj.lat.toFixed(8);
        cell = document.getElementById("infoTable").rows[4].cells[1];
        cell.innerHTML = obj.long.toFixed(8);
        cell = document.getElementById("infoTable").rows[5].cells[1];
        cell.innerHTML = obj.floor;
        cell = document.getElementById("infoTable").rows[6].cells[1];
        cell.innerHTML = obj.marker;
    });
}

// Hovering over a marker displays info
function displayInfoMarker()
{
    return firebase.database().ref('Active/' + currentMemberDisplay.Member).once('value').then(function(snapshot)
    {
        const obj = snapshot.val();
        var cell;

        // Get the table object and the right cell spot
        cell = document.getElementById("infoTable").rows[0].cells[1];
        cell.innerHTML = obj.name;
        cell = document.getElementById("infoTable").rows[1].cells[1];
        cell.innerHTML = obj.squad;
        cell = document.getElementById("infoTable").rows[2].cells[1];
        cell.innerHTML = obj.status;
        cell = document.getElementById("infoTable").rows[3].cells[1];
        cell.innerHTML = obj.lat.toFixed(8);
        cell = document.getElementById("infoTable").rows[4].cells[1];
        cell.innerHTML = obj.long.toFixed(8);
        cell = document.getElementById("infoTable").rows[5].cells[1];
        cell.innerHTML = obj.floor;
        cell = document.getElementById("infoTable").rows[6].cells[1];
        cell.innerHTML = obj.marker;
    }); 
}

// Clears the info box when not hovering
function displayClear()
{
    // Get the table object and the right cell spot
    cell = document.getElementById("infoTable").rows[0].cells[1];
    cell.innerHTML = " ";
    cell = document.getElementById("infoTable").rows[1].cells[1];
    cell.innerHTML = " ";
    cell = document.getElementById("infoTable").rows[2].cells[1];
    cell.innerHTML = " ";
    cell = document.getElementById("infoTable").rows[3].cells[1];
    cell.innerHTML = " ";
    cell = document.getElementById("infoTable").rows[4].cells[1];
    cell.innerHTML = " ";
    cell = document.getElementById("infoTable").rows[5].cells[1];
    cell.innerHTML = " ";
    cell = document.getElementById("infoTable").rows[6].cells[1];
    cell.innerHTML = " ";

    clearInterval(infoCheck);
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
    return firebase.database().ref('Active/' + squadObj.name).once('value').then(function(snapshot)
    {
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
        
        // markersArray[obj.markerNum].setAnimation(google.maps.Animation.DROP);
        // markersArray[obj.markerNum].setAnimation(google.maps.Animation.NULL);

        // Marker bounces for 5s
        // setTimeout(function(){markersArray[obj.markerNum].setAnimation(google.maps.Animation.BOUNCE)}, 500);
        // setTimeout(function(){markersArray[obj.markerNum].setAnimation(google.maps.Animation.NULL)}, 5000);
    }); 
}

// ==== DRAWING =====================================================

// Selects the shape
function shapeSelect(shape)
{
    shapeClear();               // Deselect any currently selected shape
    shapeSelection = shape;     // Select new shape
    shape.setEditable(true);    // Make it editable
}

// Deselects the shape
function shapeClear()
{
    // If a shape has been selected...
    if(shapeSelection)
    {
        // Deselect it
        shapeSelection.setEditable(false);
        shapeSelection = null;
    }
}

// Deletes the selected shape
function shapeDelete()
{
    console.log("Clearing shape...");
    // If a shape has been selected...
    if(shapeSelection)
    {
        // DELETE
        shapeSelection.setMap(null);
    }
    else
    {
        alert("No shape has been selected!");
    }
}

// ==== SIMULATION ==================================================

function simulationStart()
{
    simulationVariable = setInterval(simulation, 1000);
    alert("Simulation Started!");
}

function simulationStop()
{
    clearInterval(simulationVariable);
    alert("Simulation Stopped!");
}

function simulation()
{
    // for(var j=0; j<squadArray.length; j++)
    // {

    // }
    var memberRef;

    memberRef = firebase.database().ref("Active/Luke Dillon").update
    ({
        lat: gps1lat[gpsIndex],
        long: gps1long[gpsIndex]
    });
    memberRef = firebase.database().ref("Active/Troy Kurniawan").update
    ({
        lat: gps2lat[gpsIndex],
        long: gps2long[gpsIndex]
    });
    memberRef = firebase.database().ref("Active/Zijian Guan").update
    ({
        lat: gps3lat[gpsIndex],
        long: gps3long[gpsIndex]
    });
    memberRef = firebase.database().ref("Active/William Wong").update
    ({
        lat: 37.335698,
        long: -121.885128,
        floor: gpsIndex+1
    });

    gpsIndex = (gpsIndex+1) % 4;
}

// ==== CHART =======================================================

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    // Configuration options go here
    options: {}
});

// ==== GPS COORDINATES ======================================
// 37.337032, -121.880224 = Northeast
// 37.336708, -121.879543 = Southeast

// 37.335698, -121.885128 = Library