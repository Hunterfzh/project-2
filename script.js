var mapElement = document.querySelector("#map");

var map = L.map(mapElement).setView([40.7128, -74.006], 11);

//leaflet
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var allMarkers = [];

//marker colors for dots
function createMarker(item) {
  var color = "#00aaff";

  if (item.temp >= 75) {
    color = "#ff2200";
  } else if (item.temp >= 72) {
    color = "#ff7700";
  } else if (item.temp >= 69) {
    color = "#ffcc00";
  }

  var marker = L.circleMarker([item.lat, item.lng], {
    radius: 7,
    color: color,
    fillColor: color,
    fillOpacity: 0.8,
  });

  marker.bindPopup(
    "<b>Borough:</b> " +
      item.borough +
      "<br>" +
      "<b>Temp:</b> " +
      item.temp +
      "°F"
  );
  marker.addTo(map);
  marker.borough = item.borough;
  allMarkers.push(marker);
}

var showAllBtn = document.querySelector("#AllButton");
var showBronxBtn = document.querySelector("#Bronx");
var showManhattanBtn = document.querySelector("#Manhattan");
var showBrooklynBtn = document.querySelector("#Brooklyn");
var showQueensBtn = document.querySelector("#Queens");
var showStatenBtn = document.querySelector("#Staten");

showAllBtn.addEventListener("click", function () {
  for (var i = 0; i < allMarkers.length; i++) {
    allMarkers[i].addTo(map);
  }
});

showBronxBtn.addEventListener("click", function () {
  for (var i = 0; i < allMarkers.length; i++) {
    if (allMarkers[i].borough === "Bronx") {
      allMarkers[i].addTo(map);
    } else {
      allMarkers[i].remove();
    }
  }
});

showManhattanBtn.addEventListener("click", function () {
  for (var i = 0; i < allMarkers.length; i++) {
    if (allMarkers[i].borough === "Manhattan") {
      allMarkers[i].addTo(map);
    } else {
      allMarkers[i].remove();
    }
  }
});

showBrooklynBtn.addEventListener("click", function () {
  for (var i = 0; i < allMarkers.length; i++) {
    if (allMarkers[i].borough === "Brooklyn") {
      allMarkers[i].addTo(map);
    } else {
      allMarkers[i].remove();
    }
  }
});

showQueensBtn.addEventListener("click", function () {
  for (var i = 0; i < allMarkers.length; i++) {
    if (allMarkers[i].borough === "Queens") {
      allMarkers[i].addTo(map);
    } else {
      allMarkers[i].remove();
    }
  }
});

showStatenBtn.addEventListener("click", function () {
  for (var i = 0; i < allMarkers.length; i++) {
    if (allMarkers[i].borough === "Staten Island") {
      allMarkers[i].addTo(map);
    } else {
      allMarkers[i].remove();
    }
  }
});

function onDataReady(data) {
  for (var i = 0; i < data.length; i++) {
    createMarker(data[i]);
  }
}
