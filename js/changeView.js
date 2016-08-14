function changeView() {
    $("#map").on("click", function(){
        $("#mapID2").fadeIn("slow");
        $("#view-world")[0].innerHTML = "View the world by...";
        $("#select-view").hide("slow");
    });

    $(".chart").on("click", function(){
        $("#mapID2").fadeOut("slow");
        $("#view-world")[0].innerHTML = "Select Breakdown:";
        $("#select-view").show("slow");
        changeChoose();
    });
}

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
}

function changeActive(){
    console.log("HI");
    var selected = $("#choose-regions").val();
    var view = $("#select-region").val();
    var selection = $(".piece[title='"+selected+"']");
    selection[0]["__on"][0].value(selection);
}

function ucwords(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g,
        function(firstLetter){
            return   firstLetter.toUpperCase();
        });
}