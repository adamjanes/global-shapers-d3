function changeRegions() {
    var selection = ($("#select-region").val());

    if (selection == "Region") {
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Region";
        $("#view_class")[0].innerHTML = "region";
        $(".country").hide();
        $(".subregion").hide();
        $(".income").hide();
        $(".development").hide();
        $(".region").show();
        $("#piecesSVG").show('slow');
    }

    else if (selection == "Country") {
        $("#piecesSVG").hide();
        worldMap.reset();
        $("#view_class")[0].innerHTML = "country";
        $("#view_code")[0].innerHTML = "EmbeddedData-Country";
        $(".region").hide();
        $(".subregion").hide();
        $(".income").hide();
        $(".development").hide();
        $(".country").show();
    }

    else if (selection == "Sub-region") {
        worldMap.reset();
        $("#view_class")[0].innerHTML = "subregion";
        $("#view_code")[0].innerHTML = "EmbeddedData-Region_Sub_WEF";
        $(".region").hide();
        $(".country").hide();
        $(".income").hide();
        $(".development").hide();
        $(".subregion").show();
        $("#piecesSVG").show('slow');
    }

    else if (selection == "UNDP Index") {
        worldMap.reset();
        $("#view_class")[0].innerHTML = "development";
        $("#view_code")[0].innerHTML = "EmbeddedData-UNDP_LEVEL";
        $(".region").hide();
        $(".country").hide();
        $(".subregion").hide();
        $(".income").hide();
        $(".development").show();
        $("#piecesSVG").show('slow');
    }

    else{
        worldMap.reset();
        $("#view_class")[0].innerHTML = "income";
        $("#view_code")[0].innerHTML = "EmbeddedData-Income_WorldBank";
        $(".region").hide();
        $(".country").hide();
        $(".subregion").hide();
        $(".income").show();
        $(".development").hide();
        $("#piecesSVG").show('slow');
    }

}