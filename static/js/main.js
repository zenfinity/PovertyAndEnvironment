/*Main js for Poverty and Environment webapp

*/

// Define streetmap and darkmap layers, must be done first
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// Creating map object for initial load
//...add layer we want to show up right away
var mainMap = L.map("map", {
  center: [46.026063, -94.575648],
  zoom: 7,
  layers : [darkmap,noiseLayer]
});

// Create a layer control
// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create overlay object to easily pass layers to control
var overlayMaps = {
  //"Poverty" : 
  "Noise" : noiseLayer,
  "Water Quality" : waterLayer,
  "Air Quality" : airQualityLayer
};
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(mainMap);

//noiseLayer.addTo(mainMap);
createNoiseLegend(mainMap);
airQualityLayer.addTo(mainMap);
waterLayer.addTo(mainMap);

function createLegend(map) {
  /*Legend specific*/
  var legend = L.control({ position: "bottomleft" });

  legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Noise Magnitude</h4>";
      div.innerHTML += `<i style="background: #${colorRange[0]}"></i><span>30dB (quiet conversation)</span><br>`;
      div.innerHTML += `<i style="background: #${colorRange[4]}"></i><span>80dB (phone ring)</span><br>`;
      div.innerHTML += `<i style="background: #${colorRange[7]}"></i><span>120dB (ambulance siren)</span><br>`;
      div.innerHTML += "<i><a href='https://en.wikipedia.org/wiki/Health_effects_from_noise'>More</a></i>"
      
      return div;
  };

  legend.addTo(map);
}