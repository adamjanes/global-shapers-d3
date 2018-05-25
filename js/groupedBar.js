
GroupedBarChart = function(_parentElement) {
    this.parentElement = _parentElement;
    this.data = allData;

    this.initVis();
};

GroupedBarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: (worldMap.height * 0.2), right: (worldMap.width * 0.2),
        bottom: (worldMap.height * 0.41), left: (worldMap.width * 0.32)};
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
        var view = $("#view_code")[0].innerHTML;

        if (view == "EmbeddedData-Country"){
            view = "EmbeddedData-Region";
            $("#country").removeAttr("selected");
            $("#region").attr("selected", "selected");
            $("#select-region").trigger("change");
        }

        // Get Relevant Data
        vis.view = view;
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
            .transition(vis.t)
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
            .attr("x", function (d) { return vis.x1(d.text); })
            .attr("width", vis.x1.bandwidth)
            .attr("y", vis.height)
            .attr("height", 0)
            .merge(vis.regions.selectAll(".bar2"))
            .transition(vis.t)
            .attr("fill", function(d){
                return vis.colorScale(d.text);
            })
            .attr("x", function (d) { return vis.x1(d.text); })
            .attr("width", vis.x1.bandwidth)
            .attr("height", function(d){
                return vis.height - vis.y(d.size);
            } )
            .attr("y", function (d) { return vis.y(d.size); });

        // Remove old axes
        vis.chart.selectAll(".axis").remove();

        vis.chart.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(vis.y))
            .attr("font-size", "14px");


        vis.chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x))
            .selectAll("text")
            .attr("class", "label2")
            .style("text-anchor", "end")
            .attr("dx", "1em")
            .attr("dy", "1em")
            .attr("font-size", "16px")
            .attr("transform", "rotate(-25)")
            .text(function(d){
                return d;
            });

        vis.chart.selectAll(".title2").remove();

        var responses = $("#participants")[0].innerHTML;
        
        // Add Title
        vis.chart.append("text")
            .attr("class", "title2")
            .attr("font-size", "16px")
            .attr("transform", "translate(" + (((vis.width + vis.margin.right) / 2) - 20) + " ," + (-60) + ")")
            .style("text-anchor", "middle")
            .text(vis.question["question"] + " (N = " + responses + ")");

        vis.chart.selectAll(".legend").remove();

        vis.legend = vis.chart.selectAll(".legend")
            .data(vis.ansNames.slice())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(-15," + ((i * 26) - 40) + ")"; });

        vis.legend.append("rect")
            .attr("x", vis.width + vis.margin.right -30)
            .attr("width", 24)
            .attr("height", 24)
            .style("fill", vis.colorScale);

        vis.legend.append("text")
            .attr("x", vis.width + vis.margin.right - 36)
            .attr("font-size", "16px")
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
        
        if (vis.question["type"] == "ManyRows") {
            // Add the text label for the Y axis
            vis.chart.append("text")
                .attr("class", "title2")
                .attr("font-size", "16px")
                //.attr("transform", "translate(" + -20 + " ," + vis.height/2 + ")")
                .attr("transform", "rotate(-90)")
                .attr("x", -200)
                .attr("y", -40)
                .style("text-anchor", "middle")
                .text("Percentage of Unique Votes (Respondents could choose up to 3 answer choices)");

            d3.selectAll(".bar2")
                .on("mouseover", function (d) {
                    tooltip.show(d.text + " (N = " + d.num + ")<br>" + (d.size) + "% of Unique Votes in " + d.region);
                })
                .on("mousemove", function () {
                    tooltip.move();
                })
                .on("mouseout", function () {
                    tooltip.hide();
                });

        }

        else {
            // Add the text label for the Y axis
            vis.chart.append("text")
                .attr("class", "title2")
                .attr("font-size", "16px")
                //.attr("transform", "translate(" + -20 + " ," + vis.height/2 + ")")
                .attr("transform", "rotate(-90)")
                .attr("x", -300)
                .attr("y", -40)
                .style("text-anchor", "start")
                .text("Percentage of Votes");

            d3.selectAll(".bar2")
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
    }



};

