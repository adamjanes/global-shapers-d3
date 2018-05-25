Choropleth = function(_parentElement, _map, _data) {
    this.parentElement = _parentElement;
    this.map = _map;
    this.data = _data;

    this.initVis();
};

Choropleth.prototype.initVis = function() {
    var vis = this;

    vis.width = 1920;
    vis.height = 1080;

    vis.color_domain = ["0.05", "0.1", "0.2", "0.25", "0.3", "0.5", "0.65", "0.8"];
    vis.legend_labels = ["< 5% ", "10-20%", "20-25%", "25-30%", "30-50%", "50-65%", "65-80%", "> 80%"];

    vis.colorScale = d3.scaleThreshold()
        .range(['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'])
        .domain(vis.color_domain);

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

    vis.g = vis.svg.append("g")
        .attr("id", "mapID2")
        .style("stroke-width", "1.5px");

    vis.g.append("rect")
        .attr("class", "background")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .on("click", vis.reset);

    // Draw Map
    vis.projection = d3.geoMiller()
        .translate([vis.width / 2, vis.height / 2])
        .scale(200)
        .center([-70, 25]);

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

    // Needed to set class for visible countries
    vis.country_nested_data = d3.nest()
        .key(function(d) { return d["EmbeddedData-Country"]})
        .entries(allData);

    vis.country_object = {};

    vis.country_nested_data.forEach(function(d){
        vis.country_object[d.key] = d.values;
    });

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
        .attr("id", "overlay")
        .attr("class", "overlay")
        .attr("height", vis.height)
        .attr("width", vis.width * 0.25)
        .attr("opacity", 1);

    // Add Regions Layer
    vis.region = vis.g.selectAll(".region").data(vis.regions).enter().append("path")
        .attr("class", "region piece")
        .attr("d", vis.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .on("click", clicked);

    $("#participants")[0].innerHTML = allData.length;

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

        // Number of participants in this area
        var parts = allData.reduce(function(a, b){
            if (b[vis.view].toUpperCase() == vis.clicker.toUpperCase()) { return a + 1; }
            else { return a; }
        }, 0);
         
        // Region becomes active
        if (active[0] === vis.selection[0]) return vis.reset();

        var view = $(".view:selected")[0].id;
        $(".activey").attr("class", "piece " + view);
        active = vis.selection.attr("class", "piece " + view + " activey");

        $("#choose-regions").val(vis.clicker);

        var active_label = $("#active");

        // Rename title to new region name
        active_label[0].innerHTML = vis.clicker;
        
        $("#participants")[0].innerHTML = parts;
    }

    vis.svg
        .append("g").attr("id", "mapID")
        .attr("height", "80%")
        .attr("transform", "translate(0,  100)");

    // Update on zoom/drag
    function zoomed() {
        vis.g.attr("transform", d3.event.transform);
    }

    // Legend
    vis.legend = vis.svg.selectAll("g.map-legend")
        .data(vis.color_domain)
        .enter().append("g")
        .attr("class", "map-legend")
        .attr("transform", "translate(500, -230)");

    var ls_w = 20, ls_h = 20;

    vis.legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return vis.height - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return vis.colorScale(d); })
        .style("opacity", 0.8);

    vis.legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return vis.height - (i*ls_h) - ls_h - 4;})
        .text(function(d, i){ return vis.legend_labels[i]; });


    vis.wrangleData();
};

Choropleth.prototype.wrangleData = function() {
    var vis = this;

};

Choropleth.prototype.updateVis = function() {
    var vis = this;

    if ($("#display")[0].innerHTML == "Map") {

        var answer = $("#select-answer");
        var qid = answer.find('option:selected').attr('id');
        
        // Get total respondents for selected question

        var view = $("#view_code")[0].innerHTML;

        switch(view) {
            case "EmbeddedData-Region":
                colorIn(vis.region, "EmbeddedData-Region");
                break;
            case "EmbeddedData-Region_Sub_WEF":
                colorIn(vis.subregion, "EmbeddedData-Region_Sub_WEF");
                break;
            case "EmbeddedData-Country":
                colorInCountry(vis.country, "EmbeddedData-Country");
                break;
            case "EmbeddedData-Income_WorldBank":
                colorIn(vis.income, "EmbeddedData-Income_WorldBank");
                break;
            case "EmbeddedData-UNDP_LEVEL":
                colorIn(vis.development, "EmbeddedData-UNDP_LEVEL");
                break;
            default:
                colorIn(vis.region, "EmbeddedData-Region")
        }

        function colorIn(part, view) {
            part
                .attr("selection", answer.val())
                .attr("fill", function (d) {
                    var name = d.name;

                    var total = 0;
                    var matched = 0;

                    var val = answer.val();
                    if (qid == "QID107-1" || qid == "QID172-1") {
                        val = reversePerceptionScale[answer.val()];
                    }

                    allData.forEach(function (response) {
                        if (response[view].toUpperCase() == name.toUpperCase()) {
                            total += 1;

                            if (response[qid] == val) {
                                matched += 1;
                            }
                        }
                    });

                    if (total == 0) {
                        $(this).attr({
                            "stroke": "#c6dbef",
                            "pointer-events": "none"
                        });
                        return "none";
                    }

                    if ((answer.val() == "Share of Total Participants") || val == undefined) {
                        $(this).attr("stat", ((total / allData.length) * 100).toFixed(1) + "%");
                        return vis.colorScale(total / allData.length)
                    }
                    else {
                        $(this).attr("stat", ((matched / total) * 100).toFixed(1) + "%");
                        return vis.colorScale(matched / total);
                    }
                });
        }
    }

    function colorInCountry(part, view) {
        part
            .attr("selection", answer.val())
            .attr("fill", function (d) {
                var name = d.properties["NAME"];

                var total = 0;
                var matched = 0;
                if (d.properties == undefined) {
                    return "none";
                }

                var val = answer.val();
                if (qid == "QID107-1" || qid == "QID172-1") {
                    val = reversePerceptionScale[answer.val()];
                }

                if (vis.country_object[name] == undefined){
                    $(this).attr({
                        "stroke": "#c6dbef",
                        "pointer-events": "none"
                    });
                    return "none";
                }

                vis.country_object[name].forEach(function (response) {
                    if (response[view].toUpperCase() == name.toUpperCase()) {
                        total += 1;

                        if (response[qid] == val) {
                            matched += 1;
                        }
                    }
                });


                if ((answer.val() == "Share of Total Participants") || val == undefined) {
                    $(this).attr("stat", ((total / allData.length) * 100).toFixed(1) + "%");
                    return vis.colorScale(total / allData.length)
                }
                else {
                    $(this).attr("stat", ((matched / total) * 100).toFixed(1) + "%");
                    return vis.colorScale(matched / total);
                }
            });
    }

};

Choropleth.prototype.reset =  function() {
    var vis = this;
    
    $("#buttons1").fadeOut("slow");
    $("#country-btns").fadeOut("slow");

    var active_label = $("#active");
    
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

        // Should we trigger change?
        $("#choose-regions").val("Show All");

        // Title goes back to "World"
        active_label[0].innerHTML = "World";
    }
    
    else {
        $("#flag")[0].innerHTML = "NO";
    }

    updateResponses();


};

