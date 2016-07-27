queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.csv, "data/test.csv")
    .await(createVisualization);


// Load shapes of countries (TopoJSON)
function createVisualization(error, map, data) {
    var width = 1366,
        height = 600,
        active = d3.select(null);

    console.log(data);

    var svg = d3.select("#chart-area")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "+width+" "+height)
        //class to make it responsive
        .classed("svg-content-responsive", true);

    // Background plane
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g")
        .style("stroke-width", "1.5px");
    // Background plane

    var projection = d3.geoMiller()
        .translate([width / 2, height / 2])
        .scale(180)
        .center([0, 25]);

    var path = d3.geoPath()
        .projection(projection);

    // Convert TopoJSON to GeoJSON (target object = 'countries')
    var countries = topojson.feature(map, map.objects.countries);
    var country = g.selectAll(".country").data(countries.features);

    // Get continents
    var asia = {type: "FeatureCollection", name: "Asia", color: "#ffbb78", id:1, features: countries.features.filter(function(d) { return d.properties.continent=="Asia"; })};
    var africa = {type: "FeatureCollection", name: "Africa", color: "#2ca02c", id:2, features: countries.features.filter(function(d) { return d.properties.continent=="Africa"; })};
    var europe = {type: "FeatureCollection", name: "Europe", color: "#ff7f0e", id:3, features: countries.features.filter(function(d) { return d.properties.continent=="Europe"; })};
    var na = {type: "FeatureCollection", name: "North America", color: "#1f77b4", id:4, features: countries.features.filter(function(d) { return d.properties.continent=="North America"; })};
    var sa = {type: "FeatureCollection", name: "South America", color: "#d62728", id:5, features: countries.features.filter(function(d) { return d.properties.continent=="South America"; })};
    var oceania = {type: "FeatureCollection", name: "Oceania", color: "#aec7e8", id:7, features: countries.features.filter(function(d) { return d.properties.continent=="Oceania"; })};

    var continents = [asia,africa,europe,na,sa,oceania];
    var continent = g.selectAll(".continent").data(continents);

    // Add countries layer
    toCountry();
    // Add continents layer
    toContinent();

    function clicked(d) {
        // if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        $(".piece").toggle();

        //$(".country:not(#"+active._groups[0][0].id+")").toggle();

        var cont = active._groups[0][0].id;

        var cont_name = active._groups[0][0].__data__.name;

        if (active.node().title == cont_name){

        }

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
        // 0.9 - takes up 90% of screen
            scale = .9 / Math.max(dx / width, dy / height);

        switch(cont) {
            case "3":
                scale = 1.5;
                x = 900;
                y = 150;
                break;
            case "7":
                scale = 3;
                x = 1150;
                y = 465;
                break;
            default:
        }

        var translate = [width / 2 - scale * x, height / 2 - scale * y];

        g.transition()
            .duration(750)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    function reset() {
        if (active != null) {
            $(".piece").toggle();

            g.transition()
                .duration(750)
                .style("stroke-width", "1.5px")
                .attr("transform", "");

            active.classed("active", false);
            active = d3.select(null);
        }
    }

    function toContinent() {
        $(".country").toggle();
        continent.enter().append("path")
            .attr("class", "continent piece")
            .attr("d", path)
            .attr("id", function(d,i) { return d.id; })
            .attr("title", function(d,i) { return d.name; })
            .style("fill", "grey")
            .on("click", clicked);
    }

    function toCountry() {
        $(".continent").toggle();
        country.enter().append("path")
            .attr("class", function(d){
                return (d.properties["continent"] + " country piece");
            })
            .attr("d", path)
            .attr("id", function(d,i) { return d.id; })
            .attr("title", function(d,i) { return d.name; })
            .style("fill", "grey")
            .on("click", clicked2);
    }

    function clicked2() {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        //$(".country:not(#"+active._groups[0][0].id+")").toggle();

        var cont = active._groups[0][0].id;

        // Select the right country object
        var numb = $(this).attr("id");
        var clickedCountry = $.grep(countries.features, function(e) { return e.id == numb })[0];

        var bounds = path.bounds(clickedCountry),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
        // 0.9 - takes up 90% of screen
            scale = .9 / Math.max(dx / width, dy / height);

        console.log(clickedCountry)

        var translate = [width / 2 - scale * x, height / 2 - scale * y];

        g.transition()
            .duration(750)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

}