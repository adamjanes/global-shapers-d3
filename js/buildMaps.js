/**
 * Created by Adam on 7/28/2016.
 */

function addRegion(continent) {
    $(".country").toggle();
    region.enter().append("path")
        .attr("class", "region piece")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.name; })
        .style("fill", "grey")
        .on("click", regionClicked);
}

function addCountry(country) {
    $(".region").toggle();
    country.enter().append("path")
        .attr("class", function(d){
            return (d.properties["FIPS"] + " country piece");
        })
        .attr("d", path)
        .attr("id", function(d,i) { return d.properties["FIPS"]; })
        .attr("title", function(d,i) { return d.properties["NAME"]; })
        .attr("region", function(d) { return d.properties["REGION"]})
        .style("fill", "grey")
        .on("click", clicked2);
}