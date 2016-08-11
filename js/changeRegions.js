function changeRegions() {
    $("#region").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Region";
        $(".country").hide();
        $(".subregion").hide();
        $(".income").hide();
        $(".development").hide();
        $(".region").show();
        $("#piecesSVG").show('slow');
    });
    
    $("#country").click(function(){
        $("#piecesSVG").hide();
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Country";
        $(".region").hide();
        $(".subregion").hide();
        $(".income").hide();
        $(".development").hide();
        $(".country").show();
    });

    $("#sub-region").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Region_Sub_WEF";
        $(".region").hide();
        $(".country").hide();
        $(".income").hide();
        $(".development").hide();
        $(".subregion").show();
        $("#piecesSVG").show('slow');
    });

    $("#development").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-UNDP_LEVEL";
        $(".region").hide();
        $(".country").hide();
        $(".subregion").hide();
        $(".income").hide();
        $(".development").show();
        $("#piecesSVG").show('slow');
    });

    $("#income").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Income_WorldBank";
        $(".region").hide();
        $(".country").hide();
        $(".subregion").hide();
        $(".income").show();
        $(".development").hide();
        $("#piecesSVG").show('slow');
    });
}