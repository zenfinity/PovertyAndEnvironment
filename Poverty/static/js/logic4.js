// Creating map object
let myMap = L.map("map", {
  center: [46.7, -94.7],
  zoom: 6
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
let link = "static/data/US_counties.json";
let pLink = "https://api.census.gov/data/2018/acs/acs1/profile?get=NAME,DP03_0128PE&for=county:*&in=state:27"

let povArray = [];

d3.json(pLink, function(pData) {
  pData.forEach(function(county){
    let countyName = "";
    let countyStr = county[0].split(" ");
    if(countyStr[0] == "St.") {
      countyName = countyStr[0] + " " + countyStr[1];
    }
    else {
      countyName = countyStr[0];
    }
    let povRate = county[1];
    povArray.push({
      "countyName": countyName,
      "povRate": povRate
    });
  });
  povArray.shift();
  // console.log(povArray);
});

// function getRating(name) {
//   let cName = name.properties.NAME;
//   povArray.forEach(function(data){
//     if (data.countyName == cName) {
//       let rating = data.povRate;
//         console.log(rating);
//       chooseColor(rating);
//     }
//     else {
//       let rating = 0;
//       chooseColor(rating);
//     }
//   });
// };

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(name) {
  let cName = name.properties.NAME;
  let fColor = "lightgrey";
  // console.log(cName);
  povArray.forEach(function(data){
    // console.log(data.countyName);
    // console.log(cName);
    // console.log(data.povRate);
    if (data.countyName == cName && +data.povRate > 10.0) {
      // console.log(data.povRate);
      fColor = "crimson";
    }
    else if (data.countyName == cName && +data.povRate > 7.0) {
      fColor = "tomato";
    }
    else if (data.countyName == cName && +data.povRate > 4.0) {
      fColor = "lightsalmon";
    } 
    else if (data.countyName == cName && +data.povRate > 1.0) {
      fColor = "gold";
    }        
  }); 
  // console.log(fColor);
  return fColor;
};

function povertyRating(name) {
  let rate = "";
  // console.log(cName);
  povArray.forEach(function(data){
    // console.log(data.countyName);
    // console.log(cName);
    // console.log(data.povRate);
    if (data.countyName == name) {
      rate = data.povRate + "%";
    }
    else {
      rate = "Unavailable";
    }
  }); 
  console.log(rate);
  return rate;
};

d3.json(link, function(data) {

  let Features = data.features;
  let Minnesota = Features.filter(feat => feat.properties.STATE == "27");

  // Creating a geoJSON layer with the retrieved data
  L.geoJson(Minnesota, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      // console.log(feature.properties);
      // console.log(pData);
      return {
        color: chooseColor(feature),
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature),
        fillOpacity: 0.5,
        weight: 1
      };
    },
  
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.NAME + " County</h1><hr>" +
      "Percent Below Poverty Level: " + povertyRating(feature.properties.NAME));
      // <hr> <h2>" + feature.properties.County + "County</h2>");
    }
  }).addTo(myMap);
  
      // Set up the legend
      let legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info-legend");
        let colors = ["#F0E68C","#FFD700","#FFA07A","#FF6347","#DC143C"];
        let labels = ["0","1-4","4-7","7-10","10+"];
  
        for (let i = 0; i < colors.length; i++) {
          div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i><span>" + labels[i] + "</span><br>";
        }
        return div;
      };
    
      // Adding legend to the map
      legend.addTo(myMap);
});