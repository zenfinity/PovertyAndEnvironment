var urlNoise = 'https://maps.bts.dot.gov/services/rest/services/Noise/CONUS_ROAD_AND_AVIATION_NOISE_IS_Apr_2018/ImageServer';

// var renderRule = {
//     rasterFunction : "Colormap", 
//     rasterFunctionArguments : {
//         ColorrampName : "Blue Bright"
//     },
//     variableName : "Raster"
// };

var noiseLayer = L.esri.imageMapLayer({
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
    useCors: false
    //getBandIds().setRenderingRule(renderRule).
});

console.log(noiseLayer);
