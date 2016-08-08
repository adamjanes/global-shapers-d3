
Choropleth = function(_parentElement, _map, _data, _headers, _division) {
    this.parentElement = _parentElement;
    this.map = _map;
    this.data = _data;
    this.headers = _headers;

    this.initVis();
};

Choropleth.prototype.initVis = function() {
    var vis = this;

    vis.width = 1366;
    vis.height = 500;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        .attr("id", "mapID")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + vis.width + " " + vis.height)
        //class to make it responsive
        .classed("svg-content-responsive", true);

    // Background plane
    vis.svg.append("rect")
        .attr("class", "background")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .on("click", vis.reset);

    vis.g = vis.svg.append("g")
        .style("stroke-width", "1.5px");


    // Draw Map
    vis.projection = d3.geoMiller()
        .translate([vis.width / 2, vis.height / 2])
        .scale(160)
        .center([-30, 25]);

    vis.zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[-100, -100], [vis.width, vis.height]])
        .on("zoom", zoomed);

    vis.path = d3.geoPath()
        .projection(vis.projection);

    vis.svg
        .call(vis.zoom);

    // Get Countries
    vis.countries = topojson.feature(vis.map, vis.map.objects["TM_WORLD_BORDERS-0"]);
    vis.country = vis.g.selectAll(".country").data(vis.countries.features);

    // Get Regions
    vis.regions = getRegions(vis.countries);
    vis.region = vis.g.selectAll(".region").data(vis.regions);

    // Get Sub-Regions
    vis.subregions = getSubregions(vis.countries);
    vis.subregion = vis.g.selectAll(".subregion").data(vis.subregions);

    // Set Initial Country Label as World
    $("#active")[0].innerHTML = "World";

    // Add Countries Layer
    vis.country.enter().append("path")
        .attr("class", function(d){ return (d.properties["FIPS"] + " country piece"); })
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.properties["FIPS"]; })
        .attr("title", function(d,i) { return d.properties["NAME"]; })
        .attr("region", function(d) { return d.properties["REGION"]})
        .style("fill", function(d){ if (d.properties["NAME"] != "Antarctica"){ return "grey"; } else { return "white";}})
        .on("click", clicked);
    $(".country").toggle();

    // Add Subregions Layer
    vis.subregion.enter().append("path")
        .attr("class", "subregion piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("fill", "grey")
        .on("click", clicked);
    $(".subregions").toggle();

    // Add Regions Layer
    vis.region.enter().append("path")
        .attr("class", "region piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("fill", "grey")
        .on("click", clicked);
    
    $("#participants")[0].innerHTML = vis.data.length;

    vis.overlap = vis.svg.append("rect")
        .attr("class", "overlay")
        .attr("height", vis.height)
        .attr("width", 300)
        .attr("fill", "white")
        .attr("opacity", 0.7);

    function clicked(){
        // Get region title and view type (Region/Subregion/Country, etc)
        vis.clicked = this.getAttribute("title");
        vis.view = $("#view_code")[0].innerHTML;

        // Number of participants in this area
        var parts = vis.data.reduce(function(a, b){
            if (b[vis.view] == vis.clicked) { return a + 1; }
            else { return a; }
        }, 0);

        if (parts !== 0){
            // Region becomes active
            if (active.node() === this) return vis.reset();
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            // Rename title to new region name
            $("#active")[0].innerHTML = vis.clicked;

            // Set number of participants to the relevant total
            $("#participants")[0].innerHTML = parts;
        }
    }

    // Update on zoom/drag
    function zoomed() {
        vis.g.attr("transform", d3.event.transform);
    }

    vis.wrangleData();
};

Choropleth.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis()
};

Choropleth.prototype.updateVis = function() {
    var vis = this;

    // Put code here if data is going to change

};

Choropleth.prototype.reset =  function() {
    var vis = this;

    active.classed("active", false);
    active = d3.select(null);

    worldMap.g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");

    // Title goes back to "World"
    $("#active")[0].innerHTML = "World";
    // Participants count full range of responses again
    $("#participants")[0].innerHTML = worldMap.data.length;
}

