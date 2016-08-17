function countData(qid, view, region) {
    var arr = qidCodes[qid];

    var answers = $(".answer").toArray();

    var data = [];
    
    if (answers[0] == "Share of Total Participants")
    {
        
    }

    // Not sorted individually
    if (region == "Show All") {
        answers.forEach(function (answer) {
            var matched = 0;
            var val = answer.text;
            arr.forEach(function (col) {
                if (col == "QID107-1" || col == "QID172-1") {
                    val = reversePerceptionScale[val];
                }
                allData.forEach(function (response) {
                    if ((response[col] == val)) {
                        matched += 1;
                    }
                });
            });
            data.push({
                "text": edit(answer.text),
                "size": ((matched/allData.length)*100).toFixed(1)
            });
        });
    }

    // Sorted by some Region (E.g. Only Africa)
    else {
        answers.forEach(function (answer) {
            var total;
            var matched = 0;
            var val = answer.text;
            arr.forEach(function (col) {
                total = 0;
                if (col == "QID107-1" || col == "QID172-1") {
                    val = reversePerceptionScale[val];
                }
                allData.forEach(function (response) {
                    if ((response[view].toUpperCase() == region.toUpperCase())){
                        if ((response[col] == val)) {
                            matched += 1;
                        }
                        total += 1;
                    }
                });
            });
            data.push({
                "text": edit(answer.text),
                "size": ((matched/total)*100).toFixed(1)
            });
        });
    }

    return (data);
}

function edit(ans)  {
    if (ans == "Special treatments (entourage, security, opening doors, holding umbrellas, special titles, etc.)"){
        return ("Special Treatments");
    }

    else if (ans == "Regular updates on progress of public works (including infrastructure)"){
        return ("Regular updates on progress of public works");
    }

    else{
        return ans;
    }
}