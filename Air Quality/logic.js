// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [44.96, -93.96],
    zoom: 10
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

var link = "MNcities_airquality.geojson";

d3.json(link, function (data) {
  //console.log(data);
  // L.geoJson(data, {
  // Style each feature (in this case a neighborhood)
  //   style: {
  //     color: "red",
  //     opacity: 0.1,
  //     fillColor: "red",
  //     fillOpacity: 0.5,
  //     weight: 0.5
  //   }
  // }).addTo(myMap);
  let features = data.features
  var heatArray = [];
  features.forEach(function (feature) {
    //console.log(feature.geometry);
    let location = feature.geometry;
    //console.log(location.coordinates[1]);
    if (location) {
      heatArray.push([location.coordinates[1],location.coordinates[0]]);
    }
  });
  console.log(heatArray);
  L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

});
