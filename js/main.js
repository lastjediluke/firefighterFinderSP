// ==== GLOBALS ==============================================
var map;
var colon_tick = false;

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
};

// ==== HELPER FUNCTIONS =====================================

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

// ==== GPS COORDINATES ======================================
// 37.337032, -121.880224 = Northeast
// 37.336708, -121.879543 = Southeast
