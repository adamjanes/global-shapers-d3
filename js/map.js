
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

    vis.colorScale = d3.scaleThreshold()
        .range(['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'])
        .domain(["0.01", "0.05", "0.1", "0.2", "0.35", "0.5", "0.6", "0.8"]);

    vis.participationScale = d3.scaleThreshold()
        .range(['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'])
        .domain(["3", "5", "10", "20", "30", "40", "50", "60"]);

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

    // Get Area Data
    vis.countries = topojson.feature(vis.map, vis.map.objects["TM_WORLD_BORDERS-0"]);
    vis.regions = getRegions(vis.countries);
    vis.subregions = getSubregions(vis.countries);
    vis.developments = getDevRegions(vis.countries);
    vis.incomes = getIncomeRegions(vis.countries);

    // Set Initial Country Label as World
    $("#active")[0].innerHTML = "World";

    // Needed to set class for visible countries
    var country_nested_data = d3.nest()
        .key(function(d) { return d["EmbeddedData-Country"]})
        .entries(vis.data);

    // Add Countries Layer
    vis.country = vis.g.selectAll(".country")
        .data(vis.countries.features)
        .enter().append("path")
        .attr("class", "country piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.properties["FIPS"]; })
        .attr("title", function(d,i) { return d.properties["NAME"]; })
        .attr("region", function(d) { return d.properties["REGION"]})
        .on("click", clicked);
    $(".country").toggle();

    // Add Subregions Layer
    vis.subregion = vis.g.selectAll(".subregion")
        .data(vis.subregions)
        .enter().append("path")
        .attr("class", "subregion piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .on("click", clicked);
    $(".subregion").toggle();

    // Add Development Layer
    vis.development = vis.g.selectAll(".development")
        .data(vis.developments)
        .enter().append("path")
        .attr("class", "development piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .on("click", clicked);
    $(".development").toggle();

    // Add Income Layer
    vis.income = vis.g.selectAll(".income")
        .data(vis.incomes)
        .enter().append("path")
        .attr("class", "income piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
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
    vis.region = vis.g.selectAll(".region").data(vis.regions).enter().append("path")
        .attr("class", "region piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
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
            if (active[0] === vis.selection[0]) return vis.reset();

            var view = $(".view:selected")[0].id;
            $(".activey").attr("class", "piece " + view);
            active = vis.selection.attr("class", "piece " + view + " activey");

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

    vis.svg
        .append("g").attr("id", "mapID")
        .attr("height", "80%")
        .attr("transform", "translate(0,  100)");

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

    var answer = $("#select-answer");
    var qid =  answer.find('option:selected').attr('id');

    console.log(qid);

    colorIn(vis.country, "EmbeddedData-Country");
    colorIn(vis.region, "EmbeddedData-Region");
    colorIn(vis.subregion, "EmbeddedData-Region_Sub_WEF");
    colorIn(vis.income, "EmbeddedData-Income_WorldBank");
    colorIn(vis.development, "EmbeddedData-UNDP_LEVEL");


    function colorIn(part, view){
        part
            .attr("selection", answer.val())
            .attr("fill", function(d){
                var name;
                if (view == "EmbeddedData-Country"){
                    name = d.properties["NAME"];
                }
                else {
                    name = d.name;
                }

                var total = 0;
                var matched = 0;
                if ((view == "EmbeddedData-Country") && (d.properties == undefined)){
                    return "black";
                }

                var val = answer.val();
                if (qid == "QID107-1" || qid ==  "QID172-1"){
                    val = reversePerceptionScale[answer.val()];
                }

                allData.forEach(function(response){
                    if (response[view].toUpperCase() == name.toUpperCase()) {
                        total += 1;
                        //console.log(response[qid] + " " + answer.val())
                        if (response[qid] == val) {
                            matched += 1;
                        }
                    }
                });
                if (total == 0){
                    $(this).attr({
                        "stroke": "#c6dbef",
                        "pointer-events": "none"
                    });
                    return "none";
                }

                if ((answer.val() == "Share of Total Participants") || val == undefined){
                    $(this).attr("stat", ((total/allData.length)*100).toFixed(1) + "%" );
                    return vis.colorScale(total/allData.length)
                }
                else{
                    $(this).attr("stat", ((matched/total)*100).toFixed(1) + "%" );
                    return vis.colorScale(matched/total);
                }
            });
    }



    // Put code here if data is going to change

};

Choropleth.prototype.reset =  function() {
    var vis = this;

    $("#buttons1").fadeOut("slow");
    $("#country-btns").fadeOut("slow");

    $("#active").css("font-size", "3vw");

    // If a piece is active
    if ($(".activey.piece")[0] != undefined){
        $("#flag")[0].innerHTML = "YES";

        var view = $("#view_class")[0].innerHTML;

        active.attr("class", "piece " + view);

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

