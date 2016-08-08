function addPiecesChart(allData) {

    var margin = {top: 350, right: 20, bottom: 40, left: 40},
        width = 300 - margin.left - margin.right,
        height = 490 - margin.top - margin.bottom;

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

    $("#view")
        .on("click", update);
    
    update();

    function update(){
        // Get Right Data
        var type1;
        var type2;
        var view = $(".active.piece")[0];

        var data = [],
            nested_data,
            thisRegion,
            regionData;

        if (view == undefined){
            type1 = "EmbeddedData-Region_Cont";
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
            type1 = "EmbeddedData-Region_Cont";
            type2 = "EmbeddedData-Region_Sub";
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
                return data.push({
                    "label": d.key,
                    "count": d.values.length
                })
            });
        }
        else if (view.classList.contains("subregion")) {
            type1 = "EmbeddedData-Region_Sub";
            type2 = "EmbeddedData-Country";
            nested_data = d3.nest()
                .key(function(d) { return d[type1]; })
                .key(function(d) { return d[type2]; })
                .entries(allData);

            thisRegion = $("#active")[0].innerHTML;
            
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
            .attr("class", "enter")
            .attr("class", "bar")
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
