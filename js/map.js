
Choropleth = function(_parentElement, _map, _data, _headers, _division) {
    this.parentElement = _parentElement;
    this.map = _map;
    this.data = _data;
    this.headers = _headers;
    this.division = _division;

    this.initVis();
};

Choropleth.prototype.initVis = function() {
    var vis = this;

    vis.width = 1366;
    vis.height = 700;


    vis.svg = d3.select("#" + vis.parentElement)
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
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
        .on("click", reset);
        vis.g = vis.svg.append("g")
        .style("stroke-width", "1.5px");

    // Draw Map
    vis.projection = d3.geoMiller()
        .translate([vis.width / 2, vis.height / 2])
        .scale(200)
        .center([0, 25]);
    vis.path = d3.geoPath()
        .projection(vis.projection);

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

};
    
