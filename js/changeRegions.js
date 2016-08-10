function changeRegions() {
    $("#region").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Region";
        $(".country").hide();
        $(".subregion").hide();
        $(".region").show();
        $("#piecesSVG").show('slow');
    });
    
    $("#country").click(function(){
        $("#piecesSVG").hide('slow');
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Country";
        $(".region").hide();
        $(".subregion").hide();
        $(".country").show();
    });

    $("#sub-region").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Region_Sub_WEF";
        $(".region").hide();
        $(".country").hide();
        $(".subregion").show();
        $("#piecesSVG").show('slow');
    });
}