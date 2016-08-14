// Global Variables
var worldMap,
    allData,
    active = $(null);

var start;


// Tooltip
var tooltip = {
    element: null,
    init: function() {
        this.element = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    },
    show: function(t) {
        this.element.html(t).transition().duration(200).ease(d3.easeLinear).style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", .9);
    },
    move: function() {
        this.element.transition()
            .duration(30)
            //.ease("linear")
            .style("left", d3.event.pageX + 20 + "px")
            .style("top", d3.event.pageY - 20 + "px")
            .style("opacity", .9);
    },
    hide: function() {
        this.element.transition().duration(500).style("opacity", 0)
    }
};

// Spinner
var opts = {
    lines: 8 // The number of lines to draw
    , length: 27 // The length of each line
    , width: 17 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 62 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 2 // Rounds per second
    , trail: 33 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
}


// Start application by loading the data
loadData();

function loadData() {

    // Use the Queue.js library to read data files
    start = Date.now();

    var target = document.getElementById('screen');

    // trigger loader
    var spinner = new Spinner(opts).spin(target);

        queue()
            .defer(d3.json, "data/data.json")
            .defer(d3.csv, "data/test.csv")
            .defer(d3.csv, "data/headers.csv")
            .defer(d3.csv, "data/division.csv")
            .await(function (error, map, data, headers, division) {
                if (error) return console.warn(error);

                console.log(headers);
                
                createVis(map, data, headers, division);
                // stop the loader
                setTimeout(function(){spinner.stop();
                $("#content").fadeIn("slow")}, 1000);
            });
}


// Create the Visualization
function createVis(map, data, headers, division) {
    tooltip.init();
    allData = data;
    
    // Initialize Map
    worldMap = new Choropleth("chart-area", map, data, headers, division);

    // Add Javascript for Display Pills
    changeRegions();
    
    // Add Javascript for View Tabs
    changeView();

    changeChoose();

    // Add Donut Chart
    addGenderDonut(data);

    // Add Regions/Subregions/Countries Chart
    //addPiecesChart(data);
    
    // Add Age Range Chart
    addAgesChart(data);

    // Add Word Cloud
    //createWordcloud(["QID137-3", "QID137-6", "QID137-5", "QID137-8", "QID137-10", "QID137-11"], data, "body");

    // Add tooltip listeners
    addTooltips(data);

}

