function addGenderDonut() {

    var width = worldMap.width * 0.25,
        height = worldMap.height * 1.2,
        radius = worldMap.height / 10,
        donutWidth = radius / 2 - 10,
        legendRectSize = 18,
        legendSpacing = 6;
    
    var color = d3.scaleOrdinal()
        .range(["#B3DCFC", "#FFB351", "#FF9258"]);
    
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);
    

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
        ];

        allData.map(function (d) {
            var gen = d["QID87"];
            if (gen == "Male") {
                gender[0].count += 1;
            }
            else if (gen == "Female") {
                gender[1].count += 1;
            }
            else {
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

        $(".option")
            .on("click", change);

        $("#choose-regions")
            .on("change", change);

        $("#select-region")
             .on("change", change);

        $("#select-insight")
            .on("change", change);

        $("#participants").on("click", change);


    var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -12 * legendRectSize * i + 80;
                var vert = height - offset - 130;
                return 'translate(' + (horz - 40) + ',' + vert + ')';
            });
        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);
        var responses = $("#participants")[0].innerHTML;
        var legText = legend.append('text')
            .attr("class", "label")
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - 2)
            .text(function (d) {
                var gen = gender.find(function(val){
                    return val["label"] == d;
                }).count;
                return d + " (N = " + gen +  ")";
            });

    var pcts = g.selectAll(".pcts")
        .data(gender);

    var pctText = pcts
        .enter()
        .append("text")
        .attr("class", "pcts-gen")
        .attr("fill", "white")
        .text(function(d) {
            return ((d.count/responses)*100).toFixed(1) ;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("x", function(d, i) {
            return -((100 * i) - 50);
        })
        .attr("y", function(d) {
            return 0;
        });



        var title = g.append("text")
            .text("Gender Distribution")
            .attr("text-anchor", "middle")
            .style("font-weight", "lighter")
            .style("font-size", "18px")
            .style('color', "#31465B")
            .attr("class", "title");

        function change() {
            var clicked = $(".activey.piece")[0];

            var value = [
                {label: "Male", count: 0},
                {label: "Female", count: 0},
            ];
            
            if (clicked == undefined) {
                allData.map(function (d) {
                    var gen = d["QID87"];
                    if (gen == "Male") {
                        value[0].count += 1;
                    }
                    else if (gen == "Female") {
                        value[1].count += 1;
                    }
                });
            }

            else {
                // Get Type of Piece Clicked
                var type;
                if (clicked.classList.contains("region")) {
                    type = "EmbeddedData-Region"
                }
                else if (clicked.classList.contains("subregion")) {
                    type = "EmbeddedData-Region_Sub_WEF"
                }
                else if (clicked.classList.contains("development")) {
                    type = "EmbeddedData-UNDP_LEVEL"
                }
                else if (clicked.classList.contains("income")) {
                    type = "EmbeddedData-Income_WorldBank"
                }
                else {
                    type = "EmbeddedData-Country"
                }


                allData.map(function (d) {
                    if (d[type].toUpperCase() == clicked.getAttribute("title").toUpperCase()) {
                        var gen = d["QID87"];
                        if (gen == "Male") {
                            value[0].count += 1;
                        }
                        else if (gen == "Female") {
                            value[1].count += 1;
                        }
                        else {
                        }
                    }
                });
            }
            var responses = $("#participants")[0].innerHTML;
            
            legText
                .text(function (d) {
                    var gen = value.find(function(val){
                        return val["label"] == d;
                    }).count;
                    return d + " (N = " + gen +  ")";
                });

            pctText
                .text(function(d) {
                    var gen = value.find(function(val){
                        return val["label"] == d.label;
                    }).count;
                    return ((gen/responses)*100).toFixed(1) ;
                });

            path = path.data(pie(value)); // compute the new angles
            path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

            var pcts = $(".pcts-gen");
            //console.log(active)

            if (($("#select-region").val() == "Country") && ($("#active")[0].innerHTML != "World")) {
                pcts.hide();
            }
            else{
                pcts.show();
            }
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

    title
        .attr("transform", "translate(0, -150)");

}
