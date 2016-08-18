// Global Variables
var worldMap,
    totalChart,
    groupChart,
    allData,
    allQuestions,
    qidCodes = [],
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

var perceptionScale = {
    "1" : "Strongly Disagree",
    "2" : "Disagree",
    "3" : "Neutral",
    "4" : "Agree",
    "5" : "Strongly Agree"
};

var reversePerceptionScale = {
    "Strongly Disagree": "1",
    "Disagree": "2",
    "Neutral": "3",
    "Agree": "4",
    "Strongly Agree": "5"
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
};


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
            .defer(d3.csv, "data/full-data.csv")
            .defer(d3.csv, "data/headers.csv")
            .defer(d3.csv, "data/questions.csv")
            .await(function (error, map, data, headers, questions) {
                if (error) return console.warn(error);
                
                createVis(map, data, headers, questions);
                // stop the loader
                setTimeout(function(){spinner.stop();
                $("#content").fadeIn("slow")}, 1000);
            });
}


// Create the Visualization
function createVis(map, data, headers, questions) {
    tooltip.init();
    
    //allData = createAllData(data, questions);
    allData = data;
    
    allQuestions = questions;

    // Set qidCodes to contain an array of all matching QIDs
    allQuestions.forEach(function(d){
        var keys = Object.keys(allData[0]);
        qidCodes[d["qid"]] = keys.filter(function(a){
            if (a.indexOf("TEXT") === -1){
                return (a.indexOf(d["qid"]) !== -1);
            }
        });
    });
    
    // Initialize Map
    worldMap = new Choropleth("chart-area", map, data, headers);

    // Initialize Totals Chart
    totalChart = new BarChart("#mapID");

    // Initialize Totals Chart
    groupChart = new GroupedBarChart("#mapID");

    //$("#select-region").trigger("change");
    
    // Add Javascript for View Tabs
    changeView();

    // Initialize answers
    changeAnswers();

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

/*function createAllData(data) {
    
}*/