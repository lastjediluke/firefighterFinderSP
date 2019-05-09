# Firefighter Finder (Frontend Website)

This repository holds the program for the Firefighter Finder website frontend.

Full documentation can be found here: https://docs.google.com/document/d/1DxI_6I9enLtFY22vJAybF5HJsoK42JMSFRP6dGbZ8as/edit?usp=sharing

You can visit the website here: https://lastjediluke.github.io/firefighterFinderSP/

(Alternatively, you can access the website by simply downloading the entire repository and opening the "index.html" file in a web browser)

**Code Structure:**
The code layout of the website is as follows:
- index.html (info layout)
- main.css (stylizing)
- main.js (scripting)
- Various Firebase files to interact with the Firebase database.

## Features

**1. Fully functional Google Map that can be used the same way as a normal Google Map.**
- Pan
- Zoom
- Street View
- Tilt

**2. Drawing tools (located at the top) can be used to draw shapes on the map for user convenience.**
- Polygons
- Squares
- Circles
- Lines

**3. Quick squad importing.**
- Select any predefined squad to import onto the web app. Every member of that squad will be added.
- Markers associated with each member
- A table will be filled with all imported members.

**4. Member Info**
- Hovering over the table row or the marker will reveal more details about that member in the bottom left corner.

**5. Find a member**
- Clicking on any member row will pan the map to that member's marker.

**6. Search bar**
- Filter the table by name

**7. Clear table**
- When done, the user can clear out the entire table and remove all markers off of the map.
