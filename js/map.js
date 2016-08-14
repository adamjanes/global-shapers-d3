
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
    vis.height = 667;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        .attr("id", "mapID1")
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

    $("#select-region")
        .on("change", vis.reset);

    vis.g = vis.svg.append("g")
        .attr("id", "mapID2")
        .style("stroke-width", "1.5px");


    // Draw Map
    vis.projection = d3.geoMiller()
        .translate([vis.width / 2, vis.height / 2])
        .scale(150)
        .center([-60, 40]);

    vis.zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[-200, -200], [vis.width + 200, vis.height + 200]])
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

    // Get Human Development Levels
    vis.developments = getDevRegions(vis.countries);
    vis.development = vis.g.selectAll(".development").data(vis.developments);

    // Get Human Development Levels
    vis.incomes = getIncomeRegions(vis.countries);
    vis.income = vis.g.selectAll(".income").data(vis.incomes);

    // Set Initial Country Label as World
    $("#active")[0].innerHTML = "World";

    // Needed to set class for visible countries
    var country_nested_data = d3.nest()
        .key(function(d) { return d["EmbeddedData-Country"]})
        .entries(vis.data);

    // Add Countries Layer
    vis.country.enter().append("path")
        .attr("class", function(d){
            var flag = "noshow";
            country_nested_data.forEach(function(cont){
                if (cont.key == d.properties["NAME"]){
                    flag = "yesshow";
                }
            });
            return (flag + " country piece");
        })
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.properties["FIPS"]; })
        .attr("title", function(d,i) { return d.properties["NAME"]; })
        .attr("region", function(d) { return d.properties["REGION"]})
        .on("click", clicked);
    $(".country").toggle();

    // Add Subregions Layer
    vis.subregion.enter().append("path")
        .attr("class", "subregion piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("pointer-events", function(d){ if (d.name == "N/A"){ return "none"; } })
        .style("stroke", function(d) { if (d.name == "N/A"){ return "#0082C4"; } })
        .style("stroke-opacity", "0.7")
        .style("fill", function(d){ if (d.name == "N/A"){ return "none"; } else { return "#0082C4"; } })
        .on("click", clicked);
    $(".subregion").toggle();

    // Add Development Layer
    vis.development.enter().append("path")
        .attr("class", "development piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("pointer-events", function(d){ if (d.name == "N/A"){ return "none"; } })
        .style("stroke", function(d) { if (d.name == "N/A"){ return "#0082C4"; } })
        .style("stroke-opacity", "0.7")
        .style("fill", function(d){ if (d.name == "N/A"){ return "none"; } else { return "#0082C4"; } })
        .on("click", clicked);
    $(".development").toggle();

    // Add Income Layer
    vis.income.enter().append("path")
        .attr("class", "income piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("pointer-events", function(d){ if (d.name == "N/A"){ return "none"; } })
        .style("stroke", function(d) { if (d.name == "N/A"){ return "#0082C4"; } })
        .style("stroke-opacity", "0.7")
        .style("fill", function(d){ if (d.name == "N/A"){ return "none"; } else { return "#0082C4"; } })
        .on("click", clicked);
    $(".income").toggle();

    // Overlay For Side Visualizations
    vis.overlay = vis.svg.append("rect")
        .attr("class", "overlay")
        .attr("height", vis.height)
        .attr("width", vis.width * 0.25)
        .attr("fill", "#0096FF")
        .attr("opacity", 1);

    // Add Regions Layer
    vis.region.enter().append("path")
        .attr("class", "region piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("fill", "#0082C4")
        .on("click", clicked);

    $("#participants")[0].innerHTML = vis.data.length;


    function clicked(select){
        $("#flag")[0].innerHTML = "YES";

        if (this.type == undefined){
            vis.selection = $(this);
        }
        else{
            vis.selection = select;
        }

        // Get region title and view type (Region/Subregion/Country, etc)
        vis.clicker = vis.selection.attr("title");
        vis.view = $("#view_code")[0].innerHTML;

        $("#buttons1").fadeIn("slow");

        if (vis.view == "EmbeddedData-Country"){
            $("#country-btns").fadeIn("slow");
        }

        // Number of participants in this area
        var parts = vis.data.reduce(function(a, b){
            if (b[vis.view].toUpperCase() == vis.clicker.toUpperCase()) { return a + 1; }
            else { return a; }
        }, 0);

        if (parts !== 0){
            // Region becomes active
            if (active === vis.selection) return vis.reset();

            var view = $(".view:selected")[0].id;
            $(".active").attr("class", "piece " + view);
            active = vis.selection.attr("class", "piece " + view + " active");

            console.log(active.attr("class"));

            $("#choose-regions").val(vis.clicker);

            // Rename title to new region name
            $("#active")[0].innerHTML = vis.clicker;

            if (vis.clicker.length > 20){
                $("#active").css("font-size", "1.5vw");
            }
            else if (vis.clicker.length > 17){
                $("#active").css("font-size", "1.8vw");
            }
            else if (vis.clicker.length > 15){
                $("#active").css("font-size", "2.5vw");
            }
            else {
                $("#active").css("font-size", "3vw");
            }
            
            // Set number of participants to the relevant total
            $("#participants")[0].innerHTML = parts;
        }
    }

    // Update on zoom/drag
    function zoomed() {
        vis.g.attr("transform", d3.event.transform);
    }

    vis.svg
        .append("g").attr("id", "mapID")
        .attr("height", "80%")
        .attr("transform", "translate(0,  100)");

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

    $("#buttons1").fadeOut("slow");
    $("#country-btns").fadeOut("slow");

    $("#active").css("font-size", "3vw");

    // If a piece is active
    if ($(".active.piece")[0] != undefined){
        $("#flag")[0].innerHTML = "YES";

        var view = $("#view_class")[0].innerHTML;

        active.attr("class", "piece " + view);
        console.log(active.attr("class"));

        active = $(null);

        worldMap.g.transition()
            .duration(750)
            .style("stroke-width", "1.5px")
            .attr("transform", "");

        $("#choose-regions").val("Show All");

        // Title goes back to "World"
        $("#active")[0].innerHTML = "World";
        // Participants count full range of responses again
        $("#participants")[0].innerHTML = worldMap.data.length;
    }
    
    else {
        $("#flag")[0].innerHTML = "NO";
    }
};

