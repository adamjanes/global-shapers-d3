// Global Variables
var worldMap;


// Start application by loading the data
loadData();

function loadData() {
    // Use the Queue.js library to read data files
    queue()
        .defer(d3.json, "data/world-110m.json")
        .await(function(error, map){
            if (error) return console.warn(error);

            createVis(map);
        });
}


// Create the Visualization
function createVis(map) {
    worldMap = new Choropleth("chart-area", map)
}