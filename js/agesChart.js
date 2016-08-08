function addAgesChart(data) {

    var margin = {top: (worldMap.height * 0.03), right: 40, bottom: (worldMap.height * 0.07), left: 40},
        width = 300 - margin.left - margin.right,
        height = worldMap.height * 0.24 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var svg = d3.select("#mapID").append("svg")
        .attr("id", "agesSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $("#chart-area")
        .on("click", update);

    $("#view")
        .on("click", update);

    update();

    function update(){

        var clicked = $(".active.piece")[0];

        var value = [
            {label: "<18", count: 0},
            {label: "18-21", count: 0},
            {label: "22-26", count: 0},
            {label: "27-30", count: 0},
            {label: "31-35", count: 0},
            {label: ">35", count: 0}
        ];

        if (clicked == undefined) {
            data.map(function (d) {
                    var age = d["QID88"];
                    if (age == "less than 18") {
                        value[0].count += 1;
                    }
                    else if (age == "18-21") {
                        value[1].count += 1;
                    }
                    else if (age == "22-26") {
                        value[2].count += 1;
                    }
                    else if (age == "27-30") {
                        value[3].count += 1;
                    }
                    else if (age == "31-35") {
                        value[4].count += 1;
                    }
                    else {
                        value[5].count += 1;
                    }
            });
        }

        else {
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
                    var age = d["QID88"];
                        var age = d["QID88"];
                        if (age == "less than 18") {
                            value[0].count += 1;
                        }
                        else if (age == "18-21") {
                            value[1].count += 1;
                        }
                        else if (age == "22-26") {
                            value[2].count += 1;
                        }
                        else if (age == "27-30") {
                            value[3].count += 1;
                        }
                        else if (age == "31-35") {
                            value[4].count += 1;
                        }
                        else {
                            value[5].count += 1;
                        }
                }
            });
        }

        // Scale the range of the data in the domains
        x.domain(value.map(function(d) { return d.label; }));
        y.domain([0, d3.max(value, function(d) { return d.count; })]);

        var t = d3.transition()
            .duration(1000);

        // append the rectangles for the bar chart
        var rects = svg.selectAll(".bar")
            .data(value);

        rects.exit()
            .attr("class", "exit bar")
            .transition(t)
            .attr("y", height)
            .attr("height", 0)
            .remove();

        rects.attr("class", "update bar");

        rects
            .enter().append("rect")
            .attr("class", "enter bar")
            .merge(rects)
            .attr("x", function(d) { return x(d.label); })
            .attr("width", x.bandwidth)
            .attr("y", height)
            .attr("height", 0)
            .transition(t)
            .attr("height", height - y(0))
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });


        // Remove old axes
        svg.selectAll(".axis").remove();

        //Add new X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "1em")
            .attr("dy", "1em")
            .attr("transform", "rotate(-15)" );

        //Add new Y Axis
        var yMax = y.domain().slice(-1)[0];
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y)
                .tickFormat(function(e){
                    if(Math.floor(e) != e)
                    { return; }
                    return e;
                })
                .ticks(tickCountSetter(yMax)));
        function tickCountSetter(n){if (n <=2){return n} else {return 10}}

    }

    // Add the text label for the X axis
    svg.append("text")
    //.attr("class", "axis")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom - 2) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "11px")
        .text("Age Bands");
}