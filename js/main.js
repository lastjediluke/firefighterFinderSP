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
    var db = firebase.database().ref().child('object');
    // db.on('value', snapshot => console.log(snapshot.val()));   
    db.on('value', snap => 
    {
        preObject.innerText = JSON.stringify(snap.val(), null, 1);
    });

}());


var map, map2;
function initMap() 
{
    var myOptions = 
    {
        zoom: 17.5,
        center: {lat: 37.336294, lng: -121.881068},
        mapTypeId: google.maps.MapTypeId.ROADMAP
        
    }
    map = new google.maps.Map(document.getElementById('map_canvas3'), myOptions);

    map2 = new google.maps.Map(document.getElementById('mapColumn'), myOptions);

    // map3 = new google.maps.Map(document.getElementById('map_canvas3'), myOptions);
} 


function numFloors()
{
    var newDiv = document.createElement('div');
    newDiv.id = 'newMapCanvas';
    var txt = document.getElementById('numFloorsInput').value;
    var node = document.createTextNode(txt);
    // var staticNode = document.createTextNode('boo hoo');

    // options for my map
    var myOptions = 
    {
        zoom: 17.5,
        center: {lat: 37.336294, lng: -121.881068},
        mapTypeId: google.maps.MapTypeId.ROADMAP
        
    }
    
    
    // newP.appendChild(node);
    document.body.appendChild(newDiv);
    var newMap = new google.maps.Map(document.getElementById('newMapCanvas'), myOptions);
    
    // var currentDiv = document.getElementsByClassName(pageTopLeft);
    
}

 



