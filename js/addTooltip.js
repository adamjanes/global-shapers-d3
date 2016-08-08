function addTooltips(data) {
    // Prepare Data
    var region_nested_data = d3.nest()
        .key(function(d) { return d["EmbeddedData-Region_Cont"]})
        .entries(data);
    var subregion_nested_data = d3.nest()
        .key(function(d) { return d["EmbeddedData-Region_Sub"]})
        .entries(data);
    var country_nested_data = d3.nest()
        .key(function(d) { return d["EmbeddedData-Country"]})
        .entries(data);

    // Map
    d3.selectAll(".piece")
        .on("mouseover", function (d) {
            var piece = this.getAttribute("title");

            var myData;
            if (this.classList.contains("region")) {
                myData = region_nested_data;
            }
            else if (this.classList.contains("subregion")) {
                myData = subregion_nested_data;
            }
            else {
                myData = country_nested_data;
            }

            var participants = myData.find(function(d){
                return d.key == piece;
            });

            if (participants == undefined){
                participants = [];
            }

            //console.log(participants)

            var output = "<strong>" + piece + "</strong><br>Participants: " + participants.values.length;
            tooltip.show(output);
        })
        .on("mousemove", function () {
            tooltip.move();
        })
        .on("mouseout", function () {
            tooltip.hide();
        });

    d3.selectAll(".pie-slice")
        .on("mouseover", function (d) {
            var output = d.data.label + ": " + d.data.count;
            tooltip.show(output);
        })
        .on("mousemove", function () {
            tooltip.move();
        })
        .on("mouseout", function () {
            tooltip.hide();
        });

    d3.selectAll(".bar")
        .on("mouseover", function (d) {
            var output;
            if (d.count == 1) {
                output = "<strong>" + d.label + "</strong><br>Participants: " + d.count;
            }
            else {
                output = "<strong>" + d.label + "</strong><br>Participants: " + d.count;
            }
            tooltip.show(output);
        })
        .on("mousemove", function () {
            tooltip.move();
        })
        .on("mouseout", function () {
            tooltip.hide();
        });
}