function addAgesChart(data) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 300 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);

    var y = d3.scaleLinear()
        .range([height, 0]);


    var svg = d3.select("#ages-chart-area").append("svg")
        .attr("id", "agesSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $("#chart-area")
        .on("click", update);

    update();

    function update(){
        /*var view = $(".active.piece")[0];

        var type;

        // World
        if (view == undefined) {
            type = "EmbeddedData-Region_Cont"
        }
        // Region
        else if (view.classList.contains("region")) {
            type = "EmbeddedData-Region_Sub"
        }
        // National
        else {
            type = "EmbeddedData-Country"
        }

        var nested_data = d3.nest()
            .key(function(d){
                return d["QID88"];
            })
            .key(function(d) { return d[type]; })
            .entries(allData);

        var data = [];

        nested_data.map(function(d) {
            if (d.key == "less than 18") {
                return data.push({
                    "label": "<18",
                    "count": d.values.length
                })
            }
            else if (d.key == "more than 35"){
                return data.push({
                    "label": ">35",
                    "count": d.values.length
                })
            }
            else {
                return data.push({
                    "label": d.key,
                    "count": d.values.length
                })
            }
        });

        data.sort(function(a, b){
            if ((a.label == ">35") || (b.label == "<18")){
                return 1;
            }
            else if ((a.label == "<18") || (b.label == ">35")){
                return 1;
            }
            else {
                console.log(a.label.substr(0,2));
                return a.label.substr(0,2) - b.label.substr(0,2);
            }
        });*/

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
                    console.log("HI")
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

        console.log(value)


        // Scale the range of the data in the domains
        x.domain(value.map(function(d) { return d.label; }));
        y.domain([0, d3.max(value, function(d) { return d.count; })]);

        var t = d3.transition()
            .duration(1000);

        // append the rectangles for the bar chart
        var rects = svg.selectAll(".bar")
            .data(value);

        rects.exit()
            .attr("class", "exit")
            .transition(t)
            .attr("y", height)
            .attr("height", 0)
            .style("fill-opacity", 1e-6)
            .remove();

        rects.attr("class", "update bar");

        rects
            .enter().append("rect")
            .attr("class", "enter")
            .attr("class", "bar")
            .merge(rects)
            .attr("x", function(d) { return x(d.label); })
            .attr("width", x.bandwidth)
            .attr("y", height)
            .attr("height", 0)
            .transition(t)
            .attr("fill", "grey")
            .attr("height", height - y(0))
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });


        // Remove old axes
        svg.selectAll(".axis").remove();

        //Add new axes
        svg
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "1.8em")
            .attr("dy", "1.2em")
            .attr("transform", "rotate(-15)" );

        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

    }

}