const mapElement = document.querySelector("#map");
const statusElement = document.querySelector("#status");
const boroughButtons = document.querySelectorAll("#boroughControls .toggleButton");
const viewButtons = document.querySelectorAll("#viewControls .toggleButton");

const map = L.map(mapElement).setView([40.7128, -74.006], 10.5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const allMarkers = [];

let activeBorough = "All";
let activeView = "avg";

function getColor(temp) {
  if (temp >= 82) {
    return "#ff1a1a";
  } else if (temp >= 79) {
    return "#ff5e00";
  } else if (temp >= 76) {
    return "#ffb000";
  } else if (temp >= 73) {
    return "#00b7ff";
  } else {
    return "#0057ff";
  }
}

function getRadius(temp) {
  if (temp >= 90) {
    return 30;
  } else if (temp >= 85) {
    return 25;
  } else if (temp >= 80) {
    return 21;
  } else if (temp >= 75) {
    return 17;
  } else {
    return 13;
  }
}

function setActiveButton(buttons, clickedButton) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  clickedButton.classList.add("active");
}

function clearMarkers() {
  for (let i = 0; i < allMarkers.length; i++) {
    map.removeLayer(allMarkers[i]);
  }

  allMarkers.length = 0;
}

function updateStatus(count) {
  let areaText = "New York City overall";
  let viewText = "average temperature";
  let meaningText =
    "This view shows the general temperature pattern across the city.";

  if (activeBorough != "All") {
    areaText = activeBorough;
  }

  if (activeView == "max") {
    viewText = "peak temperature";
    meaningText =
      "This view shows the hottest recorded temperature at each sensor location.";
  }

  statusElement.innerHTML =
    "<strong>Area:</strong> " +
    areaText +
    "<br><br>" +
    "<strong>View:</strong> " +
    viewText +
    "<br>" +
    meaningText +
    "<br><br>" +
    "<strong>Heat Zones:</strong> " +
    count +
    " mapped sensor locations.<br>" +
    "Blue = cooler areas.<br>" +
    "Orange = warmer areas.<br>" +
    "Red = hottest areas.<br><br>" +
    "<strong>Dataset Year:</strong> 2018–2019 NYC Hyperlocal Temperature Monitoring.";
}

function drawMarkers(data) {
  clearMarkers();

  const bounds = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    const temp = parseFloat(item.temp_value);
    const lat = parseFloat(item.latitude);
    const lng = parseFloat(item.longitude);
    const borough = item.borough;

    if (isNaN(temp) || isNaN(lat) || isNaN(lng)) {
      continue;
    }

    const marker = L.circleMarker([lat, lng], {
      radius: getRadius(temp),
      color: getColor(temp),
      fillColor: getColor(temp),
      fillOpacity: 0.82,
      opacity: 1,
      weight: 2
    });

    marker.bindPopup(
      "<b>Borough:</b> " +
        borough +
        "<br><b>" +
        (activeView == "avg" ? "Average Temp" : "Peak Temp") +
        ":</b> " +
        temp.toFixed(1) +
        "°F"
    );

    marker.on("mouseover", function () {
      marker.setStyle({
        fillOpacity: 1,
        weight: 3
      });
    });

    marker.on("mouseout", function () {
      marker.setStyle({
        fillOpacity: 0.82,
        weight: 2
      });
    });

    marker.addTo(map);
    allMarkers.push(marker);
    bounds.push([lat, lng]);
  }

  updateStatus(allMarkers.length);

  if (bounds.length > 0) {
    if (activeBorough == "All") {
      map.setView([40.7128, -74.006], 10.5);
    } else {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 12
      });
    }
  }
}

function loadData() {
  statusElement.innerHTML = "Loading temperature data...";

  let tempFunction = "avg(airtemp)";
  let tempLabel = "temp_value";

  if (activeView == "max") {
    tempFunction = "max(airtemp)";
  }

  let apiUrl =
    "https://data.cityofnewyork.us/resource/qdq3-9eqn.json?$select=borough,latitude,longitude," +
    tempFunction +
    "%20as%20" +
    tempLabel +
    "&$group=borough,latitude,longitude&$limit=5000";

  if (activeBorough != "All") {
    apiUrl =
      "https://data.cityofnewyork.us/resource/qdq3-9eqn.json?$select=borough,latitude,longitude," +
      tempFunction +
      "%20as%20" +
      tempLabel +
      "&$where=borough='" +
      activeBorough +
      "'&$group=borough,latitude,longitude&$limit=5000";
  }

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      drawMarkers(data);
    })
    .catch(function (error) {
      statusElement.innerHTML = "Error loading data.";
      console.log(error);
    });
}

for (let i = 0; i < boroughButtons.length; i++) {
  boroughButtons[i].addEventListener("click", function () {
    activeBorough = boroughButtons[i].dataset.borough;
    setActiveButton(boroughButtons, boroughButtons[i]);
    loadData();
  });
}

for (let i = 0; i < viewButtons.length; i++) {
  viewButtons[i].addEventListener("click", function () {
    activeView = viewButtons[i].dataset.view;
    setActiveButton(viewButtons, viewButtons[i]);
    loadData();
  });
}

loadData();