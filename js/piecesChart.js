function addPiecesChart(allData) {
    var margin = {top: (worldMap.height * 0.71), right: 40, bottom: (worldMap.height * 0.1), left: 40},
        width = worldMap.width * 0.25 - margin.left - margin.right,
        height = worldMap.height * 0.96 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);

    var y = d3.scaleLinear()
        .range([height, 0]);


    var svg = d3.select("#mapID").append("svg")
        .attr("id", "piecesSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $("#chart-area")
        .on("click", update);

    $(".option")
        .on("click", update);

    update();

    function update(){
        var flag = $("#flag")[0].innerHTML;


        if ((flag == "NO")){
            return;
        }

        // Get Right Data
        var type1;
        var type2;
        var view = $(".active.piece")[0];

            var data = [],
            nested_data,
            thisRegion,
            regionData;

        
        if (view == undefined){
            type1 = "EmbeddedData-Region";
            nested_data = d3.nest()
                .key(function(d) { return d[type1]; })
                .entries(allData);

            nested_data.map(function(d) {
                return data.push({
                    "label": d.key,
                    "count": d.values.length
                })
            });
        }

        else if (view.classList.contains("region")) {
            type1 = "EmbeddedData-Region";
            type2 = "EmbeddedData-Region_Sub_WEF";
            nested_data = d3.nest()
                .key(function(d) { return d[type1]; })
                .key(function(d) { return d[type2]; })
                .entries(allData);

            thisRegion = $("#active")[0].innerHTML;

            regionData = nested_data.find(function(d){
                return d.key == thisRegion;
            }).values;

            regionData.map(function(d) {
                if (d.key == "Australia and New Zealand") {
                    d.key = "Australia/New Zealand";
                }
                if (d.key != "#N/A"){
                    return data.push({
                        "label": d.key,
                        "count": d.values.length
                    })
                }
            });
        }
        else if (view.classList.contains("subregion")) {
            type1 = "EmbeddedData-Region_Sub_WEF";
            type2 = "EmbeddedData-Country";
            nested_data = d3.nest()
                .key(function(d) { return d[type1]; })
                .key(function(d) { return d[type2]; })
                .entries(allData);

            var regName = $("#active")[0].innerHTML;

            thisRegion = regName.replace(/&amp;/g, '&');

            regionData = nested_data.find(function(d){
                return d.key == thisRegion;
            }).values;

            regionData.map(function(d) {
                return data.push({
                    "label": d.key,
                    "count": d.values.length
                })
            });
        }

        else if (view.classList.contains("development")) {
            type1 = "EmbeddedData-UNDP_LEVEL";
            type2 = "EmbeddedData-Country";
            nested_data = d3.nest()
                .key(function(d) { return d[type1]; })
                .key(function(d) { return d[type2]; })
                .entries(allData);

            thisRegion = $("#active")[0].innerHTML;

            console.log(nested_data);

            regionData = nested_data.find(function(d){
                return d.key.toUpperCase() == thisRegion.toUpperCase();
            }).values;

            regionData.map(function(d) {
                return data.push({
                    "label": d.key,
                    "count": d.values.length
                })
            });
        }

        else if (view.classList.contains("income")) {
            type1 = "EmbeddedData-Income_WorldBank";
            type2 = "EmbeddedData-Country";
            nested_data = d3.nest()
                .key(function(d) { return d[type1]; })
                .key(function(d) { return d[type2]; })
                .entries(allData);

            thisRegion = $("#active")[0].innerHTML;

            regionData = nested_data.find(function(d){
                return d.key.toUpperCase() == thisRegion.toUpperCase();
            }).values;

            regionData.map(function(d) {
                return data.push({
                    "label": d.key,
                    "count": d.values.length
                })
            });
        }

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.label; }));
        y.domain([0, d3.max(data, function(d) { return d.count; })]);


        var t = d3.transition()
            .duration(1000);

        // append the rectangles for the bar chart
        var rects = svg.selectAll(".bar").data(data);

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
            .on("mouseover", function (d) {
                var output;
                if (d.count == 1) {
                    output = "<strong>" + d.label + "</strong><br>Participants: " + d.count;
                }
                else {
                    output = "<strong>" + d.label + "</strong><br>Participants: " + d.count;
                }
                tooltip.show(output);
            })
            .on("mousemove", function () {
                tooltip.move();
            })
            .on("mouseout", function () {
                tooltip.hide();
            })
            .transition(t)
            .attr("height", height - y(0))
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); })
        ;

        // Remove old axes
        svg.selectAll(".axis").remove();

        //Add new X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("class", "label")
            .style("text-anchor", "end")
            .attr("dx", ".5em")
            .attr("dy", "1em")
            .attr("transform", "rotate(-25)" );

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
        function tickCountSetter(n){if (n <=2){return n} else {return 5}}

    }
    // Add the text label for the X axis
    svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom - 2) + ")")
        .style("text-anchor", "middle")
        .text("Region");
}
