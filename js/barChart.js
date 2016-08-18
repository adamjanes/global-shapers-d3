
BarChart = function(_parentElement) {
    this.parentElement = _parentElement;
    this.data = allData;

    this.initVis();
};

BarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: (worldMap.height * 0.2), right: (worldMap.width * 0.05),
        bottom: (worldMap.height * 0.3), left: (worldMap.width * 0.45)};
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
        vis.rects = vis.chart.selectAll(".bar")
            .data(vis.dataCount);

        vis.rects.exit()
            .attr("class", "exit bar")
            .transition(vis.t)
            .attr("x", vis.x(0))
            .attr("width", 0)
            .remove();

        vis.rects.attr("class", "update bar");

        vis.rects
            .enter().append("rect")
            .attr("class", "enter bar")
            .merge(vis.rects)
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

         // Remove old axes
         vis.chart.selectAll(".axis").remove();
        
         vis.chart.append("g")
         .attr("class", "axis")
         .call(d3.axisLeft(vis.y));

        vis.chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x))
            .append("text")
            .text("hello");

        vis.chart.selectAll(".title2").remove();

        // Add Title
        vis.chart.append("text")
            .attr("class", "title2")
            .attr("transform", "translate(" + (vis.width / 3) + " ," + (-20) + ")")
            .style("text-anchor", "middle")
            .text(vis.question["question"]);

    }
    
};

