
VertBarChart = function(_parentElement) {
    this.parentElement = _parentElement;
    this.data = allData;

    this.initVis();
};

VertBarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: (worldMap.height * 0.2), right: (worldMap.width * 0.05),
        bottom: (worldMap.height * 0.41), left: (worldMap.width * 0.32)};
    vis.width = (worldMap.width - vis.margin.left - vis.margin.right);
    vis.height = (worldMap.height - vis.margin.top - vis.margin.bottom);

    vis.x = d3.scaleBand()
        .range([0, vis.width])
        .padding(0.3);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.chart = d3.select(vis.parentElement)
        .append("svg")
        .attr("id", "vertChart")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.wrangleData();
};


VertBarChart.prototype.wrangleData = function() {
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

            vis.dataCount = countData(vis.qid, vis.view, vis.region);
        }

        vis.updateVis();
    }

};

VertBarChart.prototype.updateVis = function() {
    var vis = this;

    // This shouldn't happen for the map view on load
    if (vis.dataCount != undefined) {
        // Scale the range of the data in the domains
        vis.x.domain(vis.dataCount.map(function(d) { return d.text; }));
        vis.y.domain([0, d3.max(vis.dataCount, function(d) { return +d.size; })]);

        vis.t = d3.transition()
            .duration(1000);

        // append the rectangles for the bar chart
        vis.rects = vis.chart.selectAll(".bar3")
            .data(vis.dataCount);

        vis.rects.exit()
            .attr("class", "exit bar3")
            .transition(vis.t)
            .attr("y", (vis.height))
            .attr("height", 0)
            .remove();

        vis.rects.attr("class", "update bar3")
            .transition(vis.t)
            .attr("y", function(d) { return vis.y(d.size) } )
            .attr("height", function (d) {
                return vis.height - vis.y(d.size);
            })
            .attr("x", function (d) {
                return vis.x(d.text);
            })
            .attr("width", vis.x.bandwidth);

        vis.rects
            .enter().append("rect")
            .attr("class", "enter bar3")
            .attr("fill", "blue")
            .attr("x", function (d) {
                return vis.x(d.text);
            })
            .attr("width", vis.x.bandwidth)
            .attr("y", (vis.height))
            .attr("height", 0)
            .transition(vis.t)
            .attr("y", function(d) { return vis.y(d.size) } )
            .attr("height", function (d) {
                return vis.height - vis.y(d.size);
            });

        vis.respondents = $("#participants")[0].innerHTML;

        vis.pcts = vis.chart.selectAll(".pcts")
            .data(vis.dataCount);

        vis.pcts.exit()
            .attr("class", "exit pcts")
            .attr("y", (vis.height))
            .attr("height", 0)
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
                return vis.x(d.text) + 55;
            })
            .attr("y", function(d) {
                return vis.y(d.size) - 5;
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
            .attr("x", function(d, i) {
                return vis.x(d.text) + 55;
            })
            .transition(vis.t)
            .attr("y", function(d) {
                return vis.y(d.size) -5;
            });

        // Remove old axes
        vis.chart.selectAll(".axis").remove();
/*
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
            });*/

        vis.chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x))
            .attr("font-size", "14px");

        vis.chart.selectAll(".title2").remove();

        var responses = $("#participants")[0].innerHTML;

        // Add Title
        vis.chart.append("text")
            .attr("class", "title2")
            .attr("transform", "translate(" + (vis.width / 2) + " ," + (-40) + ")")
            .style("text-anchor", "middle")
            .attr("font-size", "16px")
            .text(vis.question["question"]  + " (N = " + responses + ")");

        vis.chart.append("text")
            .attr("class", "title2")
            .attr("font-size", "16px")
            //.attr("transform", "translate(" + -20 + " ," + vis.height/2 + ")")
            .attr("transform", "rotate(-90)")
            .attr("x", -300)
            .attr("y", -40)
            .style("text-anchor", "start")
            .text("Percentage of Votes");

        d3.selectAll(".bar3")
            .on("mouseover", function (d) {
                tooltip.show(d.text + " (N = " + d.num + ")<br>" + (d.size) + "% of Votes in " + d.region);
            })
            .on("mousemove", function () {
                tooltip.move();
            })
            .on("mouseout", function () {
                tooltip.hide();
            });
    }



};

