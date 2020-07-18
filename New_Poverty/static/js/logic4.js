// // Creating map object
//Tilemap handled by main
// let myMap = L.map("map", {
//   center: [46.7, -94.7],
//   zoom: 6
// });

// // Adding tile layer
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/light-v10",
//   accessToken: API_KEY
// }).addTo(myMap);

// Use this ctyLink to get the geojson data.
let ctyLink = "New_Poverty/static/data/US_counties.json";
let pLink = "https://api.census.gov/data/2018/acs/acs1/profile?get=NAME,DP03_0128PE&for=county:*&in=state:27"

let povArray = [];

d3.json(pLink, function (pData) {

  pData.forEach(function (county) {

    let countyStr = county[0].split(" County,");
    let countyName = countyStr[0];
    let povRate = county[1];
    povArray.push({
      "countyName": countyName,
      "povRate": povRate
    });
  });
  povArray.shift();
  // console.log(povArray);
});

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(name) {
    let fColor = "lightgray";
    let cName = name.properties.NAME;

    let povData = povArray.filter(data => data.countyName == cName);
    let rate = povData.map(aData => aData.povRate);
    console.log(rate);

    if (rate > 10.0) {
      fColor = "crimson";
      console.log(fColor);
    } else if (rate > 7.0) {
      fColor = "tomato";
      console.log(fColor);
    } else if (rate > 4.0) {
      fColor = "lightsalmon";
      console.log(fColor);
    } else if (rate > 1.0) {
      fColor = "gold";
      console.log(fColor);
    }
    // console.log(fColor);
    return fColor;
};

function povertyRating(ctyName) {
  let rate = 'Unavailable';
  povArray.forEach(function (data) {
    if (data.countyName == ctyName) {
      rate = `${data.povRate}%`;
      console.log("found", rate);
      return rate;
    }
  });

  return rate;
};

function runPovertyData(myMap) {
  d3.json(ctyLink, function (data) {

    let Features = data.features;
    let Minnesota = Features.filter(feat => feat.properties.STATE == "27");

    // Creating a geoJSON layer with the retrieved data
    var povLayer = L.geoJson(Minnesota, {
      // Style each feature (in this case a neighborhood)
      style: function (feature) {
        return {
          color: chooseColor(feature),
          // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
          fillColor: chooseColor(feature),
          fillOpacity: 0.3,
          weight: 1
        };
      },

      // Called on each feature
      onEachFeature: function (feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function (event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.7
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function (event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.3
            });
          },
          // // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          // click: function (event) {
          //   myMap.fitBounds(event.target.getBounds());
          // }
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<h1>" + feature.properties.NAME + " County</h1><hr>" +
          "Percent Below Poverty Level: " + povertyRating(feature.properties.NAME));
        //console.log(povertyRating(feature.properties.NAME));
      }
    }).addTo(myMap);
  });
}//end runPovertyData()

// Set up the legend
let legendPoverty = L.control({ position: "bottomright" });
legendPoverty.onAdd = function () {
  let div = L.DomUtil.create("div", "info-legend");
  let colors = ["#D3D3D3", "#FFD700", "#FFA07A", "#FF6347", "#DC143C"];
  let labels = ["N/A", "1-4", "4-7", "7-10", "10+"];

  let legendInfo = "<h3>Percent</h3><h3>Below</h3><h3>Poverty</h3>";

  div.innerHTML = legendInfo;

  for (let i = 0; i < colors.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i><span>" + labels[i] + "</span><br>";
  }

  let povertyInfo = "<a href='https://www.census.gov/topics/income-poverty/poverty/guidance/poverty-measures.html'>More Info...</a>";

  div.innerHTML += povertyInfo;
   
  return div;
};

// Adding legend to the map handled in main
//legend.addTo(myMap);
