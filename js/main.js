// ==== GLOBALS ==============================================
var map;

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

// Google Maps
function initMap() 
{
    var myOptions = 
    {
        center: new google.maps.LatLng(37.336294, -121.881068),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 18
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
};

// ==== HELPER FUNCTIONS =====================================

// Time Function (Updates every 60s)
setInterval(updateTime, 60000);
function updateTime()
{
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    document.getElementById("time").innerHTML = "Current Time " + time.toString();
}
updateTime();

// Rotation animation
function rotateAnimation(obj, speed)
{
    let elem = document.getElementById(obj);
    elem.style.transform = "rotate("+degrees+"deg)";
    looper = setTimeout('rotateAnimation(\''+obj+'\','+speed+')', speed);
    degrees++;

    // Reset degree
    if(degrees > 359)
    {
        degrees = 1;
    }
}

// Allows loading screen to disappear after the page has fully loaded
window.addEventListener("load", function()
{
    let load_screen = document.getElementById("load_screen");
    document.body.removeChild(load_screen);
});

// ==== GPS COORDINATES ======================================
// 37.337032, -121.880224 = Northeast
// 37.336708, -121.879543 = Southeast
