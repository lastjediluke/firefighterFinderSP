// this func is also unused
function squadron()
{
    // get the name that was entered
    var sqInputVal = document.getElementById('squadInput').value;

    // make a section called squad
    var squadRef = firebase.database().ref("squad/" + sqInputVal);

    logIt("New squad added: " + sqInputVal);

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

// this func is currently not used
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