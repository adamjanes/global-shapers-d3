function reset() {
    if (active._groups[0][0] != null) {
        //$(".piece").toggle();

        $("#active")[0].innerHTML = "World";
        $("#participants")[0].innerHTML = worldMap.data.length;

        worldMap.g.transition()
            .duration(750)
            .style("stroke-width", "1.5px")
            .attr("transform", "");

        active.classed("active", false);
        active = d3.select(null);
    }
}

function regionClicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    //$(".piece").toggle();

    var cont = active._groups[0][0].id;

    var regionData = active._groups[0][0].__data__;

    $("#active")[0].innerHTML = regionData.name;

    var responders = worldMap.data.reduce(function(a, b){
        if (b["EmbeddedData-Region_Cont"] == regionData.name) {
            return a + 1;
        }
        else {
            return a;
        }
    }, 0);

    $("#participants")[0].innerHTML = responders;
    
    var bounds = worldMap.path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
    // 0.9 - takes up 90% of screen
        scale = .9 / Math.max(dx / worldMap.width, dy / worldMap.height);

    switch(cont) {
        // Eastern Europe
        case "150":
            scale = 1.8;
            x = 840;
            y = 150;
            break;
        // Oceania
        case "9":
            scale = 3;
            x = 1050;
            y = 450;
            break;
        // Americas
        case "19":
            scale = 1;
            x = 250;
            y = 300;
            break;
        default:
    }

    var translate = [worldMap.width / 2 - scale * x, worldMap.height / 2 - scale * y];

    worldMap.g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function subregionClicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var subreg = active._groups[0][0].id;

    var subRegionData = active._groups[0][0].__data__;

    $("#active")[0].innerHTML = subRegionData.name;

    //var highlight = $("[region="+cont+"]").attr("class", "active");

    var responders = worldMap.data.reduce(function(a, b){
        if (b["EmbeddedData-Region_Sub"] == subRegionData.name) {
            return a + 1;
        }
        else {
            return a;
        }
    }, 0);

    $("#participants")[0].innerHTML = responders;

    var bounds = worldMap.path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
    // 0.9 - takes up 90% of screen
        scale = .9 / Math.max(dx / worldMap.width, dy / worldMap.height);

    switch(subreg) {
        // Eastern Europe
        case "151":
            scale = 2;
            x = 950;
            y = 140;
            break;
        // Australia and NZ
        case "53":
            scale = 3.5;
            x = 1000;
            y = 475;
            break;
        // North America
        case "21":
            scale = 1.8;
            x = 300;
            y = 150;
            break;
        // Polynesia
        case "54":
            scale = 6;
            x = 1100;
            y = 415;
            break;
        default:
    }

    var translate = [worldMap.width / 2 - scale * x, worldMap.height / 2 - scale * y];

    worldMap.g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function countryClicked() {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    // Select the right country object
    var id = $(this).attr("id");
    var clickedCountry = $.grep(worldMap.countries.features, function(e) { return e.properties["FIPS"] == id })[0];

    $("#active")[0].innerHTML = clickedCountry.properties["NAME"];

    var responders = worldMap.data.reduce(function(a, b){
        if (b["EmbeddedData-Country"] == clickedCountry.properties["NAME"]) {
            return a + 1;
        }
        else {
            return a;
        }
    }, 0);

    $("#participants")[0].innerHTML = responders;

    var bounds = worldMap.path.bounds(clickedCountry),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
    // 0.9 - takes up 90% of screen
        scale = .9 / Math.max(dx / worldMap.width, dy / worldMap.height);

    var cid = clickedCountry.properties["UN"];

    console.log(cid);

    switch(cid) {
        // Russia
        case 643:
            scale = 2;
            x = 930;
            y = 150;
            break;
        // NZ
        case 554:
            scale = 7.5;
            x = 1120;
            y = 520;
            break;
        // USA
        case 840:
            scale = 2.5;
            x = 200;
            y = 200;
            break;
        // Fiji
        case 242:
            scale = 20;
            x = 1140;
            y = 435;
            break;
        default:
    }

    var translate = [worldMap.width / 2 - scale * x, worldMap.height / 2 - scale * y];

    worldMap.g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}


