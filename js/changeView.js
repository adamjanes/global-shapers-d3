function changeView() {
    $("#map").on("click", function(){
        $("#mapID2").fadeIn("slow");
        $("#view-world")[0].innerHTML = "View the world by...";
        $("#select-view").hide("slow");
        $("#select-answer").show("slow")
            .trigger("change");
        $("#totalChart").hide("slow");
        //worldMap.reset();
    });

    $(".chart").on("click", function(){
        $("#mapID2").fadeOut("slow");
        $("#view-world")[0].innerHTML = "Select Breakdown:";
        $("#select-view").show("slow");
        $("#select-answer").hide("slow");
        $("#select-insight").trigger("change");
        changeChoose();
        //console.log($(this));
        if ($(this)[0].firstChild.innerHTML != "About the Survey"){
            $("#totalChart").show("slow");
        }
        else {
            $("#totalChart").hide("slow");
        }
    });
}


$(".tabbs")
    .on("click", changeQuestions)
    .on("click", changeAnswers);


function changeChoose(){
    var opener = '<option class="option" id="all">Show All</option>';
    var nested_data = d3.nest()
        .key(function(d){ return d[$("#view_code")[0].innerHTML]; })
        .entries(allData);
    var nested_data2 = nested_data.sort(function(a, b){
        return a.key > b.key ? 1 : -1;
    });
    var body = "";
    var active  = $("#active")[0].innerHTML;
    nested_data2.forEach(function(d){
        if (d.key != "#N/A"){
            if (ucwords(d.key, true) == active){
                body += '<option selected class="option" id="' + ucwords(d.key, true) + '">' + ucwords(d.key, true) + '</option>';
            }
            else {
                body += '<option class="option" id="' + ucwords(d.key, true) + '">' + ucwords(d.key, true) + '</option>';
            }
        }
    });
    if (active == "World") {
        opener = '<option selected class="option" id="all">Show All</option>';
    }
    $("#choose-regions")[0].innerHTML = opener + body;
    $("#select-insight").trigger("change");
}

function changeActive(){
    var selected = $("#choose-regions").val();
    var view = $("#select-region").val();
    var selection = $(".piece[title='"+selected+"']");
    if (selection.toArray().length == 0){
        worldMap.reset();
    }
    else{
        selection[0]["__on"][0].value(selection);
    }
    $("#select-insight").trigger("change");
}

// Helper function to deal with Income/UNDP
function ucwords(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g,
        function(firstLetter){
            return   firstLetter.toUpperCase();
        });
}

function changeQuestions() {
    var selected = $(this)[0].id;
    var selectBox = $("#select-insight");
    var questionCategories = d3.nest()
        .key(function(d) { return d.topic; })
        .entries(allQuestions);

    if (selected == "map") {
        selectBox.show("slow");
        var opts = '<option selected class="option" id="participation">Global Shapers Survey</option>';
        questionCategories.forEach(function(topic){
            opts += '<optgroup label=' + ucwords(topic.key, true) + '>';
            topic.values.forEach(function(question){
                opts += '<option class="option">' + question["short"] + '</option>'
            });
            opts += '</optgroup>';
        });
        selectBox[0].innerHTML = opts;
    }
    else if (selected == "about"){
        selectBox.hide("slow");
    }
    else {
        selectBox.show("slow");
        questionCategories.find(function(d){
            return d.key == selected;
        }).values.forEach(function(question, i){
            if (i == 0){
                opts += '<option selected class="option">' + question["short"] + '</option>'
            }
            else{
                opts += '<option class="option">' + question["short"] + '</option>'
            }
        });

        selectBox[0].innerHTML = opts;
    }
}

function changeAnswers() {
    var ans = "";
    // Get QID
    var short = $("#select-insight").val();

    if ((short == "Global Shapers Survey") || (short == null)) {
        ans += '<option selected class="option answer">Share of Total Participants</option>';
    }

    else {
        var qid = allQuestions.find(function(d){
            return d["short"] == short;
        })["qid"];

        // Find answer columns matching that QID (QID-Xs)
        var arr = qidCodes[qid];

        // Collect all answers matching those QIDs
        var answers = [];
        var checking = [];
        var holding = [];
        if (arr.length == 1){
            allData.forEach(function(d){
                if (d[arr[0]] != ""){
                    if (checking.indexOf(d[arr[0]]) === -1) {
                        checking.push(d[arr[0]]);
                        holding.push({"key" : arr[0], "value" : d[arr[0]]});
                    }
                }
            });

            //  Rename 1, 2, 3, 4, 5 to Strongly Disagree, Disagree....
            if (isNaN(parseInt(holding[0].value)) == false){
                holding.sort(function(a, b){
                    return a.value - b.value;
                });
                holding.forEach(function(d){
                    d.value = perceptionScale[d.value];
                })
            }
            
            answers = holding;
        }
        else{
            arr.forEach(function(id){
                var relevant = allData.find(function(response){
                    var field = response[id];
                    if ((field != "") && (field != "-99") && (field != "0")){
                        return field;
                    }
                });
                if (relevant != undefined){
                    answers.push({"key" : id, "value" : relevant[id]});
                }
            });

        }

        // Add options for those answers
        answers.forEach(function(answer, i){
            if (i == 0){
                ans += '<option selected class="option answer" id="' + answer["key"] + '">' + answer["value"] + '</option>'
            }
            else{
                ans += '<option class="option answer" id="' + answer["key"] + '">' + answer["value"] + '</option>'
            }
        });
    }

    $("#select-answer")[0].innerHTML = ans;

}