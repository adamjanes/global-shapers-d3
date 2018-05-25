function addAgesChart() {

    var margin = {top: (worldMap.height * 0.21), right: 60, bottom: (worldMap.height * 0.08), left: 80},
        width = (worldMap.width * 0.25 - margin.left - margin.right),
        height = (worldMap.height * 0.48 - margin.top - margin.bottom) * 0.7;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.5);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var svg = d3.select("#mapID").append("svg")
        .attr("id", "agesSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $("#mapID2")
        .on("click", update);

    $("#select-region")
        .on("change", update);

    $("#choose-regions")
        .on("change", update);

    $("#select-insight")
        .on("change", update);

    $("#participants").on("click", update);

    $("#flag")[0].innerHTML = "YES";

    update();

    function update(trigger){
        var flag = $("#flag")[0].innerHTML;
        
        if (trigger == undefined) {
            trigger = {type: "NA"};
        }

        if ((flag == "NO") && (trigger.type != "change")){
            return;
        }

        var clicked = $(".activey.piece")[0];
        
        var value = [
            {label: "18-21", count: 0},
            {label: "22-26", count: 0},
            {label: "27-30", count: 0},
            {label: "31-35", count: 0},
        ];

        if (clicked == undefined) {
            allData.map(function (d) {
                    var age = d["QID88"];
                    if (age == "18-21") {
                        value[0].count += 1;
                    }
                    else if (age == "22-26") {
                        value[1].count += 1;
                    }
                    else if (age == "27-30") {
                        value[2].count += 1;
                    }
                    else if (age == "31-35") {
                        value[3].count += 1;
                    }
            });
        }

        else {
            // Get Type of Piece Clicked
            var type = $("#view_code")[0].innerHTML;


            allData.map(function (d) {
                if (d[type].toUpperCase() == clicked.getAttribute("title").toUpperCase()) {
                    var age = d["QID88"];
                        var age = d["QID88"];
                    if (age == "18-21") {
                        value[0].count += 1;
                    }
                    else if (age == "22-26") {
                        value[1].count += 1;
                    }
                    else if (age == "27-30") {
                        value[2].count += 1;
                    }
                    else if (age == "31-35") {
                        value[3].count += 1;
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

        rects.attr("class", "update bar")
            .transition(t)
            .attr("x", function(d) { return x(d.label); })
            .attr("width", x.bandwidth)
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });

        rects
            .enter().append("rect")
            .attr("class", "enter bar")
            .transition(t)
            .attr("x", function(d) { return x(d.label); })
            .attr("width", x.bandwidth)
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });


        var respondents = $("#participants")[0].innerHTML;

        var pcts = svg.selectAll(".pcts")
            .data(value);

        pcts.exit()
            .attr("class", "exit pcts")
            .remove();

        pcts
            .attr("class", "update pcts")
            .transition(t)
            .text(function(d) {
                var pct = ((d.count / respondents)*100).toFixed(0) + "%";
                return pct;
            })
            .attr("fill", "white")
            .attr("text-anchor", "left")
            .attr("x", function(d, i) {
                return x(d.label) + 7;
            })
            .attr("y", function(d) {
                return y(d.count) - 5;
            });

        pcts
            .enter()
            .append("text")
            .attr("class", "enter pcts")
            .attr("fill", "white")
            .text(function(d) {
                var pct = ((d.count / respondents)*100).toFixed(0) + "%";
                return pct;
            })
            .attr("text-anchor", "left")
            .attr("x", function(d, i) {
                return x(d.label) + 5;
            })
            .attr("y", function(d) {
                return y(d.count) -5;
            });

        // Remove old axes
        svg.selectAll(".axis").remove();

        //Add new X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("class", "label")
            .style("text-anchor", "middle")
            .text(function(d){
                return d;
            });

        /*//Add new Y Axis
        var yMax = y.domain().slice(-1)[0];
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y)
                .tickFormat(function(e){
                    if(Math.floor(e) != e)
                    { return; }
                    return e;
                })
                .ticks(tickCountSetter(yMax)))
            .selectAll("text")
            .attr("class", "label")
        function tickCountSetter(n){if (n <=2){return n} else {return 3}}
*/
    }

    // Add the text label for the X axis
    svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + ((width / 2) - 10) + " ," + (-40) + ")")
        .style("text-anchor", "middle")
        .text("Age Group Distribution");
}