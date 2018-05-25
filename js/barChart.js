BarChart = function(_parentElement) {
    this.parentElement = _parentElement;
    this.data = allData;

    this.initVis();
};

BarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: (worldMap.height * 0.17), right: (worldMap.width * 0.05),
        bottom: (worldMap.height * 0.37), left: (worldMap.width * 0.45)};
    vis.width = (worldMap.width - vis.margin.left - vis.margin.right);
    vis.height = (worldMap.height - vis.margin.top - vis.margin.bottom);

    vis.y = d3.scaleBand()
        .range([0, vis.height])
        .padding(0.3);

    vis.x = d3.scaleLinear()
        .range([0, vis.width]);

    vis.chart = d3.select(vis.parentElement)
        .append("svg")
        .attr("id", "totalChart")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.wrangleData();
};


BarChart.prototype.wrangleData = function() {
    var vis = this;
    
    if (($("#select-view").val() == "Totals") && ($("#display")[0].innerHTML == "Not-Map")) {

        // Get Relevant Data
        vis.view = $("#view_code")[0].innerHTML;
        vis.region = $("#choose-regions").val();
        vis.question = $("#select-insight").val();

        if (vis.region == null) {
            vis.region = "Show All";
        }

        if (vis.question == null) {
            vis.question = "Global Shapers Survey";
        }

        if (vis.question != "Global Shapers Survey") {
            vis.question = allQuestions.find(function (quest) {
                return quest["short"] == vis.question;
            });

            vis.qid = vis.question["qid"];

            vis.dataCount = countData(vis.qid, vis.view, vis.region).sort(function (a, b) {
                return b.size - a.size;
            });
        }

        vis.updateVis();
    }

};

BarChart.prototype.updateVis = function() {
    var vis = this;
    
    // This shouldn't happen for the map view on load
    if (vis.dataCount != undefined) {
        // Scale the range of the data in the domains
        vis.y.domain(vis.dataCount.map(function(d) { return d.text; }));
        vis.x.domain([0, d3.max(vis.dataCount, function(d) { return +d.size; })]);

        vis.t = d3.transition()
            .duration(1000);

        // append the rectangles for the bar chart
        vis.rects = vis.chart.selectAll(".bar3")
            .data(vis.dataCount);

        vis.rects.exit()
            .attr("class", "exit bar3")
            .transition(vis.t)
            .attr("x", vis.x(0))
            .attr("width", 0)
            .remove();

        vis.rects.attr("class", "update bar3")
            .transition(vis.t)
            .attr("x", vis.x(0))
            .attr("width", function (d) {
                return vis.x(d.size);
            })
            .attr("y", function (d) {
                return vis.y(d.text);
            })
            .attr("height", vis.y.bandwidth);

        vis.rects
            .enter().append("rect")
            .attr("class", "enter bar3")
            .attr("fill", "blue")
            .attr("y", function (d) {
                return vis.y(d.text);
            })
            .attr("height", vis.y.bandwidth)
            .attr("x", vis.x(0))
            .attr("width", 0)
            .transition(vis.t)
            .attr("x", vis.x(0))
            .attr("width", function (d) {
                return vis.x(d.size);
            });

        vis.respondents = $("#participants")[0].innerHTML;

        vis.pcts = vis.chart.selectAll(".pcts")
            .data(vis.dataCount);

        vis.pcts.exit()
            .attr("class", "exit pcts")
            .attr("x", 0)
            .remove();

        vis.pcts
            .attr("class", "update pcts")
            .transition(vis.t)
            .text(function(d) {
                var pct = d.size + "%";
                return pct;
            })
            .attr("text-anchor", "left")
            .attr("x", function(d, i) {
                return vis.x(d.size) + 5;
            })
            .attr("y", function(d) {
                return vis.y(d.text) + vis.y.bandwidth()/2 + 5;
            });

        vis.pcts
            .enter()
            .append("text")
            .attr("class", "enter pcts")
            .text(function(d) {
                var pct = d.size + "%";
                return pct;
            })
            .attr("text-anchor", "left")
            .attr("y", (vis.height))
            .attr("height", 0)
            .attr("y", function(d) {
                return vis.y(d.text) + vis.y.bandwidth()/2 + 5;
            })
            .transition(vis.t)
            .attr("x", function(d, i) {
                return vis.x(d.size) + 5;
            });

         // Remove old axes
         vis.chart.selectAll(".axis").remove();
        
         vis.chart.append("g")
         .attr("class", "axis")
         .call(d3.axisLeft(vis.y))
             .selectAll("text")
             .attr("class", "label2")
             .style("text-anchor", "end")
             .attr("font-size", "15px")
             //.attr("dy", "1em")
             .text(function(d){
                 return d;
             });

        vis.chart.selectAll(".title2").remove();

        var responses = $("#participants")[0].innerHTML;

        // Add Title
        vis.chart.append("text")
            .attr("class", "title2")
            .attr("transform", "translate(" + (vis.width / 3) + " ," + (-40) + ")")
            .style("text-anchor", "middle")
            .attr("font-size", "16px")
            .text(vis.question["question"]  + " (N = " + responses + ")");
        
        if (vis.question["type"] == "ManyRows") {
            // Add the text label for the X axis
            vis.chart.append("text")
                .attr("class", "title2")
                .attr("font-size", "15px")
                .attr("transform", "translate(" + ((vis.width/2) - 50) + " ," + (vis.height + 40) + ")")
                .style("text-anchor", "middle")
                .text("Percentage of Unique Votes (Respondents could choose up to 3 answer choices)")

            d3.selectAll(".bar3")
                .on("mouseover", function (d) {
                    tooltip.show(d.text + " (N = " + d.total + ")<br>" + (d.size) + "% of Unique Votes");
                })
                .on("mousemove", function () {
                    tooltip.move();
                })
                .on("mouseout", function () {
                    tooltip.hide();
                });
        }

        else {
            // Add the text label for the X axis
            vis.chart.append("text")
                .attr("class", "title2")
                .attr("font-size", "15px")
                .attr("transform", "translate(" + ((vis.width/2) - 50) + " ," + (vis.height + 40) + ")")
                .style("text-anchor", "middle")
                .text("Percentage of Votes");

            d3.selectAll(".bar3")
                .on("mouseover", function (d) {
                    tooltip.show(d.text + " (N = " + d.total + ")<br>" + (d.size) + "% of Votes");
                })
                .on("mousemove", function () {
                    tooltip.move();
                })
                .on("mouseout", function () {
                    tooltip.hide();
                });
        }
    }



};

