function addRegions() {
    worldMap.region.enter().append("path")
        .attr("class", "region piece")
        .attr("d", worldMap.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("fill", function(d){
            var regio = d.name;
            var responders = worldMap.data.reduce(function(a, b){
                if (b["EmbeddedData-Region_Cont"] == regio){
                    return a + 1;
                }
                else{
                    return a;
                }
            }, 0);
            if (responders > 30){
                return "#337ab7";
            }
            else {
                return "grey";
            }
        })
        .on("click", regionClicked);

    $("#participants")[0].innerHTML = worldMap.data.length;
}

function addSubregions() {
    worldMap.subregion.enter().append("path")
        .attr("class", "subregion piece")
        .attr("d", worldMap.path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("fill", function(d){
            var sregio = d.name;
            var responders = worldMap.data.reduce(function(a, b){
                if (b["EmbeddedData-Region_Sub"] == sregio){
                    return a + 1;
                }
                else{
                    return a;
                }
            }, 0);
            if (responders > 10){
                return "#337ab7";
            }
            else {
                return "grey";
            }
        })
        .on("click", subregionClicked);
}

function addCountries() {
    worldMap.country.enter().append("path")
        .attr("class", function(d){
            return (d.properties["FIPS"] + " country piece");
        })
        .attr("d", worldMap.path)
        .attr("id", function(d,i) { return d.properties["FIPS"]; })
        .attr("title", function(d,i) { return d.properties["NAME"]; })
        .attr("region", function(d) { return d.properties["REGION"]})
        .style("fill", function(d){
            if (d.properties["NAME"] != "Antarctica"){
                var regio = d.properties["NAME"];
                var responders = worldMap.data.reduce(function(a, b){
                    if (b["EmbeddedData-Country"] == regio){
                        return a + 1;
                    }
                    else{
                        return a;
                    }
                }, 0);
                if (responders > 5){
                    return "#337ab7";
                }
                else {
                    return "grey";
                }
            }
            else {
                return "white";
            }
        })
        .on("click", countryClicked);
}

