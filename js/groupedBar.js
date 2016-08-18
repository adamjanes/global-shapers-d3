
GroupedBarChart = function(_parentElement) {
    this.parentElement = _parentElement;
    this.data = allData;

    this.initVis();
};

GroupedBarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: (worldMap.height * 0.25), right: (worldMap.width * 0.05),
        bottom: (worldMap.height * 0.35), left: (worldMap.width * 0.3)};
    vis.width = (worldMap.width - vis.margin.left - vis.margin.right);
    vis.height = (worldMap.height - vis.margin.top - vis.margin.bottom);

    vis.x = d3.scaleBand()
        .range([0, vis.width])
        .padding(0.2);

    vis.x1 = d3.scaleBand();

    vis.colorScale = d3.scaleOrdinal(d3.schemeCategory20b);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.chart = d3.select(vis.parentElement)
        .append("svg")
        .attr("id", "groupedChart")
        .style("display", "none")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.wrangleData();
};


GroupedBarChart.prototype.wrangleData = function() {
    var vis = this;
    
    if (($("#select-view").val() == "Categories") && ($("#display")[0].innerHTML == "Not-Map")) {
        // Get Relevant Data
        vis.view = $("#view_code")[0].innerHTML;
        vis.question = $("#select-insight").val();

        if (vis.region == null) {
            vis.region = "Show All";
        }

        if (vis.question == null) {
            vis.question = "Global Shapers Survey";
        }

        if (vis.question != "Global Shapers Survey"){
            vis.question = allQuestions.find(function(quest){
                return quest["short"] == vis.question;
            });

            vis.qid = vis.question["qid"];

            vis.dataCount = countGroupData(vis.qid, vis.view);
        }

        console.log(vis.dataCount);

        vis.updateVis();
        vis.updateVis();
    }
    
};

GroupedBarChart.prototype.updateVis = function() {
    var vis = this;

    // This shouldn't happen for the map view on load

    if (vis.dataCount != undefined) {
        vis.ansNames = vis.dataCount[0].answers.map(function(d){
            return d.text;
        });

        // Scale the range of the data in the domains
        vis.x.domain(vis.dataCount.map(function(d) { return d.region; }));
        vis.x1.domain(vis.ansNames).range([0, vis.x.bandwidth()]);
        vis.y.domain([0, d3.max(vis.dataCount, function(d) {
            return d3.max(d.answers, function(e){
                return +e.size;
            });
        })]);
        
        vis.t = d3.transition()
            .duration(1000);

        vis.regions = vis.chart.selectAll(".region-group")
                .data(vis.dataCount);

        vis.regions
            .exit()
            .attr("class", "exit region-group")
            .remove();

        vis.regions.attr("class", "update region-group");

        vis.regions
            .enter().append("g")
            .attr("class", "enter region-group")
            .merge(vis.chart.selectAll(".region-group"))
                .attr("transform", function(d) { return "translate(" + vis.x(d.region) + ", 0)"; });

        // append the rectangles for the bar chart
        vis.rects = vis.regions.selectAll(".bar2")
            .data(function(d) { return d.answers; });

        vis.rects
            .exit()
            .attr("class", "exit bar2")
            .transition(vis.t)
            .attr("y", vis.height)
            .attr("height", 0)
            .remove();

        vis.rects.attr("class", "update bar2");

        vis.rects
            .enter().append("rect")
            .attr("class", "enter bar2")
            .merge(vis.regions.selectAll(".bar2"))
            .attr("fill", function(d){
                return vis.colorScale(d.text);
            })
            .attr("height", 0)
            .attr("y", vis.height)
            .attr("x", function (d) { return vis.x1(d.text); })
            .attr("width", vis.x1.bandwidth)
            .transition(vis.t)
            .attr("height", function(d){
                return vis.height - vis.y(d.size);
            } )
            .attr("y", function (d) { return vis.y(d.size); });

        // Remove old axes
        vis.chart.selectAll(".axis").remove();

        vis.chart.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(vis.y));

        vis.chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x));

        vis.chart.selectAll(".title2").remove();

        // Add Title
        vis.chart.append("text")
            .attr("class", "title2")
            .attr("transform", "translate(" + (vis.width / 2) + " ," + (-40) + ")")
            .style("text-anchor", "middle")
            .text(vis.question["question"]);
    }

};

