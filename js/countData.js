function countData(qid, view) {
    var arr = qidCodes[qid];

    var nested_data = d3.nest()
        .key(function(d){
            return (d[view]);
        })
        .entries(allData);

    var data = [];
    arr.forEach(function(col){
        var counts = {};
        nested_data.forEach(function(d){
            d.values.forEach(function(response){
                if((response[col] != "-99") && (response[col] != "0") && (response[col] != "")) {
                    counts[d.key] = (counts[d.key] || {});
                    counts[d.key][response[col]] = 1 + (counts[d.key][response[col]] || 0);
                }
            })
        });
        data.push(counts);
    });
    console.log((data));
    //return formatData(data);
}

function formatData(data){
    var result = [];
    var newD = data.map(function(d){
        for (datum in d) {
            d = {
                "text" : datum,
                "size" : d[datum]
            };
        }
        return d;
    });
    return newD;
}
