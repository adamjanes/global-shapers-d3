function countData(arr, originalData) {
    var data = [];
    arr.forEach(function(col){
        var counts = {};
        originalData.forEach(function(d){
            if((d[col] != "-99") && (d[col] != "0")) {
                counts[d[col]] = 1 + (counts[d[col]] || 0);
            }
        });
        data.push(counts);
    });
    return formatData(data);
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
