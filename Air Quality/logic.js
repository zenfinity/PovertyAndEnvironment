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
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.aqi),
      stroke: true,
      color: "#000000",
      weight: 0.5
    };
  }

  function getColor(aqi) {
    switch (true) {
      case aqi >= 80:
        return "green";
      case aqi <= 79:
        return "lime";
      case aqi <= 69:
        return "yellow";
      case aqi <=  59:
        return "orange";
      case aqi <= 49:
        return "red";
      case aqi <= 39:
        return "maroon";
      default:
        return "#098ee00";
         
    }
  }
L.geoJson(data, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
  },
  // circle style
  style: styleInfo,
  // popup for each marker
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Air Quality Index " + feature.properties.aqi + "<br>Category:" + feature.properties.category +  "<br>Location: " + feature.properties.city);
  }
}).addTo(myMap);
})
  //console.log(data);
//   L.geoJson(data, {
//   //Style each feature 
//     style: {
//       color: "red",
//       opacity: 0.1,
//       fillColor: "red",
//       fillOpacity: 0.5,
//       weight: 0.5
//     }
//   }).addTo(myMap);
// });
//   let features = data.features
//   var heatArray = [];
//   features.forEach(function (feature) {
//     //console.log(feature.geometry);
//     let location = feature.geometry;
//     //console.log(location.coordinates[1]);
//     if (location) {
//       heatArray.push([location.coordinates[1],location.coordinates[0]]);
//     }
//   });
//   console.log(heatArray);

// //   // var aqiArray = [];
// //   // features.forEach(function (feature) {
// //   //   //console.log(feature.geometry);
// //   //   let aqi = feature.properties;
// //   //   //console.log(location.coordinates[1]);
// //   //   if (aqi) {
// //   //     aqiArray.push([properties.aqi]);
// //   //   }
// //   // });

//   L.heatLayer(heatArray, {
//     radius: 20,
//     blur: 15,
//     //gradient: {0: 'lime', 50: 'yellow', 100:'orange', 150: 'red', 200: 'raspberry', 300: 'maroon'}
//   }).addTo(myMap);

// });
