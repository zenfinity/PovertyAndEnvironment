/*Noise js for Poverty and Environment webapp

by Ian Mac Moore

See urlNoise link for source data.

Old ARCGIS source moved/deprecated
https://maps.bts.dot.gov/services/rest/services/Noise/CONUS_ROAD_AND_AVIATION_NOISE_IS_Apr_2018/ImageServer

New
https://geo.dot.gov/server/rest/services/Hosted/Noise_48_States_all_modes_2020/MapServer


8/17/23 No error but nothing loads. Fantastic. Maybe use MapServer method to test later. Reference links:
https://developers.arcgis.com/esri-leaflet/api-reference/layers/dynamic-map-layer/
https://geo.dot.gov/server/rest/services/Hosted/Noise_48_States_all_modes_2020/MapServer?f=jsapi
https://geo.dot.gov/server/sdk/rest/index.html#/Feature_Map_Service_Layer/02ss00000034000000/
https://www.bts.gov/geospatial/national-transportation-noise-map
https://data.bts.gov/stories/s/National-Transportation-Noise-Map/ri89-bhxh
*/

var urlNoise = 'https://geo.dot.gov/server/rest/services/Hosted/Noise_48_States_all_modes_2020/MapServer/';

// var renderRule = {
//     rasterFunction : "Colormap", 
//     rasterFunctionArguments : {
//         ColorrampName : "Blue Bright"
//     },
//     variableName : "Raster"
// };

// var noiseLayer = L.esri.imageMapLayer({
// var noiseLayer = L.esri.TiledMapLayer({
var noiseLayer = L.esri.dynamicMapLayer({
    url: urlNoise,
    opacity: 0.75,
    // style: {
    //   opacity: 0.75,
    //   fillColor: "purple"
    // },
    // "mosaicRule" : {
    //   "mosaicMethod" : "esriMosaicNone",
    //   //"lockRasterIds": [0],
    //   "itemRenderingRule" : {
    //     "rasterFunction" : "Colormap", 
    //     "rasterFunctionArguments" : {
    //       "ColorrampName" : "Blue Bright"
    //     }
    //   }
    // },
    // renderingRule : {
    //     rasterFunction : "Colormap", 
    //     rasterFunctionArguments : {
    //       ColorrampName : "Blue Bright"
    //     },
    //     variableName : "Raster"
    //   },
    // only necessary for old versions of ArcGIS Server
    //f : 'jsapi',
    //format : 'png',
    //renderingRule : renderRule,
    // useCors: false
    crossOrigin: "anonymous"
    //getBandIds().setRenderingRule(renderRule).
});
console.log("heyo")
console.log(noiseLayer);



//Use Google palette to get range of rgb colors
var colorRange = palette('sol-base',8);
//console.log(colorRange);

function createNoiseLegend(map) {
    /*Legend specific*/
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info-legend");
        div.innerHTML += "<h4>24 hr Equivalent</h4>";
        div.innerHTML += "<h4>Avg Transportation Noise</h4>";
        div.innerHTML += `<i style="background: #${colorRange[0]}"></i><span>30dB (quiet conversation)</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[4]}"></i><span>80dB (phone ring)</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[7]}"></i><span>120dB (ambulance siren)</span><br>`;
        div.innerHTML += "<i><a href='https://en.wikipedia.org/wiki/Health_effects_from_noise'>More...</a></i>"
        
        return div;
    };

    legend.addTo(map);
}
