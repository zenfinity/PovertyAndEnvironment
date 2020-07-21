// // Creating map object
// var map = L.map("map", {
//   center: [46.7, -94.7],
//   zoom: 7
// });

// // Adding tile layer to the map
// base_layer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// })

// base_layer.addTo(map);

// initalize
var waterLayer = L.markerClusterGroup();
// let contams = new Set();

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
let date = "-18/"; // "01-JAN-18/";
let activity = "pws_activity_code/";
let code = "A/";
let other = "rows/1:19/"
let type = "JSON"
let count = "count"

// Assemble API query URL
var url11 = baseURL + table2 + column5 + operator3 + state + column2 + operator + date + column3 + yes + table + type; //MN 18 violations health 80

console.log(url11);

// Get water violation data, geocode to find lat long, create markers
d3.json(url11, function (response) {
  // console.log(response[0]);

  response.forEach(function (f) {
  
    let address1 = f.WATER_SYSTEM.WATER_SYSTEM_ROW.ADDRESS_LINE1;
    let address2 = f.WATER_SYSTEM.WATER_SYSTEM_ROW.ADDRESS_LINE2;
    let city = f.WATER_SYSTEM.WATER_SYSTEM_ROW.CITY_NAME;
    let state = f.WATER_SYSTEM.WATER_SYSTEM_ROW.STATE_CODE;
    let vCode = f.VIOLATION_CATEGORY_CODE;
    let contamCode = f.CONTAMINANT_CODE;
    let locationName = `${address1}, ${address2}, ${city}, ${state}`;
    // contams.add(contamCode);
 
    //geocode to find lat long
    sendGeocodingRequest(locationName)
      .then(function (data) {
        // console.log(data)
        //and if it is successful create marker
        //translate codes
        decoder(vCode);
        decoder2(contamCode);
        createMarker(data, city, violation, contaminant)
      })

  });

  //map.addLayer(waterLayer);

});

function sendGeocodingRequest(location) {

  var headers = {
    "X-Application-Id": APPLICATION_ID,
    "X-Api-Key": GC_API_KEY,
    // "Content-Type": "application/json",
    "Accept-Language": "en-US"
  };
  return fetch(`https://api.traveltimeapp.com/v4/geocoding/search?query=` + location, {
    method: "GET",
    credentials: "same-origin",
    "headers": headers
  })
    .then(response => response.json()); // parses JSON response into native Javascript objects
};

function decoder(vCode) {
 if (vCode === 'MCL'){ violation = "Maximum Contaminant Level"}
 else if (vCode === 'MRDL'){ violation = "Maximum Residual Disinfectant Level"}
 else if(vCode === 'TT'){ violation = "Treatment Technique"}
 else if (vCode === 'M/R'){ violation = "Monitoring and Reporting Violations"}
 
 else violation = vCode
 
};

function decoder2(contamCode) {
  if (contamCode == 4000){contaminant = "Gross Alpha"}
  else if (contamCode == 1040){contaminant = "Nitrate"}
  else if(contamCode == 4010){contaminant = "Radium Isotopes"}
  else if (contamCode == 1005){contaminant = "Arsenic"}
  // else if(contamCode == 0300){contaminant = "Unknown"}
  else if (contamCode == 8000){contaminant = "Coliform Bacteria"}
  else if (contamCode == 2982){contaminant = "Carbon Tertachloride"}
  // else if (contamCode == 0200){contaminant = "Unknown"}
  
  else contaminant = `${contamCode} Code`

 };

function createMarker(response, city, violation, contaminant) {  // We need to extract the coordinates from the response.

  var coordinates = response.features[0].geometry.coordinates;  // The coordintaes are in a [<lng>, <lat>] format/
  var latLng = L.latLng([coordinates[1], coordinates[0]]);
  waterLayer.addLayer(L.marker(latLng).bindPopup("<h2> Drinking Water Violation" + "</h2><hr> <strong>" + violation + ": </strong>" + contaminant + "<hr>" + city + " , MN"));
};

function createWaterLegend(map) {
  let legendWater = L.control({position: "topleft"});

  legendWater.onAdd = function () {
    let div = L.DomUtil.create("div", "air-legend");

    div.innerHTML += "<h4>  Water Contaminants      </h4>";
    div.innerHTML += "<i><a href='https://www.epa.gov/sites/production/files/2016-06/documents/npwdr_complete_table.pdf'>More...</a></i>";

    return div;
  };

  legendWater.addTo(map);
};