// When the tab changes
function changeView() {

    // Map Tab Selected
    $("#map").on("click", function(){
        $("#display")[0].innerHTML = "Map";
        $("#mapID2").fadeIn("slow");
        $("#view-world")[0].innerHTML = "View the world by...";
        $("#select-view").hide("slow");
        $("#select-answer").show("slow");
        $("#totalChart").hide("slow");
        $("#groupedChart").hide("slow");
        $("#choose-regions").show("slow");
        tabClicked();
        //worldMap.reset();
    });

    // Other Tab Selected
    $(".chart").on("click", function() {
        $("#display")[0].innerHTML = "Not-Map";
        $("#mapID2").fadeOut("slow");
        $("#view-world")[0].innerHTML = "Select Breakdown:";
        $("#select-view").show("slow");
        $("#select-answer").hide("slow");
        if ($(this)[0].firstChild.innerHTML != "About the Survey"){
            changeChart();
        }
        else {
            $("#totalChart").hide("slow");
            $("#groupedChart").hide("slow");
        }
        tabClicked();
    });
    
    // When view changes at all
    $(".tabbs").on("click", changeQuestions);
}

function tabClicked(){
    console.log("Tab Clicked");
    $("#select-insight").trigger("change");
}


// Fired when the selected view is changed, ends up updating the options
// for the region view, and fires select-insight change
function changeChoose(){
    // Show All should always be the first option
    var opener = '<option class="option" id="all">Show All</option>';

    // Get all possible regions for specified view
    var nested_data = d3.nest()
        .key(function(d){ return d[$("#view_code")[0].innerHTML]; })
        .entries(allData);
    var nested_data2 = nested_data.sort(function(a, b){
        return a.key > b.key ? 1 : -1;
    });

    var body = "";
    var active  = $("#active")[0].innerHTML;

    // Add those regions to the Region select box
    nested_data2.forEach(function(d){
        if ((d.key != "#N/A") && (d.key != "")){
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

    var chooseRegions = $("#choose-regions");
    chooseRegions[0].innerHTML = opener + body;
    chooseRegions.trigger("change");

    groupChart.wrangleData();

}

// Changes active element (accesses click function in worldMap.init()), updates totalChart
function changeActive(){
    // Get region
    var selected = $("#choose-regions").val();
    // Get view
    var view = $("#select-region").val();
    // Select the piece with that region title
    var selection = $(".piece[title='"+selected+"']");

    // If "Show All", or region doesn't exist, just reset
    if (selection.toArray().length == 0){
        worldMap.reset();
    }

    // If such a region exists, trigger clicked event, pass the value to it
    else{
        selection[0]["__on"][0].value(selection);
    }
    
    // Update Total Chart
    // totalChart.wrangleData();
}

// Helper function to deal with Income/UNDP
function ucwords(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g,
        function(firstLetter){
            return   firstLetter.toUpperCase();
        });
}


// Populates list of answers if on map, else updates bar charts
function changeQuestions() {
    var selected = $(this)[0].id;
    var selectBox = $("#select-insight");
    var questionCategories = d3.nest()
        .key(function(d) { return d.topic; })
        .entries(allQuestions);

    var opts = "";

    if (selected == "map") {
        selectBox.show("slow");
        opts = '<option selected class="option" id="participation">Global Shapers Survey</option>';
        questionCategories.forEach(function(topic){
            opts += '<optgroup label=' + ucwords(topic.key, true) + '>';
            topic.values.forEach(function(question){
                opts += '<option class="option">' + question["short"] + '</option>'
            });
            opts += '</optgroup>';
        });
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
    }

    selectBox[0].innerHTML = opts;


    /*totalChart.wrangleData();
    groupChart.wrangleData();*/
}

// Get a list of all answers could match each question, and append these as options to select-answer.
function changeAnswers() {
    // Answers String
    var ans = "";

    // Get Selected Question
    var short = $("#select-insight").val();

    // We are on the World Map, default participation rate needs to be shown
    if ((short == "Global Shapers Survey") || (short == null)) {
        ans += '<option selected class="option">Share of Total Participants</option>';
    }

    // Some other question has been selected, get that QID and use it.
    else {
        // Find the QID from the questions list
        var qid = allQuestions.find(function(d){
            return d["short"] == short;
        })["qid"];

        // Find answer columns matching that QID (QID-Xs)
        var arr = qidCodes[qid];

        // Collect all answers matching those QIDs
        var checking = [];
        var answers = [];

        // Case where we have a OneRow answer or OneToFive
        if (arr.length == 1){
            // Go through each response, add different answers
            allData.forEach(function(d){
                if (d[arr[0]] != ""){
                    if (checking.indexOf(d[arr[0]]) === -1) {
                        checking.push(d[arr[0]]);
                        answers.push({"key" : arr[0], "value" : d[arr[0]]});
                    }
                }
            });

            // Something similar happens in countData
            
            //  Rename 1, 2, 3, 4, 5 to Strongly Disagree, Disagree....
            if (isNaN(parseInt(answers[0].value)) == false){
                // Sorting the data, so will be on a sensible scale
                answers.sort(function(a, b){
                    return a.value - b.value;
                });
                answers.forEach(function(d){
                    d.value = perceptionScale[d.value];
                })
            }
        }
            
        // Seems like way too much work - we are looping through every answer, just to get one value
        // ManyRows
        else {
            // For every QID-X
            arr.forEach(function(id){
                // Loop through data, return field name
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

    // Append new ans string to Answers Select Box
    $("#select-answer")[0].innerHTML = ans;

    // After change, update the map
    worldMap.updateVis();
}

function changeChart(){
    var selected = $("#select-view").val();
    if (selected == "Totals"){
        $("#totalChart").show("slow");
        $("#groupedChart").hide("slow");
        $("#choose-regions").show("slow");
    }
    else {
        $("#groupedChart").show("slow");
        $("#totalChart").hide("slow");
        $("#choose-regions").hide("slow");
    }
    $("#select-insight").trigger("change");
}