function addGenderDonut(data) {

    var width = 300,
        height = worldMap.height * 0.75,
        radius = worldMap.height / 8,
        donutWidth = radius / 2 - 10,
        legendRectSize = 14,
        legendSpacing = 4;
    
    var color = d3.scaleOrdinal()
        .range(["cornflowerblue", "orange", "grey"]);
    
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - donutWidth);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.count;
        });

    var svg = d3.select("#mapID")
        .append("svg")
        .attr("width", width)
        .attr("id", "genderSVG")
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

        var gender = [
            {label: "Male", count: 0},
            {label: "Female", count: 0},
            {label: "Other", count: 0}
        ];

        data.map(function (d) {
            var gen = d["QID87"];
            if (gen == "Male") {
                gender[0].count += 1;
            }
            else if (gen == "Female") {
                gender[1].count += 1;
            }
            else {
                gender[2].count += 1;
            }
        });
    
        var g = svg.selectAll(".arc")
            .data(pie(gender))
            .enter().append("g")
            .attr("class", "arc");

        var path = g.append("path")
            .attr("d", arc)
            .attr("class", "pie-slice")
            .style("fill", function (d) {
                return color(d.data.label);
            })
            .each(function (d) { this._current = d; });

        $("#chart-area")
            .on("click", change);

        $("#view")
            .on("click", change);

        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize + 10;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });
        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);
        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) {
                return d;
            });

        function change() {
            var value;
            var clicked = $(".active.piece")[0];

            if (clicked == undefined) {
                value = gender;
            }

            else {
                value = [
                    {label: "Male", count: 0},
                    {label: "Female", count: 0},
                    {label: "Other", count: 0}
                ];

                // Get Type of Piece Clicked
                var type;
                if (clicked.classList.contains("region")) {
                    type = "EmbeddedData-Region_Cont"
                }
                else if (clicked.classList.contains("subregion")) {
                    type = "EmbeddedData-Region_Sub"
                }
                else {
                    type = "EmbeddedData-Country"
                }


                data.map(function (d) {
                    if (d[type] == clicked.getAttribute("title")) {
                        var gen = d["QID87"];
                        if (gen == "Male") {
                            value[0].count += 1;
                        }
                        else if (gen == "Female") {
                            value[1].count += 1;
                        }
                        else {
                            value[2].count += 1;
                        }
                    }
                });
            }

            path = path.data(pie(value)); // compute the new angles
            path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }

}
