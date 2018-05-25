// Counts data for Total Chart
function countData(qid, view, region) {
    var answers = $(".answer").toArray();

    var data = [];
    
    // Not sorted individually
    if (region == "Show All") {
        // For each answer that we are matching on
        answers.forEach(function (answer) {
            var matched = 0;
            var qid = answer.id;
            var val = answer.text;
            if (qid == "QID107-1" || qid == "QID172-1") {
                val = reversePerceptionScale[val];
            }
            allData.forEach(function (response) {
                if ((response[qid] == val)) {
                    matched += 1;
                }
            });
            data.push({
                "text": edit(answer.text, qid),
                "size": ((matched/allData.length)*100).toFixed(1),
                "total": matched
            });
        });
    }

    // Sorted by some Region (E.g. Only Africa)
    else {
        answers.forEach(function (answer) {
            var total = 0;
            var matched = 0;
            var qid = answer.id;
            var val = answer.text;
            if (qid == "QID107-1" || qid == "QID172-1") {
                val = reversePerceptionScale[val];
            }
            allData.forEach(function (response) {
                if ((response[view].toUpperCase() == region.toUpperCase())){
                    if ((response[qid] == val)) {
                        matched += 1;
                    }
                    total += 1;
                }
            });
            data.push({
                "text": edit(answer.text),
                "size": ((matched/total)*100).toFixed(1),
                "total": matched
            });
        });
    }
    var newData = [];



    if (qid == "QID107"){
        newData.push(data.find(function(d){
            return d.text == "Not at All";
        }));
        newData.push(data.find(function(d){
            return d.text == "Not Enough";
        }));
        newData.push(data.find(function(d){
            return d.text == "A Little";
        }));
        newData.push(data.find(function(d){
            return d.text == "To an Extent";
        }));
        newData.push(data.find(function(d){
            return d.text == "To a Great Extent";
        }));
        data = newData;
    }


    if (qid == "QID172"){
        newData.push(data.find(function(d){
            return d.text == "Strongly Disagree";
        }));
        newData.push(data.find(function(d){
            return d.text == "Disagree";
        }));
        newData.push(data.find(function(d){
            return d.text == "Neutral";
        }));

        newData.push(data.find(function(d){
            return d.text == "Agree";
        }));
        newData.push(data.find(function(d){
            return d.text == "Strongly Agree";
        }));
        data = newData;
    }
    
    function add(point) {
        var addition = (data.find(function(d){
            return d.text == point;
        }));
        newData.push(addition);
    }

    return (data);
}

function countGroupData(qid, view) {
    var nested_data = d3.nest()
        .key(function(d){ return (d[view]); })
        .entries(allData);

    var answers = $(".answer").toArray();

    var data = [];

    nested_data.forEach(function(region){
        if ((region.key != "#N/A") && (region.key != "") && (region.key != "Not classified")) {
            var ansList = [];
            answers.forEach(function (answer) {
                var matched = 0;
                var qid = answer.id;
                var val = answer.text;
                if (qid == "QID107-1" || qid == "QID172-1") {
                    val = reversePerceptionScale[val];
                }
                region.values.forEach(function (response) {
                    if ((response[qid] == val)) {
                        matched += 1;
                    }
                });
                var total = region.values.length;
                ansList.push({
                    "text": edit(answer.text, qid),
                    "size": ((matched/total)*100).toFixed(1),
                    "region": ucwords(region.key, true),
                    "num" : matched
                });
            });
            data.push({
                "region" : ucwords(region.key, true),
                "region_num" : region.values.length,
                "answers" : ansList
            })
        }
    });
    return(data);
}

function edit(ans, qid)  {
    if (qid == "QID107-1"){
        switch (ans) {
            case "Strongly Disagree":
                return "Not at All";
            case "Disagree":
                return "Not Enough";
            case "Neutral":
                return "A Little";
            case "Agree":
                return "To an Extent";
            case "Strongly Agree":
                return "To a Great Extent";
        }
    }

    if (ans == "Special treatments (entourage, security, opening doors, holding umbrellas, special titles, etc.)"){
        return ("Special Treatments");
    }

    else if (ans == "Regular updates on progress of public works (including infrastructure)"){
        return ("Regular updates on progress of public works");
    }

    else {
        return ans;
    }

}