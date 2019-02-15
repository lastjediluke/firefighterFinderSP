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

    const preObject = document.getElementById('object');

    // reference to the database
    var db = firebase.database().ref().child('object');
    
    // key = 'object'
    // value = 'lala'

    // db.on('value', snapshot => console.log(snapshot.val()));   
    db.on('value', snap => 
    {
        preObject.innerText = JSON.stringify(snap.val(), null, 1);
    });

}());

// squad member class
class squadMember
{
    constructor(name, status, floor, marker, lat, long)
    {
        this.name = name;
        this.status = status;
        this.floor = floor;
        this.marker = marker;
        this.lat = lat;
        this.long = long;
    }
}

// array of squad members
var squadArray = [];


var map;
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

        // changes color of icon to blue!
        icon: {                             
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                           
        }
      });

      // adding the marker to the map
      marker.setMap(map);

      // setting position of marker
      // marker2.setPosition({lat: 37.336294, lng: -121.881068});

      // remove marker
      // marker2.setMap(null);   
} 

var floorInputVal = 0;
var newMaps = [5];
var newDivs = [5];
var beenPressed = 0;
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
        newDivs[i] = document.createElement('div');

        // ids that don't really exist
        newDivs[i].id = 'blank' + i;

        // setAttribute not working
        // newDivs[i].setAttribute("style", "height: 300px, width: 90%, margin: 1em auto"); 

        // setting the attributes of my new 'blank' ids
        newDivs[i].style.backgroundColor = 'gray';
        newDivs[i].style.height = '300px';
        newDivs[i].style.width = '90%';
        newDivs[i].style.margin = '1em auto';
        
        // newDivs[i].id = 'newMapCanvas' + i;
        console.log(newDivs[i].id);
        // add new div
        document.body.appendChild(newDivs[i]);

        // create a map for each floor
        newMaps[i] = new google.maps.Map(document.getElementById(newDivs[i].id), myOptions);

    }
}

/*
function thot()
{
    var topDiv = document.createElement('div');
    topDiv.className = 'titleRow';

    var header1 = document.createElement('h2');
    header1.className = 'titleColumn';

    // testing adding text to an element
    var num = 15;
    var n = num.toString();
    var t = document.createTextNode(' ' + n);
    document.getElementById('fn').appendChild(t);

    // converting int to string
    // var num = 15;
    // var n = num.toString();

}

window.onload = thot;
*/

// testing the time
// setInterval(function(){ alert("Hello"); }, 3000);

/*  Status Layout

Name    |   Status  |   Floor

Bob     |   Green   |   2

*/

// enter the squad and write to the db
// then read from db and insert into table
function squadron()
{
    // get the name that was entered
    var sqInputVal = document.getElementById('squadInput').value;

    // make a section called squad
    var squadRef = firebase.database().ref("squad/" + sqInputVal);

    // var arr = []
    // arr.push() puts stuff into the array

    var newSquadMember = new squadMember(sqInputVal, "great", 4, "pink", 37.336294, -121.881068);

    // insert new member into the squad array
    squadArray.push(newSquadMember);
    for (var i = 0; i < squadArray.length; i = i + 1)
    {
        console.log(squadArray[i]);
    }
    squadRef.set({
        name: sqInputVal,
        status: newSquadMember.status,
        floor: newSquadMember.floor,
        marker: newSquadMember.marker,
        lat: 22.2,
        long: 22.2
    });

    // Find a <table> element
    var table = document.getElementById("floorTableID");

    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(2);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);      // name
    var cell2 = row.insertCell(1);      // status
    var cell3 = row.insertCell(2);      // floor
    var cell4 = row.insertCell(3);      // marker color

    // Add some text to the new cells:
    cell1.innerHTML = sqInputVal;
    cell2.innerHTML = newSquadMember.status;
    cell3.innerHTML = newSquadMember.floor;
    cell4.innerHTML = newSquadMember.marker;
}

// test reading from firebase to the console
var squadRef = firebase.database().ref("squad/");
squadRef.on("child_added", function(data, prevChildKey) {
   var newPlayer = data.val();
//    console.log("marker: " + newPlayer.marker);
//    console.log("status: " + newPlayer.status);
//    console.log("number: " + newPlayer.number);
});

// checking for updates to the firebase
var squadRef = firebase.database().ref("squad/");
squadRef.on("child_changed", function(snapshot) {
    var squadMemSnap = snapshot.val();
    console.log("The updated player name is " + squadMemSnap.name);

    // now I need to find the squad member object and update it
    for (var i = 0; i < squadArray.length; i = i + 1)
    {
        if (squadMemSnap.name == squadArray[i].name)
        {
            // update the squad object
            squadArray[i].name = squadMemSnap.name;
            squadArray[i].status = squadMemSnap.status;
            squadArray[i].floor = squadMemSnap.floor;
            squadArray[i].marker = squadMemSnap.marker;
            squadArray[i].lat = squadMemSnap.lat;
            squadArray[i].long = squadMemSnap.long;
            break;
        }
    }

    // update the table
    var squadArrayNum = i;
    var table = document.getElementById('floorTableID');
    var tableRows = table.rows;
    

    // var x=document.getElementById('myTable').rows[parseInt(rn,10)].cells;
    // x[parseInt(cn,10)].innerHTML=content;
    
    for (i = 1; i < tableRows.length; i++)
    {
        // print the names to console
        console.log("From squad array updated color" + squadArray[squadArrayNum].marker);
        console.log("Row " + i + "name is " + tableRows[i].cells[0].innerHTML + " color is " + tableRows[i].cells[3].innerHTML);
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
});

/*
var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
*/




 



