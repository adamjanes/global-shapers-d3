function addTooltips() {
    // Map
    d3.selectAll(".piece")
        .on("mouseover", function (d) {
            var piece = this.getAttribute("title");

            var selection = this.getAttribute("selection");
            var stat = this.getAttribute("stat");

            var output = "<strong>" + piece + "</strong><br>" + selection + ": " + stat;
            tooltip.show(output);
        })
        .on("mousemove", function () {
            tooltip.move();
        })
        .on("mouseout", function () {
            tooltip.hide();
        });

    // Pie Chart
    d3.selectAll(".pie-slice")
        .on("mouseover", function (d) {
            var output = d.data.label + ": " + d.data.count + " Respondents";
            tooltip.show(output);
        })
        .on("mousemove", function () {
            tooltip.move();
        })
        .on("mouseout", function () {
            tooltip.hide();
        });

    // Ages Chart
    d3.selectAll(".bar")
        .on("mouseover", function (d) {

            var output =  "<strong>" + d.label + " (N = " + d.count + ")</strong><br> " + ((d.count / $("#participants")[0].innerHTML) * 100).toFixed(1) + "% of Respondents";

            tooltip.show(output);
        })
        .on("mousemove", function () {
            tooltip.move();
        })
        .on("mouseout", function () {
            tooltip.hide();
        });

}