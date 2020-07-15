// Creating map object
var myMap = L.map("map", {
  center: [46.7, -94.7],
  zoom: 7
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var baseURL = "https://enviro.epa.gov/enviro/efservice/";
var table = "water_system/";
var column = "state_code/";
var state = "MN/";
let table2 = "violation/";
let column2 = "compl_per_begin_date/";
let column3 = "is_health_based_ind/"
let column4 = "outstanding_performer/"
let column5 = "pwsid/";
let id = "27/";
let yes = "Y/";
let operator2 = "!=/";
let value = "null/";
let operator = "CONTAINING/"
let operator3 = "BEGINNING/"
let date =  "-18/"; // "01-JAN-18/";
let activity = "pws_activity_code/";
let code = "A/";
let other = "rows/1:19/"
let type = "JSON"
let count = "count"

//https://enviro.epa.gov/enviro/efservice/violation/compl_per_begin_date/CONTAINING/-18/rows/1:19/JSON

// Assemble API query URL
var url1 = baseURL + table + column + state + table2 + other + type; //basic H2O sys + violations
var url2 = baseURL + table + column + state + table2 + other + type; //H2O sys and Violation date *columns diff than expected + column2 + operator + date
var url3 = baseURL + table + column + state + table2 + column3 + yes + other + type; //H2O sys and violation not null *still contained nulls
var url4 = baseURL + table + column + state + table2 + table2 + value + other + type; //violation null doesn't work
var url5 = baseURL + table2 + column2 + operator + date + other + type; //violation date
var url6 = baseURL + table + column + state + table2 + column3 + yes + other + type; //
var url7 = baseURL + table + column + state + table2 + column2 + operator + date + other + type; // returns violations that are null
var url8 = baseURL + table + column + state + activity + code + table2 + count; //active H2O sys + violations 60005
var url9 = baseURL + table + column + state + column4 + operator + yes + count; //active H2O sys + outstanding performer *non found
var url10 = baseURL + table2 + column5 + operator3 + state + column2 + operator + date + table + other + type; //MN 18 violations 343 
var url11 = baseURL + table2 + column5 + operator3 + state + column2 + operator + date + column3 + yes + table + other + type; //MN 18 violations health 80


console.log(url11);

// Grab the data with d3
d3.json(url11, function(response) {
  console.log(response[0]);
  console.log(response[0].WATER_SYSTEM);
  console.log(response[0].WATER_SYSTEM.WATER_SYSTEM_ROW);
  console.log(response[0].WATER_SYSTEM.WATER_SYSTEM_ROW.PWSID);

  // // Create a new marker cluster group
  // var markers = L.markerClusterGroup();

  // // Loop through data
  // response.forEach(function(response) {
  //   console.log(response.features[0].properties.mag);
  // });
  // for (var i = 0; i < response.length; i++) {

  //   // Set the data location property to a variable
  //   var location = response[i].location;

  //   // Check for location property
  //   if (location) {

  //     // Add a new marker to the cluster group and bind a pop-up
  //     markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
  //       .bindPopup(response[i].descriptor));
  //   }

  // }

  // // Add our marker cluster layer to the map
  // myMap.addLayer(markers);

});
